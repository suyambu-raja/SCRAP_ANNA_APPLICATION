import logging
import math
import uuid
from decimal import Decimal
from datetime import timedelta

from django.utils import timezone
from django.db import transaction
from django.db.models import QuerySet

from bidding.models import CompanyOffer, CompanyBill
from pickups.models import PickupRequest
from accounts.models import Account, MerchantProfile
from settlements.services import calculate_commission, create_settlement_record, get_active_commission_rate

logger = logging.getLogger(__name__)


def create_company_pickup_request(company_account: Account, category_id: int, latitude: Decimal, longitude: Decimal) -> PickupRequest:
    """
    Creates a PickupRequest for a Company.
    This flow is solely for Company accounts and does not enforce a time-of-day restriction.
    
    Args:
        company_account (Account): The company account creating the request.
        category_id (int): The ID of the scrap category.
        latitude (Decimal): The pickup location latitude.
        longitude (Decimal): The pickup location longitude.
        
    Returns:
        PickupRequest: The created pickup request in PENDING status.
        
    Raises:
        PermissionError: If the account is not a COMPANY.
        TypeError: If latitude or longitude are not Decimals.
    """
    if getattr(company_account, 'role', None) != Account.Role.COMPANY:
        raise PermissionError("Only COMPANY accounts can create requests through this flow.")
        
    if not isinstance(latitude, Decimal) or not isinstance(longitude, Decimal):
        raise TypeError("latitude and longitude must be Decimal instances.")
        
    # Note: This does NOT create any Lead rows, since Company never uses the direct-accept flow.
    # We use PENDING to indicate it is open for bidding.
    request = PickupRequest.objects.create(
        source=company_account,
        category_id=category_id,
        latitude=latitude,
        longitude=longitude,
        status=PickupRequest.Status.PENDING
    )
    
    logger.info(f"Created Company PickupRequest {request.id} for {company_account.phone_number}. Open for bidding.")
    return request


def get_eligible_merchants_for_offer(pickup_request: PickupRequest) -> QuerySet:
    """
    Finds all active and verified MerchantProfile rows within the default 55km radius.
    All tiers are eligible.
    
    Args:
        pickup_request (PickupRequest): The pickup request to check eligibility against.
        
    Returns:
        QuerySet: A queryset of eligible MerchantProfile objects.
    """
    radius_km = 55.0
    lat = float(pickup_request.latitude)
    lon = float(pickup_request.longitude)
    
    # Calculate simple bounding box for latitude/longitude
    lat_diff = radius_km / 111.0
    cos_lat = math.cos(math.radians(lat))
    lon_diff = radius_km / (111.0 * cos_lat) if cos_lat != 0 else 0
    
    min_lat = Decimal(str(lat - lat_diff))
    max_lat = Decimal(str(lat + lat_diff))
    min_lon = Decimal(str(lon - lon_diff))
    max_lon = Decimal(str(lon + lon_diff))
    
    return MerchantProfile.objects.filter(
        account__is_active=True,
        account__is_verified=True,
        latitude__gte=min_lat,
        latitude__lte=max_lat,
        longitude__gte=min_lon,
        longitude__lte=max_lon
    )


def submit_offer(pickup_request_id: int, merchant_account: Account, offer_amount: Decimal) -> CompanyOffer:
    """
    Submits a sealed one-time offer for a specific pickup request.
    
    Args:
        pickup_request_id (int): The ID of the pickup request.
        merchant_account (Account): The merchant submitting the offer.
        offer_amount (Decimal): The proposed offer amount.
        
    Returns:
        CompanyOffer: The created CompanyOffer.
        
    Raises:
        PermissionError: If the account is not a MERCHANT, outside the eligible radius, or has already submitted an offer.
        ValueError: If the bidding window has closed or the offer_amount is non-positive.
        TypeError: If offer_amount is not a Decimal.
    """
    if getattr(merchant_account, 'role', None) != Account.Role.MERCHANT:
        raise PermissionError("Only MERCHANT accounts can submit offers.")
        
    if not isinstance(offer_amount, Decimal):
        raise TypeError("offer_amount must be a Decimal.")
    if offer_amount <= Decimal('0'):
        raise ValueError("offer_amount must be a positive Decimal.")
        
    with transaction.atomic():
        try:
            pickup_request = PickupRequest.objects.get(id=pickup_request_id)
        except PickupRequest.DoesNotExist:
            raise ValueError(f"PickupRequest {pickup_request_id} does not exist.")
            
        now = timezone.now()
        window_close_time = pickup_request.requested_at + timedelta(hours=24)
        if now > window_close_time:
            raise ValueError("The 24-hour bidding window for this request has closed.")
            
        # Verify merchant eligibility via radius
        eligible_merchants = get_eligible_merchants_for_offer(pickup_request)
        if not eligible_merchants.filter(account=merchant_account).exists():
            raise PermissionError("You are outside the eligible 55km radius for this pickup request.")
            
        # Enforce sealed one-time offer rule
        if CompanyOffer.objects.filter(pickup_request=pickup_request, merchant=merchant_account).exists():
            raise PermissionError("Only one sealed offer is allowed per merchant per order. You cannot revise or resubmit.")
            
        # Create the offer (database unique constraint still acts as a backstop)
        offer = CompanyOffer.objects.create(
            pickup_request=pickup_request,
            merchant=merchant_account,
            offer_amount=offer_amount
        )
        
        logger.info(f"Submitted offer of {offer_amount} by merchant {merchant_account.phone_number} on PickupRequest {pickup_request_id}.")
        return offer


