from django.db import models
from common.models import BaseModel
from accounts.models import Account
from catalog.models import ScrapCategory

class BulkOrder(BaseModel):
    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        MATCHED = 'MATCHED', 'Matched'
        FULFILLED = 'FULFILLED', 'Fulfilled'
        CANCELLED = 'CANCELLED', 'Cancelled'

    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="bulk_orders_created", db_index=True)
    category = models.ForeignKey(ScrapCategory, on_delete=models.PROTECT, db_index=True)
    estimated_quantity_kg = models.DecimalField(max_digits=10, decimal_places=3)
    address_label = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, db_index=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, db_index=True)
    expected_rate_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN, db_index=True)

    def __str__(self):
        return f"BulkOrder {self.id} - {self.status}"

class BulkOrderOffer(BaseModel):
    bulk_order = models.ForeignKey(BulkOrder, on_delete=models.CASCADE, related_name="offers", db_index=True)
    big_merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="bulk_order_offers", db_index=True)
    offered_rate_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    is_selected = models.BooleanField(default=False, db_index=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['bulk_order', 'big_merchant'], name='unique_offer_per_bulk_order_and_merchant')
        ]

    def __str__(self):
        return f"Offer by {self.big_merchant} on {self.bulk_order}"

class MerchantToMerchantSale(BaseModel):
    class FulfillmentMethod(models.TextChoices):
        PICKUP = 'PICKUP', 'Pickup'
        DELIVERY = 'DELIVERY', 'Delivery'

    class Status(models.TextChoices):
        PENDING_FULFILLMENT = 'PENDING_FULFILLMENT', 'Pending Fulfillment'
        RECEIVED = 'RECEIVED', 'Received'
        COMPLETED = 'COMPLETED', 'Completed'

    bulk_order = models.OneToOneField(BulkOrder, on_delete=models.PROTECT, null=True, blank=True, related_name="sale")
    source_merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="sales_as_source", db_index=True)
    big_merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="sales_as_buyer", db_index=True)
    agreed_rate_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    fulfillment_method = models.CharField(max_length=20, choices=FulfillmentMethod.choices, db_index=True)
    estimated_weight_kg = models.DecimalField(max_digits=10, decimal_places=3)
    actual_weight_kg = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    final_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING_FULFILLMENT, db_index=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"M2M Sale from {self.source_merchant} to {self.big_merchant}"
