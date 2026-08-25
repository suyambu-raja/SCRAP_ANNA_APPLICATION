import logging
from decimal import Decimal
from django.utils import timezone
from django.db import transaction
from django.db.models import QuerySet

from merchant_network.models import BulkOrder, BulkOrderOffer, MerchantToMerchantSale
from accounts.models import Account, MerchantProfile
from settlements.services import calculate_commission, create_settlement_record

logger = logging.getLogger(__name__)

def create_bulk_order(merchant_account: Account, category_id: int, estimated_quantity_kg: Decimal, address_label: str, latitude: Decimal, longitude: Decimal, expected_rate_per_kg: Decimal) -> BulkOrder:
    """
    Creates a new BulkOrder for a Small/Medium merchant to sell accumulated scrap upstream.
    
    Args:
        merchant_account (Account): The merchant creating the order.
        category_id (int): ID of the scrap category.
        estimated_quantity_kg (Decimal): The estimated weight in kg.
        address_label (str): The address label for the order.
        latitude (Decimal): Latitude for pickup/delivery.
        longitude (Decimal): Longitude for pickup/delivery.
        expected_rate_per_kg (Decimal): The expected rate per kg.
        
    Returns:
        BulkOrder: The created bulk order.
        
    Raises:
        PermissionError: If the account is not a MERCHANT, or if their tier is BIG.
        TypeError: If quantity or rate are not Decimal instances.
        ValueError: If quantity or rate are not positive.
    """
    if getattr(merchant_account, 'role', None) != Account.Role.MERCHANT:
        raise PermissionError("Only MERCHANT accounts can create bulk orders.")
        
    try:
        profile = merchant_account.merchant_profile
    except MerchantProfile.DoesNotExist:
        raise PermissionError("Merchant profile not found for this account.")
        
    if profile.tier == MerchantProfile.Tier.BIG:
        raise PermissionError("Big Merchants cannot create Bulk Orders; they are buyers in this flow.")
        
    if not isinstance(estimated_quantity_kg, Decimal) or not isinstance(expected_rate_per_kg, Decimal):
        raise TypeError("estimated_quantity_kg and expected_rate_per_kg must be Decimals.")
        
    if estimated_quantity_kg <= 0 or expected_rate_per_kg <= 0:
        raise ValueError("estimated_quantity_kg and expected_rate_per_kg must be positive.")
        
    order = BulkOrder.objects.create(
        merchant=merchant_account,
        category_id=category_id,
        estimated_quantity_kg=estimated_quantity_kg,
        address_label=address_label,
        latitude=latitude,
        longitude=longitude,
        expected_rate_per_kg=expected_rate_per_kg,
        status=BulkOrder.Status.OPEN
    )
    
    logger.info(f"Created BulkOrder {order.id} for merchant {merchant_account.phone_number}.")
    return order


def get_eligible_big_merchants(bulk_order: BulkOrder) -> QuerySet:
    """
    Returns eligible Big Merchants who can submit offers for a given bulk order.
    
    Args:
        bulk_order (BulkOrder): The bulk order to match.
        
    Returns:
        QuerySet: A queryset of eligible MerchantProfile objects.
    """
    # TODO: The PRD flow diagram shows filtering by "Material match, Quantity, Location, Capacity, Verified".
    # Currently, MerchantProfile does not have fields for supported categories or capacity.
    # Therefore, material/category matching and capacity filtering are skipped for now.
    # Location filtering can be done using bounding box/radius if required, but is omitted here
    # pending specific radius rules for the merchant network flow.
    
    return MerchantProfile.objects.filter(
        tier=MerchantProfile.Tier.BIG,
        recycle_company_verified=True,
        account__is_active=True,
        account__is_verified=True
    )


