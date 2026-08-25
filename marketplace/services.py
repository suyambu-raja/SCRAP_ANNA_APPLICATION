import logging
import uuid
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, time, timedelta
from django.utils import timezone
from django.db import transaction
from django.db.models import QuerySet

from marketplace.models import MarketplaceListing, MarketplaceSale
from accounts.models import Account
from settlements.services import create_marketplace_settlement_record
from payments.services import generate_payment_qr

logger = logging.getLogger(__name__)

def create_marketplace_listing(merchant_account: Account, item_name: str, category: str, merchant_price: Decimal) -> MarketplaceListing:
    """
    Creates a new MarketplaceListing for a merchant to resell items.
    
    Args:
        merchant_account (Account): The merchant creating the listing.
        item_name (str): The name of the item.
        category (str): The category of the item.
        merchant_price (Decimal): The merchant's desired price (before markup).
        
    Returns:
        MarketplaceListing: The newly created active listing.
        
    Raises:
        PermissionError: If the account is not a MERCHANT.
        TypeError: If merchant_price is not a Decimal.
        ValueError: If merchant_price is not positive.
    """
    if getattr(merchant_account, 'role', None) != Account.Role.MERCHANT:
        raise PermissionError("Only MERCHANT accounts can create marketplace listings.")
        
    if not isinstance(merchant_price, Decimal):
        raise TypeError("merchant_price must be a Decimal.")
        
    if merchant_price <= 0:
        raise ValueError("merchant_price must be positive.")
        
    # Calculate displayed_price by applying a 2% platform markup
    markup_factor = Decimal('1.02')
    displayed_price = (merchant_price * markup_factor).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    listing = MarketplaceListing.objects.create(
        merchant=merchant_account,
        item_name=item_name,
        category=category,
        merchant_price=merchant_price,
        displayed_price=displayed_price,
        status=MarketplaceListing.Status.ACTIVE
    )
    
    logger.info(f"Created MarketplaceListing {listing.id} for merchant {merchant_account.phone_number}.")
    return listing


def get_active_listings() -> QuerySet:
    """
    Retrieves all active marketplace listings.
    This is a public browse function, so no permission checks are needed.
    
    Returns:
        QuerySet: A queryset of MarketplaceListing objects with status=ACTIVE.
    """
    return MarketplaceListing.objects.filter(status=MarketplaceListing.Status.ACTIVE)


def calculate_delivery_slot(order_placed_at: datetime) -> datetime:
    """
    Calculates the delivery slot based on when the order was placed.
    - Orders placed within 9 AM - 9 PM get a slot later that same business day.
    - Orders placed outside that window get a slot the next business day.
    
    Args:
        order_placed_at (datetime): The time the order was placed.
        
    Returns:
        datetime: The calculated delivery slot.
    """
    local_time = timezone.localtime(order_placed_at)
    
    # Note: We treat every day as a business day as requested. Weekend-skipping
    # logic may need to be added later if the business requires it.
    if 9 <= local_time.hour < 21:
        # Same day. We assume a 9 PM (21:00) delivery placeholder for "later that day".
        target_date = local_time.date()
        target_time = time(21, 0)
    else:
        # Next day. We assume a 9 AM (09:00) delivery placeholder for the next day.
        # If order is placed at 11 PM, it's next day. If placed at 2 AM, it's still "next day" 
        # technically, which means later this calendar day, but we'll add 1 day to the current date 
        # if it's > 21, or use current date if < 9. Wait, if it's 2 AM, it should be delivered 9 AM the SAME calendar day.
        if local_time.hour < 9:
            target_date = local_time.date()
        else:
            target_date = (local_time + timedelta(days=1)).date()
        target_time = time(9, 0)
        
    # Combine date and time, and make it aware in the current timezone
    naive_dt = datetime.combine(target_date, target_time)
    return timezone.make_aware(naive_dt, timezone.get_current_timezone())


def place_order(listing_id: int, buyer_account: Account, delivery_address: str) -> MarketplaceSale:
    """
    Places an order for an active marketplace listing.
    
    Args:
        listing_id (int): The ID of the listing to order.
        buyer_account (Account): The account placing the order.
        delivery_address (str): The address to deliver the item to.
        
    Returns:
        MarketplaceSale: The generated sale record, pending payment.
        
    Raises:
        ValueError: If the listing does not exist or is not ACTIVE.
    """
    with transaction.atomic():
        try:
            # We select for update to prevent concurrent orders on the same listing
            listing = MarketplaceListing.objects.select_for_update().get(id=listing_id)
        except MarketplaceListing.DoesNotExist:
            raise ValueError(f"MarketplaceListing {listing_id} does not exist.")
            
        if listing.status != MarketplaceListing.Status.ACTIVE:
            raise ValueError("This listing is no longer available.")
            
        delivery_slot = calculate_delivery_slot(timezone.now())
        payment_reference = f"PAY-MKT-{uuid.uuid4().hex[:8].upper()}"
        
        sale = MarketplaceSale.objects.create(
            listing=listing,
            buyer=buyer_account,
            payment_reference=payment_reference,
            amount_paid=listing.displayed_price,
            delivery_slot=delivery_slot
        )
        
        # Note: We DO NOT change the listing status to SOLD here. It remains ACTIVE
        # until the payment is confirmed by the webhook.
        
        # Generate the QR via the payments app
        generate_payment_qr(reference=payment_reference, amount=listing.displayed_price, account=buyer_account)
        
        logger.info(f"Order placed for Listing {listing.id} by {buyer_account.phone_number}. Pending payment {payment_reference}.")
        return sale


def handle_payment_confirmation(payment_reference: str, confirmed_amount: Decimal) -> MarketplaceSale:
    """
    Handles a payment confirmation from the Cashfree webhook.
    
    Args:
        payment_reference (str): The unique payment reference for the sale.
        confirmed_amount (Decimal): The amount confirmed as paid.
        
    Returns:
        MarketplaceSale: The updated sale record.
        
    Raises:
        ValueError: If no sale is found with the given payment reference.
    """
    if not isinstance(confirmed_amount, Decimal):
        raise TypeError("confirmed_amount must be a Decimal.")
        
    with transaction.atomic():
        try:
            sale = MarketplaceSale.objects.select_related('listing').select_for_update().get(payment_reference=payment_reference)
        except MarketplaceSale.DoesNotExist:
            raise ValueError(f"No MarketplaceSale found for payment reference {payment_reference}.")
            
        if confirmed_amount != sale.amount_paid:
            logger.warning(
                f"Payment mismatch for {payment_reference}: Expected {sale.amount_paid}, got {confirmed_amount}. "
                f"Manual review required."
            )
            # We do not hard-fail, we proceed but the warning is logged for review.
            
        listing = sale.listing
        
        # If the listing is already sold (e.g. duplicate webhook), just return the sale
        if listing.status == MarketplaceListing.Status.SOLD:
            logger.info(f"Listing {listing.id} is already SOLD. Ignoring duplicate confirmation.")
            return sale
            
        listing.status = MarketplaceListing.Status.SOLD
        listing.save(update_fields=['status'])
        
        # Note: The model has `merchant_price` and `displayed_price`.
        # Per requirements, the 2% commission is charged on the `merchant_price`.
        
        # Note: Using the separate marketplace settlement record function as requested.
        create_marketplace_settlement_record(
            merchant_account=listing.merchant,
            marketplace_sale_amount=listing.merchant_price,
            source_reference_id=str(sale.id)
        )
        
        logger.info(f"Payment confirmed for sale {sale.id} ({payment_reference}). Listing marked SOLD.")
        return sale
