import logging
import math
import uuid
from decimal import Decimal
from typing import List
from datetime import timedelta

from django.utils import timezone
from django.db import transaction
from django.db.models import QuerySet

from pickups.models import PickupRequest, Lead, Bill, RangeOverride
from accounts.models import Account, MerchantProfile, UserProfile
from catalog.services import validate_price_within_range
from settlements.services import (
    calculate_commission,
    get_active_commission_rate,
    create_settlement_record
)

logger = logging.getLogger(__name__)


def create_pickup_request(source_account: Account, category_id: int, latitude: Decimal, longitude: Decimal) -> PickupRequest:
    """
    Creates a new PickupRequest for a User. Enforces the 9 AM - 9 PM ordering window.
    
    Args:
        source_account (Account): The user account creating the request.
        category_id (int): The ID of the scrap category.
        latitude (Decimal): The pickup location latitude.
        longitude (Decimal): The pickup location longitude.
        
    Returns:
        PickupRequest: The created pickup request in PENDING status.
        
    Raises:
        PermissionError: If the source_account is a COMPANY.
        ValueError: If a USER attempts to order outside the 9 AM - 9 PM window.
        TypeError: If latitude or longitude are not Decimals.
    """
    if getattr(source_account, 'role', None) == Account.Role.COMPANY:
        raise PermissionError(
            "COMPANY accounts cannot create User pickups. "
            "Please use the bidding app's request flow for company orders."
        )
        
    if getattr(source_account, 'role', None) == Account.Role.USER:
        local_time = timezone.localtime(timezone.now())
        if not (9 <= local_time.hour < 21):
            raise ValueError("Pickup requests can only be created between 9 AM and 9 PM.")
            
    if not isinstance(latitude, Decimal) or not isinstance(longitude, Decimal):
        raise TypeError("latitude and longitude must be Decimal instances.")
            
    request = PickupRequest.objects.create(
        source=source_account,
        category_id=category_id,
        latitude=latitude,
        longitude=longitude,
        status=PickupRequest.Status.PENDING
    )
    
    logger.info(f"Created PickupRequest {request.id} for {source_account.phone_number}")
    return request


def resolve_radius_km(user_profile: UserProfile) -> Decimal:
    """
    Resolves the allowed search radius in kilometers based on the user's location type.
    
    Args:
        user_profile (UserProfile): The user's profile containing their location type.
        
    Returns:
        Decimal: The radius in kilometers (10 for CITY, 20 for TOWN, 35 for VILLAGE).
        
    Raises:
        ValueError: For any unexpected location_type.
    """
    loc_type = user_profile.location_type
    if loc_type == UserProfile.LocationType.CITY:
        return Decimal('10.0')
    elif loc_type == UserProfile.LocationType.TOWN:
        return Decimal('20.0')
    elif loc_type == UserProfile.LocationType.VILLAGE:
        return Decimal('35.0')
    else:
        raise ValueError(f"Unexpected location_type: {loc_type}")


