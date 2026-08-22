from django.db import models
from common.models import BaseModel
from accounts.models import Account

class SettlementRecord(BaseModel):
    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'
        FAILED = 'FAILED', 'Failed'

    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="settlements", db_index=True)
    gross_transacted_value = models.DecimalField(max_digits=12, decimal_places=2)
    commission_rate = models.DecimalField(max_digits=4, decimal_places=2)
    commission_owed = models.DecimalField(max_digits=10, decimal_places=2)
    settlement_date = models.DateField(db_index=True)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING, db_index=True)

    def __str__(self):
        return f"Settlement {self.id} for {self.merchant}"

class MarketplaceSettlementRecord(BaseModel):
    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'
        FAILED = 'FAILED', 'Failed'

    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="marketplace_settlements", db_index=True)
    commission_owed = models.DecimalField(max_digits=10, decimal_places=2)
    settlement_date = models.DateField(db_index=True)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING, db_index=True)

    def __str__(self):
        return f"Marketplace Settlement {self.id} for {self.merchant}"
