from django.db import models
from common.models import BaseModel
from accounts.models import Account

class ApplianceListing(BaseModel):
    class Condition(models.TextChoices):
        BROKEN = 'BROKEN', 'Broken'
        WORKING = 'WORKING', 'Working'
        WORKING_BUT_OLD = 'WORKING_BUT_OLD', 'Working but Old'

    class Status(models.TextChoices):
        LISTED = 'LISTED', 'Listed'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        COLLECTED = 'COLLECTED', 'Collected'
        CLOSED = 'CLOSED', 'Closed'

    user = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="appliance_listings", db_index=True)
    item_type = models.CharField(max_length=100)
    condition = models.CharField(max_length=30, choices=Condition.choices)
    photo_urls = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.LISTED, db_index=True)
    accepted_merchant = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name="appliances_accepted", db_index=True)

    def __str__(self):
        return f"{self.item_type} listed by {self.user}"

class ApplianceBill(BaseModel):
    listing = models.OneToOneField(ApplianceListing, on_delete=models.PROTECT, related_name="bill")
    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="appliance_bills_issued", db_index=True)
    agreed_price = models.DecimalField(max_digits=10, decimal_places=2)
    commission_rate = models.DecimalField(max_digits=4, decimal_places=2)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_reference = models.CharField(max_length=150, unique=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Bill for {self.listing} - Merchant: {self.merchant}"