def submit_bulk_order_offer(bulk_order_id: int, big_merchant_account: Account, offered_rate_per_kg: Decimal) -> BulkOrderOffer:
    """
    Submits a rate quote (offer) from a Big Merchant for a specific bulk order.
    
    Args:
        bulk_order_id (int): The ID of the bulk order.
        big_merchant_account (Account): The Big Merchant submitting the offer.
        offered_rate_per_kg (Decimal): The offered rate per kg.
        
    Returns:
        BulkOrderOffer: The created or updated offer.
        
    Raises:
        ValueError: If the bulk order does not exist, is not OPEN, or rate is invalid.
        PermissionError: If the account is not an eligible Big Merchant.
        TypeError: If the offered rate is not a Decimal.
    """
    if not isinstance(offered_rate_per_kg, Decimal):
        raise TypeError("offered_rate_per_kg must be a Decimal.")
        
    if offered_rate_per_kg <= 0:
        raise ValueError("offered_rate_per_kg must be positive.")
        
    try:
        bulk_order = BulkOrder.objects.get(id=bulk_order_id)
    except BulkOrder.DoesNotExist:
        raise ValueError(f"BulkOrder {bulk_order_id} does not exist.")
        
    if bulk_order.status != BulkOrder.Status.OPEN:
        raise ValueError("Offers can only be submitted for OPEN bulk orders.")
        
    try:
        profile = big_merchant_account.merchant_profile
    except MerchantProfile.DoesNotExist:
        raise PermissionError("Merchant profile not found.")
        
    if profile.tier != MerchantProfile.Tier.BIG or not profile.recycle_company_verified:
        raise PermissionError("Only verified Big Merchants can submit bulk order offers.")
        
    offer, created = BulkOrderOffer.objects.update_or_create(
        bulk_order=bulk_order,
        big_merchant=big_merchant_account,
        defaults={'offered_rate_per_kg': offered_rate_per_kg}
    )
    
    action = "Created" if created else "Updated"
    logger.info(f"{action} BulkOrderOffer {offer.id} by {big_merchant_account.phone_number} on BulkOrder {bulk_order_id}.")
    return offer


def get_offers_for_bulk_order(bulk_order_id: int, requesting_merchant_account: Account) -> QuerySet:
    """
    Retrieves all offers for a bulk order, ordered by the best offered rate (descending).
    
    Args:
        bulk_order_id (int): The ID of the bulk order.
        requesting_merchant_account (Account): The merchant requesting the offers (must own the order).
        
    Returns:
        QuerySet: A queryset of BulkOrderOffer objects.
        
    Raises:
        ValueError: If the bulk order does not exist.
        PermissionError: If the requesting merchant does not own the bulk order.
    """
    try:
        bulk_order = BulkOrder.objects.get(id=bulk_order_id)
    except BulkOrder.DoesNotExist:
        raise ValueError(f"BulkOrder {bulk_order_id} does not exist.")
        
    if bulk_order.merchant != requesting_merchant_account:
        raise PermissionError("You can only view offers for your own bulk orders.")
        
    return BulkOrderOffer.objects.filter(bulk_order=bulk_order).order_by('-offered_rate_per_kg')


def select_offer(bulk_order_id: int, selecting_merchant_account: Account, offer_id: int, fulfillment_method: str) -> MerchantToMerchantSale:
    """
    Manually selects an offer for a bulk order and creates a MerchantToMerchantSale record.
    
    Args:
        bulk_order_id (int): The ID of the bulk order.
        selecting_merchant_account (Account): The merchant selecting the offer (must own the order).
        offer_id (int): The ID of the offer being selected.
        fulfillment_method (str): The fulfillment method chosen (PICKUP or DELIVERY).
        
    Returns:
        MerchantToMerchantSale: The generated sale record.
        
    Raises:
        ValueError: If bulk order is not OPEN, offer doesn't belong to it, or fulfillment method is invalid.
        PermissionError: If the selecting merchant does not own the bulk order.
    """
    try:
        bulk_order = BulkOrder.objects.get(id=bulk_order_id)
    except BulkOrder.DoesNotExist:
        raise ValueError(f"BulkOrder {bulk_order_id} does not exist.")
        
    if bulk_order.merchant != selecting_merchant_account:
        raise PermissionError("You can only select offers for your own bulk orders.")
        
    if bulk_order.status != BulkOrder.Status.OPEN:
        raise ValueError("This bulk order is no longer OPEN.")
        
    if fulfillment_method not in MerchantToMerchantSale.FulfillmentMethod.values:
        raise ValueError(f"Invalid fulfillment method. Must be one of {MerchantToMerchantSale.FulfillmentMethod.values}.")
        
    try:
        offer = BulkOrderOffer.objects.get(id=offer_id, bulk_order=bulk_order)
    except BulkOrderOffer.DoesNotExist:
        raise ValueError(f"Offer {offer_id} does not belong to BulkOrder {bulk_order_id}.")
        
    with transaction.atomic():
        # Note: We do not update other offers' is_selected to False, as they default to False
        offer.is_selected = True
        offer.save(update_fields=['is_selected'])
        
        bulk_order.status = BulkOrder.Status.MATCHED
        bulk_order.save(update_fields=['status'])
        
        sale = MerchantToMerchantSale.objects.create(
            bulk_order=bulk_order,
            source_merchant=selecting_merchant_account,
            big_merchant=offer.big_merchant,
            agreed_rate_per_kg=offer.offered_rate_per_kg,
            fulfillment_method=fulfillment_method,
            estimated_weight_kg=bulk_order.estimated_quantity_kg,
            status=MerchantToMerchantSale.Status.PENDING_FULFILLMENT
        )
        
        logger.info(f"Merchant {selecting_merchant_account.phone_number} selected Offer {offer.id} for BulkOrder {bulk_order.id}. Created Sale {sale.id}.")
        return sale