def broadcast_lead_to_merchants(pickup_request: PickupRequest) -> List[Lead]:
    """
    Finds eligible merchants within the resolved radius and creates a Lead for each.
    
    Args:
        pickup_request (PickupRequest): The pickup request to broadcast.
        
    Returns:
        List[Lead]: A list of created Lead objects.
    """
    try:
        user_profile = pickup_request.source.user_profile
        radius_km = resolve_radius_km(user_profile)
    except Exception:
        # Fallback if no user profile exists for some reason
        radius_km = Decimal('10.0')
        
    lat = float(pickup_request.latitude)
    lon = float(pickup_request.longitude)
    radius = float(radius_km)
    
    # Calculate simple bounding box for latitude/longitude
    # 1 degree latitude is approx 111 km. 
    # 1 degree longitude is approx 111 * cos(latitude) km.
    lat_diff = radius / 111.0
    cos_lat = math.cos(math.radians(lat))
    lon_diff = radius / (111.0 * cos_lat) if cos_lat != 0 else 0
    
    min_lat = Decimal(str(lat - lat_diff))
    max_lat = Decimal(str(lat + lat_diff))
    min_lon = Decimal(str(lon - lon_diff))
    max_lon = Decimal(str(lon + lon_diff))
    
    # Find active & verified merchants within the bounding box
    eligible_merchants = MerchantProfile.objects.filter(
        account__is_active=True,
        account__is_verified=True,
        latitude__gte=min_lat,
        latitude__lte=max_lat,
        longitude__gte=min_lon,
        longitude__lte=max_lon
    )
    
    created_leads = []
    
    with transaction.atomic():
        if not eligible_merchants.exists():
            # Update the request to indicate failure to find merchants (closing it).
            pickup_request.status = PickupRequest.Status.CLOSED
            pickup_request.save(update_fields=['status'])
            
            # TODO: No eligible merchants found. This should trigger an Admin notification 
            # to handle the unserviceable request manually or apply an override. 
            # Actual notification delivery is out of scope for this file.
            logger.warning(f"No merchants found for PickupRequest {pickup_request.id} within {radius_km}km. Closed request.")
            return []
            
        for merchant_prof in eligible_merchants:
            lead = Lead.objects.create(
                pickup_request=pickup_request,
                merchant=merchant_prof.account,
                radius_used_km=radius_km,
                status=Lead.Status.BROADCASTED
            )
            created_leads.append(lead)
            
        pickup_request.status = PickupRequest.Status.BROADCASTED
        pickup_request.save(update_fields=['status'])
        
    # TODO: Pushing this broadcast over WebSocket happens in the realtime app's consumer,
    # not here. This function only creates the necessary database records.
    return created_leads


def accept_lead(lead_id: int, merchant_account: Account) -> Lead:
    """
    Accepts a broadcasted lead for a merchant.
    
    Args:
        lead_id (int): The ID of the lead to accept.
        merchant_account (Account): The merchant attempting to accept the lead.
        
    Returns:
        Lead: The updated lead in ACCEPTED status.
        
    Raises:
        ValueError: If the lead does not exist, is no longer available, or if the parent 
                    pickup request has already been accepted by someone else.
        PermissionError: If the merchant account does not match the lead's pre-assigned merchant.
    """
    with transaction.atomic():
        # Select for update to prevent race conditions during acceptance
        try:
            lead = Lead.objects.select_for_update().get(id=lead_id)
        except Lead.DoesNotExist:
            raise ValueError(f"Lead {lead_id} does not exist.")
            
        if lead.status != Lead.Status.BROADCASTED:
            raise ValueError("Lead is no longer available in BROADCASTED status (it may have been accepted or expired).")
            
        # Design note: Lead.merchant is pre-assigned to a specific merchant during broadcast.
        # We must verify the accepting merchant matches the pre-assigned one.
        if lead.merchant_id != merchant_account.id:
            raise PermissionError("This lead was not broadcasted to your account.")
            
        # Lock and verify the parent pickup request is still available
        pickup_request = PickupRequest.objects.select_for_update().get(id=lead.pickup_request_id)
        
        if pickup_request.status != PickupRequest.Status.BROADCASTED:
            raise ValueError("The parent pickup request has already been accepted or is no longer available.")
            
        now = timezone.now()
        
        lead.status = Lead.Status.ACCEPTED
        lead.accepted_at = now
        lead.collection_deadline = now + timedelta(hours=24)
        lead.save(update_fields=['status', 'accepted_at', 'collection_deadline'])
        
        pickup_request.status = PickupRequest.Status.ACCEPTED
        pickup_request.save(update_fields=['status'])
        
        # Clean up sibling leads that were also broadcasted for this pickup request
        sibling_leads = Lead.objects.filter(
            pickup_request=pickup_request,
            status=Lead.Status.BROADCASTED
        ).exclude(id=lead.id)
        
        closed_count = sibling_leads.update(status=Lead.Status.EXPIRED)
        
        logger.info(
            f"Lead {lead.id} accepted by merchant {merchant_account.phone_number}. "
            f"Closed {closed_count} sibling leads as EXPIRED."
        )
        
    return lead


def get_expired_leads() -> QuerySet:
    """
    Returns all Lead rows where status=ACCEPTED and collection_deadline has passed.
    
    Returns:
        QuerySet: A queryset of expired Lead objects.
    """
    return Lead.objects.filter(
        status=Lead.Status.ACCEPTED,
        collection_deadline__lt=timezone.now()
    )


