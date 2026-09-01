from django.db import models
from common.models import BaseModel
from accounts.models import Account

class MarketplaceListing(BaseModel):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        SOLD = 'SOLD', 'Sold'
        REMOVED = 'REMOVED', 'Removed'

    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="marketplace_listings", db_index=True)
    item_name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    merchant_price = models.DecimalField(max_digits=10, decimal_places=2)
    displayed_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE, db_index=True)

    def __str__(self):
        return self.item_name

class MarketplaceSale(BaseModel):
    listing = models.ForeignKey(MarketplaceListing, on_delete=models.PROTECT, related_name="sales", db_index=True)
    buyer = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="marketplace_purchases", db_index=True)
    payment_reference = models.CharField(max_length=150, unique=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_slot = models.DateTimeField(null=True, blank=True)
    purchased_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale {self.id} to {self.buyer}"
