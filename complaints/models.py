from django.db import models
from common.models import BaseModel
from accounts.models import Account
from pickups.models import Bill
from marketplace.models import MarketplaceSale

class Complaint(BaseModel):
    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        IN_REVIEW = 'IN_REVIEW', 'In Review'
        RESOLVED = 'RESOLVED', 'Resolved'

    class ResolutionOutcome(models.TextChoices):
        AGAINST_MERCHANT = 'AGAINST_MERCHANT', 'Against Merchant'
        AGAINST_SOURCE = 'AGAINST_SOURCE', 'Against Source'
        NO_FAULT = 'NO_FAULT', 'No Fault'

    raised_by = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="complaints_raised", db_index=True)
    complaint_type = models.CharField(max_length=100, db_index=True)
    related_bill = models.ForeignKey(Bill, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    related_sale = models.ForeignKey(MarketplaceSale, on_delete=models.SET_NULL, null=True, blank=True, db_index=True)
    evidence_urls = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN, db_index=True)
    resolution_outcome = models.CharField(max_length=30, choices=ResolutionOutcome.choices, null=True, blank=True)
    resolution_notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Complaint {self.id} by {self.raised_by}"
