import logging
import math
import uuid
from decimal import Decimal
from datetime import timedelta

from django.utils import timezone
from django.db import transaction
from django.db.models import QuerySet

from bidding.models import CompanyBid, CompanyBill
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


def get_eligible_merchants_for_bid(pickup_request: PickupRequest) -> QuerySet:
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


def submit_bid(pickup_request_id: int, merchant_account: Account, bid_rate_per_kg: Decimal) -> CompanyBid:
    """
    Submits or updates a bid for a specific pickup request.
    
    Args:
        pickup_request_id (int): The ID of the pickup request.
        merchant_account (Account): The merchant submitting the bid.
        bid_rate_per_kg (Decimal): The proposed bid amount.
        
    Returns:
        CompanyBid: The created or updated CompanyBid.
        
    Raises:
        PermissionError: If the account is not a MERCHANT or is outside the eligible radius.
        ValueError: If the bidding window has closed or the bid_rate_per_kg is non-positive.
        TypeError: If bid_rate_per_kg is not a Decimal.
    """
    if getattr(merchant_account, 'role', None) != Account.Role.MERCHANT:
        raise PermissionError("Only MERCHANT accounts can submit bids.")
        
    if not isinstance(bid_rate_per_kg, Decimal):
        raise TypeError("bid_rate_per_kg must be a Decimal.")
    if bid_rate_per_kg <= Decimal('0'):
        raise ValueError("bid_rate_per_kg must be a positive Decimal.")
        
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
        eligible_merchants = get_eligible_merchants_for_bid(pickup_request)
        if not eligible_merchants.filter(account=merchant_account).exists():
            raise PermissionError("You are outside the eligible 55km radius for this pickup request.")
            
        # Enforce unique_together constraint gracefully with update_or_create
        bid, created = CompanyBid.objects.update_or_create(
            pickup_request=pickup_request,
            merchant=merchant_account,
            defaults={'bid_rate_per_kg': bid_rate_per_kg}
        )
        
        action = "Submitted" if created else "Updated"
        logger.info(f"{action} bid of {bid_rate_per_kg} by merchant {merchant_account.phone_number} on PickupRequest {pickup_request_id}.")
        return bid


def close_bidding_window(pickup_request_id: int) -> CompanyBid:
    """
    Selects the winning bid for a pickup request once the 24-hour window has closed.
    This will be called by a Celery task.
    
    Args:
        pickup_request_id (int): The ID of the pickup request to close.
        
    Returns:
        CompanyBid: The winning CompanyBid, or None if no bids were received.
        
    Raises:
        ValueError: If the pickup request does not exist.
    """
    with transaction.atomic():
        try:
            pickup_request = PickupRequest.objects.select_for_update().get(id=pickup_request_id)
        except PickupRequest.DoesNotExist:
            raise ValueError(f"PickupRequest {pickup_request_id} does not exist.")
            
        # Select the bid with the highest amount. 
        # Tie-breaking rule: If multiple bids have the same highest amount, 
        # the earliest submitted_at breaks the tie.
        winning_bid = CompanyBid.objects.filter(pickup_request=pickup_request).order_by('-bid_rate_per_kg', 'submitted_at').first()
        
        if not winning_bid:
            # Handle gracefully if no bids were received
            pickup_request.status = PickupRequest.Status.CLOSED
            pickup_request.save(update_fields=['status'])
            
            # TODO: No bids found. This should notify the Company and Admin to handle the unfulfilled request.
            # Actual notification delivery is out of scope for this function.
            logger.warning(f"No bids received for Company PickupRequest {pickup_request_id}. Closed request.")
            return None
            
        winning_bid.is_winner = True
        winning_bid.save(update_fields=['is_winner'])
        
        pickup_request.status = PickupRequest.Status.ACCEPTED
        pickup_request.save(update_fields=['status'])
        
        logger.info(
            f"Selected winning bid for PickupRequest {pickup_request_id}: "
            f"Merchant {winning_bid.merchant.phone_number} with {winning_bid.bid_rate_per_kg}."
        )
        return winning_bid


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


def finalize_company_bill(company_bid: CompanyBid, actual_weight_kg: Decimal) -> CompanyBill:
    """
    Finalizes the transaction and calculates commission for the winning company bid,
    using the actual collected weight to generate a proper CompanyBill.
    
    Args:
        company_bid (CompanyBid): The winning bid to finalize.
        actual_weight_kg (Decimal): The actual weight collected at pickup.
        
    Returns:
        CompanyBill: The generated company bill.
        
    Raises:
        ValueError: If the company bid is not the winner.
        TypeError: If actual_weight_kg is not a Decimal.
    """
    if not isinstance(actual_weight_kg, Decimal):
        raise TypeError("actual_weight_kg must be a Decimal.")
        
    if not company_bid.is_winner:
        raise ValueError("Cannot finalize a bill for a bid that has not won.")
        
    with transaction.atomic():
        # NOTE: Since the CompanyBid model does not distinguish between a per-unit rate
        # and a flat total bid, and since actual weight is only known at pickup time,
        # CompanyBid.bid_rate_per_kg inherently acts as a per-unit rate. We calculate the
        # actual total amount by multiplying the actual weight by the bid amount.
        total_amount = actual_weight_kg * company_bid.bid_rate_per_kg
        
        transaction_type = "COMPANY_PICKUP"
        commission_amount = calculate_commission(total_amount, transaction_type)
        commission_rate = get_active_commission_rate(transaction_type)
        
        payment_reference = f"CBILL-{uuid.uuid4().hex[:12].upper()}"
        
        bill = CompanyBill.objects.create(
            company_bid=company_bid,
            merchant=company_bid.merchant,
            weight_kg=actual_weight_kg,
            total_amount=total_amount,
            commission_rate=commission_rate,
            commission_amount=commission_amount,
            payment_reference=payment_reference,
            status=CompanyBill.Status.PENDING
        )
        
        create_settlement_record(
            merchant_account=company_bid.merchant,
            gross_transacted_value=total_amount,
            transaction_type=transaction_type,
            source_reference_id=str(bill.id)
        )
        
        logger.info(
            f"Finalized CompanyBill {bill.id} for CompanyBid {company_bid.id} "
            f"with actual weight {actual_weight_kg}kg, total amount {total_amount}, "
            f"and commission {commission_amount}."
        )
        
        return bill
