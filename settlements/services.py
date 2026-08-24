import logging
from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction
from django.utils import timezone

from accounts.models import Account
from settlements.models import (
    CommissionRate,
    CommissionRateHistory,
    SettlementRecord,
    MarketplaceSettlementRecord,
)

logger = logging.getLogger(__name__)


def get_active_commission_rate(transaction_type: str) -> Decimal:
    """
    Look up the active CommissionRate for a given transaction type.
    
    Args:
        transaction_type (str): The type of transaction (e.g. 'USER_PICKUP').
        
    Returns:
        Decimal: The commission rate percentage.
        
    Raises:
        ValueError: If no CommissionRate row exists for the given transaction type.
    """
    try:
        rate = CommissionRate.objects.get(transaction_type=transaction_type)
        return rate.rate_percent
    except CommissionRate.DoesNotExist:
        raise ValueError(f"No CommissionRate configured for transaction_type: {transaction_type}")


def calculate_commission(gross_amount: Decimal, transaction_type: str) -> Decimal:
    """
    Calculates the commission amount based on the gross amount and active commission rate.
    
    Args:
        gross_amount (Decimal): The total gross amount of the transaction.
        transaction_type (str): The type of transaction.
        
    Returns:
        Decimal: The calculated commission amount rounded to 2 decimal places.
        
    Raises:
        TypeError: If gross_amount is not a Decimal.
    """
    if not isinstance(gross_amount, Decimal):
        raise TypeError("gross_amount must be a Decimal instance to ensure precision.")
        
    rate_percent = get_active_commission_rate(transaction_type)
    
    # Calculate commission and round to 2 decimal places (standard currency rounding)
    commission_amount = gross_amount * (rate_percent / Decimal('100'))
    return commission_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def update_commission_rate(transaction_type: str, new_rate_percent: Decimal, changed_by_account: Account) -> CommissionRate:
    """
    Updates the commission rate for a given transaction type and creates an audit history record.
    
    Args:
        transaction_type (str): The transaction type to update.
        new_rate_percent (Decimal): The new percentage rate (between 0 and 100).
        changed_by_account (Account): The admin account making the change.
        
    Returns:
        CommissionRate: The updated CommissionRate instance.
        
    Raises:
        PermissionError: If the changed_by_account is not an ADMIN.
        ValueError: If the new_rate_percent is out of bounds or the rate doesn't exist.
        TypeError: If new_rate_percent is not a Decimal.
    """
    if getattr(changed_by_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("Only ADMIN accounts can update commission rates.")
        
    if not isinstance(new_rate_percent, Decimal):
        raise TypeError("new_rate_percent must be a Decimal.")
        
    if new_rate_percent < Decimal('0') or new_rate_percent > Decimal('100'):
        raise ValueError("new_rate_percent must be between 0 and 100.")
        
    with transaction.atomic():
        try:
            rate_obj = CommissionRate.objects.get(transaction_type=transaction_type)
        except CommissionRate.DoesNotExist:
            raise ValueError(f"No CommissionRate configured for transaction_type: {transaction_type}")
            
        old_rate = rate_obj.rate_percent
        
        # Create history record
        CommissionRateHistory.objects.create(
            commission_rate=rate_obj,
            old_rate_percent=old_rate,
            new_rate_percent=new_rate_percent,
            changed_by=changed_by_account
        )
        
        # Update the actual rate
        rate_obj.rate_percent = new_rate_percent
        rate_obj.updated_by = changed_by_account
        rate_obj.save(update_fields=['rate_percent', 'updated_by'])
        
        logger.info(
            f"Commission rate for {transaction_type} updated from {old_rate}% "
            f"to {new_rate_percent}% by {changed_by_account.phone_number}."
        )
        
        return rate_obj


def create_settlement_record(merchant_account: Account, gross_transacted_value: Decimal, transaction_type: str, source_reference_id: str) -> SettlementRecord:
    """
    Creates a SettlementRecord for pickup/Company tracks and calculates the owed commission.
    
    Args:
        merchant_account (Account): The merchant account being settled.
        gross_transacted_value (Decimal): The gross value transacted.
        transaction_type (str): The transaction type.
        source_reference_id (str): The unique identifier from the source transaction for idempotency.
        
    Returns:
        SettlementRecord: The created SettlementRecord.
    """
    if not isinstance(gross_transacted_value, Decimal):
        raise TypeError("gross_transacted_value must be a Decimal.")
        
    try:
        existing_record = SettlementRecord.objects.get(source_reference_id=source_reference_id)
        logger.info(f"Idempotency check caught duplicate call for source {source_reference_id}. Returning existing SettlementRecord.")
        return existing_record
    except SettlementRecord.DoesNotExist:
        pass

    commission_owed = calculate_commission(gross_transacted_value, transaction_type)
    rate_percent = get_active_commission_rate(transaction_type)
    
    record = SettlementRecord.objects.create(
        merchant=merchant_account,
        source_reference_id=source_reference_id,
        gross_transacted_value=gross_transacted_value,
        commission_rate=rate_percent,
        commission_owed=commission_owed,
        settlement_date=timezone.now().date(),
        payment_status=SettlementRecord.PaymentStatus.PENDING
    )
    
    return record


def create_marketplace_settlement_record(merchant_account: Account, marketplace_sale_amount: Decimal, source_reference_id: str) -> MarketplaceSettlementRecord:
    """
    Creates a MarketplaceSettlementRecord specifically for marketplace transactions.
    
    Args:
        merchant_account (Account): The merchant account being settled.
        marketplace_sale_amount (Decimal): The marketplace sale amount.
        source_reference_id (str): The unique identifier from the source transaction for idempotency.
        
    Returns:
        MarketplaceSettlementRecord: The created MarketplaceSettlementRecord.
    """
    if not isinstance(marketplace_sale_amount, Decimal):
        raise TypeError("marketplace_sale_amount must be a Decimal.")
        
    try:
        existing_record = MarketplaceSettlementRecord.objects.get(source_reference_id=source_reference_id)
        logger.info(f"Idempotency check caught duplicate call for source {source_reference_id}. Returning existing MarketplaceSettlementRecord.")
        return existing_record
    except MarketplaceSettlementRecord.DoesNotExist:
        pass
        
    transaction_type = CommissionRate.TransactionType.MARKETPLACE
    commission_owed = calculate_commission(marketplace_sale_amount, transaction_type)
    
    record = MarketplaceSettlementRecord.objects.create(
        merchant=merchant_account,
        source_reference_id=source_reference_id,
        commission_owed=commission_owed,
        settlement_date=timezone.now().date(),
        payment_status=MarketplaceSettlementRecord.PaymentStatus.PENDING
    )
    
    return record
