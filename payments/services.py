import logging
import uuid
import requests
from decimal import Decimal
from django.conf import settings
from django.db import transaction
from django.db.models import Sum

from accounts.models import Account
from payments.models import PaymentTransaction
from settlements.models import SettlementRecord, MarketplaceSettlementRecord

logger = logging.getLogger(__name__)

def generate_payment_qr(reference: str, amount: Decimal, account: Account) -> dict:
    """
    Generates a Cashfree Payment QR for a given transaction.
    
    GAP IDENTIFIED:
    The original requirements suggested generate_payment_qr(reference, amount). 
    However, PaymentTransaction requires a non-nullable 'account' ForeignKey.
    Therefore, the function signature has been updated to accept 'account: Account'.
    
    Args:
        reference (str): The unique payment reference ID.
        amount (Decimal): The amount to be paid.
        account (Account): The account initiating the payment.
        
    Returns:
        dict: A dictionary containing 'qr_code_data' and 'reference'.
        
    Raises:
        ValueError: If amount is not a positive Decimal.
    """
    if not isinstance(amount, Decimal):
        raise TypeError("amount must be a Decimal.")
    if amount <= Decimal('0.00'):
        raise ValueError("amount must be a positive Decimal.")
        
    txn = PaymentTransaction.objects.create(
        reference_id=reference,
        account=account,
        amount=amount,
        transaction_type=PaymentTransaction.TransactionType.MARKETPLACE_PAYMENT,
        gateway_status=PaymentTransaction.GatewayStatus.INITIATED
    )
    
    # TODO: ACTUAL CASHFREE INTEGRATION PENDING
    # Replace the below placeholders with actual Cashfree QR generation endpoint from their docs.
    # The endpoint URLs, auth headers, and payload shapes need to be verified.
    
    # url = "https://api.cashfree.com/pg/orders"  # Example Placeholder
    # headers = {
    #     "x-client-id": settings.CASHFREE_APP_ID,
    #     "x-client-secret": settings.CASHFREE_SECRET_KEY,
    #     "x-api-version": "2022-09-01",
    #     "Content-Type": "application/json"
    # }
    # payload = {
    #     "order_id": reference,
    #     "order_amount": str(amount),
    #     "order_currency": "INR",
    #     "customer_details": {
    #         "customer_id": str(account.id),
    #         "customer_phone": str(account.phone_number)
    #     }
    # }
    # response = requests.post(url, json=payload, headers=headers)
    # response.raise_for_status()
    # response_data = response.json()
    # qr_code_data = response_data.get("order_meta", {}).get("payment_methods", {}).get("upi", {}).get("qr_code")
    
    logger.info(f"[PLACEHOLDER] Generated payment QR for {reference}")
    
    return {
        "qr_code_data": f"placeholder_qr_data_for_{reference}",
        "reference": reference
    }


def handle_cashfree_webhook(payload: dict) -> PaymentTransaction:
    """
    Handles a webhook callback from Cashfree to update payment status.
    
    Args:
        payload (dict): The payload received from Cashfree.
        
    Returns:
        PaymentTransaction: The updated transaction record.
        
    Raises:
        ValueError: If the transaction is not found.
    """
    # TODO: ACTUAL CASHFREE WEBHOOK SCHEMA PENDING
    # Mark the exact expected payload key names as an assumption since we don't have Cashfree's
    # actual webhook payload schema confirmed yet.
    reference_id = payload.get("order_id") or payload.get("reference_id")
    status = payload.get("txStatus") or payload.get("status")
    amount = payload.get("order_amount") or payload.get("amount")
    
    if not reference_id:
        raise ValueError("Payload missing reference identifier.")
        
    try:
        txn = PaymentTransaction.objects.get(reference_id=reference_id)
    except PaymentTransaction.DoesNotExist:
        raise ValueError(f"PaymentTransaction {reference_id} does not exist.")
        
    with transaction.atomic():
        if status in ["SUCCESS", "PAID"]:
            txn.gateway_status = PaymentTransaction.GatewayStatus.SUCCESS
        elif status in ["FAILED", "CANCELLED"]:
            txn.gateway_status = PaymentTransaction.GatewayStatus.FAILED
            
        txn.gateway_response = payload
        txn.save(update_fields=['gateway_status', 'gateway_response'])
        
        # Trigger marketplace confirmation if successful
        if txn.gateway_status == PaymentTransaction.GatewayStatus.SUCCESS and txn.transaction_type == PaymentTransaction.TransactionType.MARKETPLACE_PAYMENT:
            # Import inside function to avoid circular imports between apps
            from marketplace.services import handle_payment_confirmation
            confirmed_amount = Decimal(str(amount)) if amount else txn.amount
            handle_payment_confirmation(payment_reference=reference_id, confirmed_amount=confirmed_amount)
            
        logger.info(f"Webhook handled for {reference_id}. Status updated to {txn.gateway_status}.")
        return txn