def close_bidding_window(pickup_request_id: int) -> CompanyOffer:
    """
    Selects the winning offer for a pickup request once the 24-hour window has closed.
    This will be called by a Celery task.
    
    Args:
        pickup_request_id (int): The ID of the pickup request to close.
        
    Returns:
        CompanyOffer: The winning CompanyOffer, or None if no offers were received.
        
    Raises:
        ValueError: If the pickup request does not exist.
    """
    with transaction.atomic():
        try:
            pickup_request = PickupRequest.objects.select_for_update().get(id=pickup_request_id)
        except PickupRequest.DoesNotExist:
            raise ValueError(f"PickupRequest {pickup_request_id} does not exist.")
            
        # Select the offer with the highest amount. 
        # Tie-breaking rule: If multiple offers have the same highest amount, 
        # the earliest submitted_at breaks the tie.
        winning_offer = CompanyOffer.objects.filter(pickup_request=pickup_request).order_by('-offer_amount', 'submitted_at').first()
        
        if not winning_offer:
            # Handle gracefully if no offers were received
            pickup_request.status = PickupRequest.Status.CLOSED
            pickup_request.save(update_fields=['status'])
            
            # TODO: No offers found. This should notify the Company and Admin to handle the unfulfilled request.
            # Actual notification delivery is out of scope for this function.
            logger.warning(f"No offers received for Company PickupRequest {pickup_request_id}. Closed request.")
            return None
            
        winning_offer.is_winner = True
        winning_offer.save(update_fields=['is_winner'])
        
        pickup_request.status = PickupRequest.Status.ACCEPTED
        pickup_request.save(update_fields=['status'])
        
        logger.info(
            f"Selected winning offer for PickupRequest {pickup_request_id}: "
            f"Merchant {winning_offer.merchant.phone_number} with {winning_offer.offer_amount}."
        )
        return winning_offer


def get_bidding_windows_ready_to_close() -> QuerySet:
    """
    Returns PickupRequest rows created by COMPANY accounts where the 24-hour window has passed
    and no winner has been selected (status is still PENDING).
    
    Returns:
        QuerySet: A queryset of candidate PickupRequest objects.
    """
    cutoff_time = timezone.now() - timedelta(hours=24)
    return PickupRequest.objects.filter(
        source__role=Account.Role.COMPANY,
        requested_at__lt=cutoff_time,
        status=PickupRequest.Status.PENDING
    )


