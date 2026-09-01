from django.db import models
from common.models import BaseModel
from accounts.models import Account
from pickups.models import PickupRequest

class CompanyOffer(BaseModel):
    pickup_request = models.ForeignKey(PickupRequest, on_delete=models.CASCADE, related_name="offers", db_index=True)
    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="offers_submitted", db_index=True)
    offer_amount = models.DecimalField(max_digits=10, decimal_places=2)
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_winner = models.BooleanField(default=False, db_index=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['pickup_request', 'merchant'], name='unique_offer_per_merchant')
        ]

    def __str__(self):
        return f"Offer by {self.merchant} on {self.pickup_request.id}"

class CompanyBill(BaseModel):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'

    company_offer = models.OneToOneField(CompanyOffer, on_delete=models.PROTECT, related_name="bill")
    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="company_bills_issued", db_index=True)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=3)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission_rate = models.DecimalField(max_digits=4, decimal_places=2)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_reference = models.CharField(max_length=150, unique=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)

    def __str__(self):
        return f"CompanyBill {self.id} for {self.merchant}"
