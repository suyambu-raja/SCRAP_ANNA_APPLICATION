from django.db import models
from common.models import BaseModel
from accounts.models import Account

class SettlementRecord(BaseModel):
    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'
        FAILED = 'FAILED', 'Failed'

    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="settlements", db_index=True)
    source_reference_id = models.CharField(max_length=255, unique=True, db_index=True)
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
    source_reference_id = models.CharField(max_length=255, unique=True, db_index=True)
    commission_owed = models.DecimalField(max_digits=10, decimal_places=2)
    settlement_date = models.DateField(db_index=True)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING, db_index=True)

    def __str__(self):
        return f"Marketplace Settlement {self.id} for {self.merchant}"

class CommissionRate(BaseModel):
    class TransactionType(models.TextChoices):
        USER_PICKUP = 'USER_PICKUP', 'User Pickup'
        COMPANY_PICKUP = 'COMPANY_PICKUP', 'Company Pickup'
        MERCHANT_TO_MERCHANT = 'MERCHANT_TO_MERCHANT', 'Merchant to Merchant'
        MARKETPLACE = 'MARKETPLACE', 'Marketplace'

    transaction_type = models.CharField(max_length=30, choices=TransactionType.choices, unique=True, db_index=True)
    rate_percent = models.DecimalField(max_digits=4, decimal_places=2)
    updated_by = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="commission_rate_updates", limit_choices_to={"role": "ADMIN"}, null=True, blank=True, db_index=True)

    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.rate_percent}%"

class CommissionRateHistory(BaseModel):
    commission_rate = models.ForeignKey(CommissionRate, on_delete=models.CASCADE, related_name="history", db_index=True)
    old_rate_percent = models.DecimalField(max_digits=4, decimal_places=2)
    new_rate_percent = models.DecimalField(max_digits=4, decimal_places=2)
    changed_by = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="commission_rate_changes", limit_choices_to={"role": "ADMIN"}, db_index=True)

    def __str__(self):
        return f"History for {self.commission_rate.transaction_type}: {self.old_rate_percent}% -> {self.new_rate_percent}%"
