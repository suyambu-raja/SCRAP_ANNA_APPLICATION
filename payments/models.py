from django.db import models
from common.models import BaseModel
from accounts.models import Account

class PaymentTransaction(BaseModel):
    class TransactionType(models.TextChoices):
        MARKETPLACE_PAYMENT = 'MARKETPLACE_PAYMENT', 'Marketplace Payment'
        COMMISSION_AUTOPAY = 'COMMISSION_AUTOPAY', 'Commission Autopay'

    class GatewayStatus(models.TextChoices):
        INITIATED = 'INITIATED', 'Initiated'
        SUCCESS = 'SUCCESS', 'Success'
        FAILED = 'FAILED', 'Failed'

    reference_id = models.CharField(max_length=150, unique=True)
    account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="payment_transactions", db_index=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=30, choices=TransactionType.choices, db_index=True)
    gateway_status = models.CharField(max_length=20, choices=GatewayStatus.choices, default=GatewayStatus.INITIATED, db_index=True)
    gateway_response = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Transaction {self.reference_id} - {self.gateway_status}"
