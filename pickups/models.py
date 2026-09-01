from django.db import models
from common.models import BaseModel
from accounts.models import Account
from catalog.models import ScrapCategory

class PickupRequest(BaseModel):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        BROADCASTED = 'BROADCASTED', 'Broadcasted'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        COLLECTED = 'COLLECTED', 'Collected'
        CLOSED = 'CLOSED', 'Closed'
        EXPIRED = 'EXPIRED', 'Expired'

    source = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="pickup_requests", db_index=True)
    category = models.ForeignKey(ScrapCategory, on_delete=models.PROTECT, db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, db_index=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, db_index=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    
    # Flags to prevent duplicate reminder notifications for Company sealed-offer orders
    offer_reminder_start_sent = models.BooleanField(default=False)
    offer_reminder_halfway_sent = models.BooleanField(default=False)
    offer_reminder_final_sent = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['status', 'requested_at']),
        ]

    def __str__(self):
        return f"Pickup {self.id} - {self.status}"

class Lead(BaseModel):
    class Status(models.TextChoices):
        BROADCASTED = 'BROADCASTED', 'Broadcasted'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        EXPIRED = 'EXPIRED', 'Expired'
        REASSIGNED = 'REASSIGNED', 'Reassigned'

    pickup_request = models.ForeignKey(PickupRequest, on_delete=models.CASCADE, related_name="leads", db_index=True)
    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="leads", null=True, blank=True, db_index=True)
    radius_used_km = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.BROADCASTED, db_index=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    collection_deadline = models.DateTimeField(null=True, blank=True, db_index=True)

    def __str__(self):
        return f"Lead {self.id} for Pickup {self.pickup_request.id}"

class Bill(BaseModel):
    lead = models.OneToOneField(Lead, on_delete=models.PROTECT, related_name="bill")
    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="bills_issued", db_index=True)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=3)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission_rate = models.DecimalField(max_digits=4, decimal_places=2)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2)
    source_copy_ref = models.CharField(max_length=100, unique=True)
    merchant_copy_ref = models.CharField(max_length=100, unique=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Bill {self.id} - {self.total_amount}"

class RangeOverride(BaseModel):
    pickup_request = models.ForeignKey(PickupRequest, on_delete=models.CASCADE, related_name="range_overrides", db_index=True)
    new_radius_km = models.DecimalField(max_digits=5, decimal_places=2)
    set_by = models.ForeignKey(Account, on_delete=models.PROTECT, limit_choices_to={"role": "ADMIN"}, db_index=True)

    def __str__(self):
        return f"Range Override for Pickup {self.pickup_request.id}"