def confirm_actual_weight(sale_id: int, confirming_merchant_account: Account, actual_weight_kg: Decimal) -> MerchantToMerchantSale:
    """
    Confirms the actual weight at physical handover and finalizes the sale amounts.
    
    Args:
        sale_id (int): The ID of the sale.
        confirming_merchant_account (Account): The merchant confirming the weight.
        actual_weight_kg (Decimal): The actual weight measured in kg.
        
    Returns:
        MerchantToMerchantSale: The updated sale record.
        
    Raises:
        ValueError: If the sale is not in PENDING_FULFILLMENT status, or weight is invalid.
        PermissionError: If confirming merchant is neither the source nor the big merchant.
        TypeError: If actual_weight_kg is not a Decimal.
    """
    if not isinstance(actual_weight_kg, Decimal):
        raise TypeError("actual_weight_kg must be a Decimal.")
        
    if actual_weight_kg <= 0:
        raise ValueError("actual_weight_kg must be positive.")
        
    try:
        sale = MerchantToMerchantSale.objects.select_related('bulk_order').get(id=sale_id)
    except MerchantToMerchantSale.DoesNotExist:
        raise ValueError(f"MerchantToMerchantSale {sale_id} does not exist.")
        
    if sale.status != MerchantToMerchantSale.Status.PENDING_FULFILLMENT:
        raise ValueError("Weight can only be confirmed for sales in PENDING_FULFILLMENT status.")
        
    # Assumption: The PRD does not specify who confirms the weight. 
    # Real-world practice usually allows either party to confirm receipt/handover.
    if confirming_merchant_account not in [sale.source_merchant, sale.big_merchant]:
        raise PermissionError("Only the parties involved in the sale can confirm the weight.")
        
    final_amount = actual_weight_kg * sale.agreed_rate_per_kg
    transaction_type = "MERCHANT_TO_MERCHANT"
    commission_amount = calculate_commission(final_amount, transaction_type)
    
    with transaction.atomic():
        sale.actual_weight_kg = actual_weight_kg
        sale.final_amount = final_amount
        sale.commission_amount = commission_amount
        sale.status = MerchantToMerchantSale.Status.RECEIVED
        sale.save(update_fields=['actual_weight_kg', 'final_amount', 'commission_amount', 'status'])
        
        bulk_order = sale.bulk_order
        if bulk_order:
            bulk_order.status = BulkOrder.Status.FULFILLED
            bulk_order.save(update_fields=['status'])
            
        create_settlement_record(
            merchant_account=sale.big_merchant, # Commission is charged to the Big Merchant (the buyer) per project requirements — Big Merchants capture a larger margin per kg in this transaction chain.
            gross_transacted_value=final_amount,
            transaction_type=transaction_type,
            source_reference_id=str(sale.id)
        )
        
        logger.info(f"Actual weight confirmed for Sale {sale.id} ({actual_weight_kg}kg). Status updated to RECEIVED.")
        return sale


def complete_sale(sale_id: int) -> MerchantToMerchantSale:
    """
    Marks a received sale as fully COMPLETED.
    
    Args:
        sale_id (int): The ID of the sale to complete.
        
    Returns:
        MerchantToMerchantSale: The completed sale record.
        
    Raises:
        ValueError: If the sale does not exist or is not in RECEIVED status.
    """
    try:
        sale = MerchantToMerchantSale.objects.get(id=sale_id)
    except MerchantToMerchantSale.DoesNotExist:
        raise ValueError(f"MerchantToMerchantSale {sale_id} does not exist.")
        
    if sale.status != MerchantToMerchantSale.Status.RECEIVED:
        raise ValueError("Sale must be in RECEIVED status to be completed.")
        
    sale.status = MerchantToMerchantSale.Status.COMPLETED
    sale.completed_at = timezone.now()
    sale.save(update_fields=['status', 'completed_at'])
    
    logger.info(f"Sale {sale.id} has been COMPLETED.")
    return sale