def calculate_total_commission_owed(merchant_account: Account) -> Decimal:
    """
    Calculates the total commission owed by a merchant across both settlement tracks.
    
    Args:
        merchant_account (Account): The merchant account.
        
    Returns:
        Decimal: The total combined amount owed.
    """
    sr_owed = SettlementRecord.objects.filter(
        merchant=merchant_account,
        payment_status=SettlementRecord.PaymentStatus.PENDING
    ).aggregate(total=Sum('commission_owed'))['total']
    
    msr_owed = MarketplaceSettlementRecord.objects.filter(
        merchant=merchant_account,
        payment_status=MarketplaceSettlementRecord.PaymentStatus.PENDING
    ).aggregate(total=Sum('commission_owed'))['total']
    
    total_owed = (sr_owed or Decimal('0.00')) + (msr_owed or Decimal('0.00'))
    return total_owed


def trigger_commission_autopay(merchant_account: Account) -> PaymentTransaction:
    """
    Triggers a payment request for a merchant to pay their total accumulated platform commission.
    
    Args:
        merchant_account (Account): The merchant account to charge.
        
    Returns:
        PaymentTransaction: The created transaction record for the autopay.
        
    Raises:
        ValueError: If the total commission owed is 0.
    """
    amount = calculate_total_commission_owed(merchant_account)
    
    if amount <= Decimal('0.00'):
        raise ValueError("Total commission owed is 0. Nothing to charge.")
        
    reference = f"AUTOPAY-{uuid.uuid4().hex[:8].upper()}"
    
    txn = PaymentTransaction.objects.create(
        reference_id=reference,
        account=merchant_account,
        amount=amount,
        transaction_type=PaymentTransaction.TransactionType.COMMISSION_AUTOPAY,
        gateway_status=PaymentTransaction.GatewayStatus.INITIATED
    )
    
    # TODO: ACTUAL CASHFREE INTEGRATION PENDING
    # Replace the below placeholders with actual Cashfree Autopay/Subscription endpoint from their docs.
    # The endpoint URLs, auth headers, and payload shapes need to be verified.
    
    # url = "https://api.cashfree.com/pg/subscriptions"  # Example Placeholder
    # headers = {
    #     "x-client-id": settings.CASHFREE_APP_ID,
    #     "x-client-secret": settings.CASHFREE_SECRET_KEY,
    #     "x-api-version": "2022-09-01",
    #     "Content-Type": "application/json"
    # }
    # payload = {
    #     "subscription_id": reference,
    #     "plan_id": "COMMISSION_AUTOPAY",
    #     "amount": str(amount),
    #     "customer_phone": str(merchant_account.phone_number)
    # }
    # response = requests.post(url, json=payload, headers=headers)
    # response.raise_for_status()
    
    logger.info(f"[PLACEHOLDER] Triggered commission autopay for {merchant_account.phone_number}. Amount: {amount}")
    return txn