def record_weight_and_price(lead_id: int, weight_kg: Decimal, price_per_unit: Decimal) -> Bill:
    """
    Records the final weight and price for an accepted lead, generating a Bill and Settlement.
    
    Args:
        lead_id (int): The ID of the accepted lead.
        weight_kg (Decimal): The recorded weight in kilograms.
        price_per_unit (Decimal): The merchant-entered price per unit.
        
    Returns:
        Bill: The generated bill.
        
    Raises:
        TypeError: If weight_kg or price_per_unit are not Decimals.
        ValueError: If the lead is not ACCEPTED or if the price is outside the allowed catalog range.
    """
    if not isinstance(weight_kg, Decimal) or not isinstance(price_per_unit, Decimal):
        raise TypeError("weight_kg and price_per_unit must be Decimal instances.")
        
    with transaction.atomic():
        try:
            lead = Lead.objects.select_related('pickup_request', 'merchant').get(id=lead_id)
        except Lead.DoesNotExist:
            raise ValueError(f"Lead {lead_id} does not exist.")
            
        if lead.status != Lead.Status.ACCEPTED:
            raise ValueError(f"Lead must be in ACCEPTED status to record weight and price. Current status is {lead.status}.")
            
        category_id = lead.pickup_request.category_id
        if not validate_price_within_range(category_id, price_per_unit):
            raise ValueError(f"price_per_unit {price_per_unit} is out of the active daily range for this category.")
            
        total_amount = weight_kg * price_per_unit
        transaction_type = "USER_PICKUP"
        
        commission_amount = calculate_commission(total_amount, transaction_type)
        commission_rate = get_active_commission_rate(transaction_type)
        
        source_copy_ref = f"SRC-{uuid.uuid4().hex[:12].upper()}"
        merchant_copy_ref = f"MER-{uuid.uuid4().hex[:12].upper()}"
        
        bill = Bill.objects.create(
            lead=lead,
            merchant=lead.merchant,
            weight_kg=weight_kg,
            price_per_unit=price_per_unit,
            total_amount=total_amount,
            commission_rate=commission_rate,
            commission_amount=commission_amount,
            source_copy_ref=source_copy_ref,
            merchant_copy_ref=merchant_copy_ref
        )
        
        lead.status = Lead.Status.COLLECTED
        lead.save(update_fields=['status'])
        
        pickup_req = lead.pickup_request
        pickup_req.status = PickupRequest.Status.COLLECTED
        pickup_req.save(update_fields=['status'])
        
        # Automatically trigger settlement creation for this bill
        create_settlement_record(
            merchant_account=lead.merchant,
            gross_transacted_value=total_amount,
            transaction_type=transaction_type,
            source_reference_id=str(bill.id)
        )
        
        logger.info(f"Generated Bill {bill.id} and Settlement for Lead {lead.id}.")
        return bill


def apply_range_override(pickup_request_id: int, new_radius_km: Decimal, admin_account: Account) -> RangeOverride:
    """
    Applies a manual range override for a pickup request to expand the search radius.
    
    Args:
        pickup_request_id (int): The ID of the pickup request to override.
        new_radius_km (Decimal): The new radius in kilometers.
        admin_account (Account): The admin account issuing the override.
        
    Returns:
        RangeOverride: The created range override record.
        
    Raises:
        PermissionError: If admin_account is not an ADMIN.
        TypeError: If new_radius_km is not a Decimal.
        ValueError: If the pickup request does not exist.
    """
    if getattr(admin_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("Only ADMIN accounts can apply a range override.")
        
    if not isinstance(new_radius_km, Decimal):
        raise TypeError("new_radius_km must be a Decimal.")
        
    try:
        pickup_req = PickupRequest.objects.get(id=pickup_request_id)
    except PickupRequest.DoesNotExist:
        raise ValueError(f"PickupRequest {pickup_request_id} does not exist.")
        
    override = RangeOverride.objects.create(
        pickup_request=pickup_req,
        new_radius_km=new_radius_km,
        set_by=admin_account
    )
    
    # TODO: Applying a range override should trigger a re-broadcast of the lead using the 
    # new radius, and notify the source user of a possible delay. The actual re-broadcast 
    # trigger and notifications are out of scope for this function.
    logger.info(
        f"Admin {admin_account.phone_number} applied a range override of {new_radius_km}km "
        f"for PickupRequest {pickup_request_id}."
    )
    
    return override