def finalize_company_bill(company_offer: CompanyOffer, actual_weight_kg: Decimal) -> CompanyBill:
    """
    Finalizes the transaction and calculates commission for the winning company offer,
    using the actual collected weight to generate a proper CompanyBill.
    
    Args:
        company_offer (CompanyOffer): The winning offer to finalize.
        actual_weight_kg (Decimal): The actual weight collected at pickup.
        
    Returns:
        CompanyBill: The generated company bill.
        
    Raises:
        ValueError: If the company offer is not the winner.
        TypeError: If actual_weight_kg is not a Decimal.
    """
    if not isinstance(actual_weight_kg, Decimal):
        raise TypeError("actual_weight_kg must be a Decimal.")
        
    if not company_offer.is_winner:
        raise ValueError("Cannot finalize a bill for an offer that has not won.")
        
    with transaction.atomic():
        # NOTE: Since the CompanyOffer model does not distinguish between a per-unit rate
        # and a flat total offer, and since actual weight is only known at pickup time,
        # CompanyOffer.offer_amount inherently acts as a per-unit rate. We calculate the
        # actual total amount by multiplying the actual weight by the offer amount.
        total_amount = actual_weight_kg * company_offer.offer_amount
        
        transaction_type = "COMPANY_PICKUP"
        commission_amount = calculate_commission(total_amount, transaction_type)
        commission_rate = get_active_commission_rate(transaction_type)
        
        payment_reference = f"CBILL-{uuid.uuid4().hex[:12].upper()}"
        
        bill = CompanyBill.objects.create(
            company_offer=company_offer,
            merchant=company_offer.merchant,
            weight_kg=actual_weight_kg,
            total_amount=total_amount,
            commission_rate=commission_rate,
            commission_amount=commission_amount,
            payment_reference=payment_reference,
            status=CompanyBill.Status.PENDING
        )
        
        create_settlement_record(
            merchant_account=company_offer.merchant,
            gross_transacted_value=total_amount,
            transaction_type=transaction_type,
            source_reference_id=str(bill.id)
        )
        
        logger.info(
            f"Finalized CompanyBill {bill.id} for CompanyOffer {company_offer.id} "
            f"with actual weight {actual_weight_kg}kg, total amount {total_amount}, "
            f"and commission {commission_amount}."
        )
        
        return bill


def send_offer_window_reminders() -> dict:
    """
    Sends reminders for open Company PickupRequests at 0, 12, and 21 hours elapsed.
    """
    now = timezone.now()
    open_requests = PickupRequest.objects.filter(
        source__role=Account.Role.COMPANY,
        status=PickupRequest.Status.PENDING
    )
    
    # Local import to prevent circular dependencies
    from notifications.services import notify
    
    requests_processed = 0
    reminders_sent = 0
    
    for pickup_request in open_requests:
        hours_elapsed = (now - pickup_request.requested_at).total_seconds() / 3600.0
        
        time_remaining = None
        mark_start = False
        mark_halfway = False
        mark_final = False
        
        # Use elif branching so only the most relevant/latest-due threshold fires.
        # If the task didn't run for a while, we retroactive-catch-up the earlier flags.
        # e.g., if we hit >= 12, we mark both start and halfway sent so start doesn't fire later.
        if hours_elapsed >= 21 and not pickup_request.offer_reminder_final_sent:
            time_remaining = "3 hours"
            mark_start = True
            mark_halfway = True
            mark_final = True
        elif hours_elapsed >= 12 and not pickup_request.offer_reminder_halfway_sent:
            time_remaining = "12 hours"
            mark_start = True
            mark_halfway = True
        elif hours_elapsed >= 0 and not pickup_request.offer_reminder_start_sent:
            time_remaining = "24 hours"
            mark_start = True
            
        if not time_remaining:
            continue
            
        requests_processed += 1
        
        # Get eligible merchants and exclude those who already offered
        eligible_merchants = get_eligible_merchants_for_offer(pickup_request)
        already_offered_merchant_ids = CompanyOffer.objects.filter(
            pickup_request=pickup_request
        ).values_list('merchant_id', flat=True)
        
        merchants_to_notify = eligible_merchants.exclude(
            account_id__in=already_offered_merchant_ids
        )
        
        category_name = pickup_request.category.name if pickup_request.category else "Scrap"
        
        for merchant_prof in merchants_to_notify:
            try:
                notify(
                    account=merchant_prof.account,
                    notification_type="OFFER_WINDOW_CLOSING",
                    context={
                        "category": category_name,
                        "time_remaining": time_remaining
                    }
                )
                reminders_sent += 1
            except Exception as e:
                logger.warning(f"Failed to send OFFER_WINDOW_CLOSING to {merchant_prof.account.phone_number}: {e}")
                
        # Save the appropriate flag(s) as True
        update_fields = []
        if mark_start and not pickup_request.offer_reminder_start_sent:
            pickup_request.offer_reminder_start_sent = True
            update_fields.append('offer_reminder_start_sent')
        if mark_halfway and not pickup_request.offer_reminder_halfway_sent:
            pickup_request.offer_reminder_halfway_sent = True
            update_fields.append('offer_reminder_halfway_sent')
        if mark_final and not pickup_request.offer_reminder_final_sent:
            pickup_request.offer_reminder_final_sent = True
            update_fields.append('offer_reminder_final_sent')
            
        if update_fields:
            pickup_request.save(update_fields=update_fields)
            
    return {
        "requests_processed": requests_processed,
        "reminders_sent": reminders_sent
    }
