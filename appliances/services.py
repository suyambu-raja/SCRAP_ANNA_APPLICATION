import logging
from decimal import Decimal
from django.utils import timezone
from django.db import transaction
from django.db.models import QuerySet

from appliances.models import ApplianceListing
from accounts.models import Account

logger = logging.getLogger(__name__)


def create_appliance_listing(user_account: Account, item_type: str, condition: str, photo_urls: list) -> ApplianceListing:
    """
    Creates a new appliance listing for a user within the 9 AM - 9 PM window.

    Args:
        user_account (Account): The user account creating the listing.
        item_type (str): The type of appliance (e.g. "Refrigerator").
        condition (str): The condition of the appliance (must match Condition choices).
        photo_urls (list): A non-empty list of photo URLs.

    Returns:
        ApplianceListing: The newly created appliance listing in LISTED status.

    Raises:
        PermissionError: If the user role is not USER.
        ValueError: If outside the ordering window, condition is invalid, or photo_urls is empty.
    """
    if getattr(user_account, 'role', None) != Account.Role.USER:
        raise PermissionError("Only USER accounts can create appliance listings.")

    # Enforce 9 AM to 9 PM window
    current_hour = timezone.localtime(timezone.now()).hour
    if not (9 <= current_hour < 21):
        raise ValueError("Appliance listings can only be created between 9 AM and 9 PM.")

    # Validate condition
    if condition not in ApplianceListing.Condition.values:
        raise ValueError(f"Invalid condition. Must be one of: {ApplianceListing.Condition.values}")

    # Validate photo_urls
    if not photo_urls or not isinstance(photo_urls, list) or len(photo_urls) == 0:
        raise ValueError("photo_urls must be a non-empty list.")

    listing = ApplianceListing.objects.create(
        user=user_account,
        item_type=item_type,
        condition=condition,
        photo_urls=photo_urls,
        status=ApplianceListing.Status.LISTED
    )
    
    logger.info(f"Created ApplianceListing {listing.id} for user {user_account.phone_number}.")
    return listing


def get_visible_listings_for_merchant(merchant_account: Account) -> QuerySet:
    """
    Returns all visible (LISTED status) appliance listings for a given merchant.

    Args:
        merchant_account (Account): The merchant requesting the listings.

    Returns:
        QuerySet: A queryset of ApplianceListing objects in LISTED status.

    Raises:
        PermissionError: If the account is not a MERCHANT, or if not active and verified.
    """
    if getattr(merchant_account, 'role', None) != Account.Role.MERCHANT:
        raise PermissionError("Only MERCHANT accounts can view appliance listings.")
    
    if not merchant_account.is_active or not merchant_account.is_verified:
        raise PermissionError("Only active and verified merchants can view appliance listings.")

    # TODO: "visible to nearby merchants" per PRD. 
    # Radius filtering rules are currently undefined for the appliances flow. 
    # For now, returning all LISTED listings. This must be updated once radius rules are clarified.
    return ApplianceListing.objects.filter(status=ApplianceListing.Status.LISTED)


def accept_listing(listing_id: int, merchant_account: Account) -> ApplianceListing:
    """
    Accepts an appliance listing on a first-come-first-served basis.

    Args:
        listing_id (int): The ID of the listing to accept.
        merchant_account (Account): The merchant accepting the listing.

    Returns:
        ApplianceListing: The updated listing with status=ACCEPTED.

    Raises:
        ValueError: If the listing does not exist or is not in LISTED status.
        PermissionError: If merchant_account is not an active/verified MERCHANT.
    """
    if getattr(merchant_account, 'role', None) != Account.Role.MERCHANT:
        raise PermissionError("Only MERCHANT accounts can accept appliance listings.")
        
    if not merchant_account.is_active or not merchant_account.is_verified:
        raise PermissionError("Only active and verified merchants can accept appliance listings.")

    with transaction.atomic():
        try:
            # Use select_for_update to prevent race conditions during acceptance
            listing = ApplianceListing.objects.select_for_update().get(id=listing_id)
        except ApplianceListing.DoesNotExist:
            raise ValueError(f"ApplianceListing {listing_id} does not exist.")

        if listing.status != ApplianceListing.Status.LISTED:
            raise ValueError("This listing has already been accepted or is no longer available.")

        listing.status = ApplianceListing.Status.ACCEPTED
        listing.accepted_merchant = merchant_account
        listing.save(update_fields=['status', 'accepted_merchant'])
        
        logger.info(f"Merchant {merchant_account.phone_number} accepted ApplianceListing {listing.id}.")
        return listing


def record_final_price(listing_id: int, merchant_account: Account, agreed_price: Decimal) -> ApplianceListing:
    """
    Records the final negotiated price at the point of pickup and transitions status to COLLECTED.

    GAP IDENTIFIED: 
    The `ApplianceListing` model currently has no suitable field to store the final `agreed_price`, weight, or payment reference.
    
    TODO / FIXME: A proper ApplianceBill model (mirroring pickups.Bill and bidding.CompanyBill) 
    is needed before commission/settlement can actually be recorded here. We must skip the settlement call 
    entirely in this case rather than calling it with incomplete data.
    
    Args:
        listing_id (int): The ID of the listing.
        merchant_account (Account): The merchant recording the price.
        agreed_price (Decimal): The final negotiated price in-person.

    Returns:
        ApplianceListing: The updated listing with status=COLLECTED.

    Raises:
        ValueError: If the listing is not in ACCEPTED status.
        PermissionError: If the merchant account does not match the accepted merchant.
        TypeError: If agreed_price is not a Decimal.
    """
    if not isinstance(agreed_price, Decimal):
        raise TypeError("agreed_price must be a Decimal.")

    with transaction.atomic():
        try:
            listing = ApplianceListing.objects.select_for_update().get(id=listing_id)
        except ApplianceListing.DoesNotExist:
            raise ValueError(f"ApplianceListing {listing_id} does not exist.")

        if listing.status != ApplianceListing.Status.ACCEPTED:
            raise ValueError("Only ACCEPTED listings can have a final price recorded.")

        if listing.accepted_merchant != merchant_account:
            raise PermissionError("You can only record the price for a listing you have accepted.")

        # GAP: No suitable field in ApplianceListing exists to save `agreed_price`.
        # We perform the status transition to keep the flow moving, but skip the settlement
        # call entirely because we cannot record complete data without an ApplianceBill model.
        listing.status = ApplianceListing.Status.COLLECTED
        listing.save(update_fields=['status'])
        
        logger.info(
            f"Merchant {merchant_account.phone_number} collected ApplianceListing {listing.id} "
            f"for agreed price {agreed_price}. (WARNING: Price and settlement skipped due to schema gap!)"
        )
        return listing
