from django.db import models
from common.models import BaseModel
from accounts.models import Account
from pickups.models import PickupRequest

class CompanyBid(BaseModel):
    pickup_request = models.ForeignKey(PickupRequest, on_delete=models.CASCADE, related_name="bids", db_index=True)
    merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="bids_submitted", db_index=True)
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_winner = models.BooleanField(default=False, db_index=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['pickup_request', 'merchant'], name='unique_bid_per_merchant')
        ]

    def __str__(self):
        return f"Bid by {self.merchant} on {self.pickup_request.id}"
