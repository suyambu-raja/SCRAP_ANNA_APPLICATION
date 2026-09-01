from django.db import models
from common.models import BaseModel
from accounts.models import Account

class KYCRecord(BaseModel):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        VERIFIED = 'VERIFIED', 'Verified'
        REJECTED = 'REJECTED', 'Rejected'

    account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="kyc_records", db_index=True)
    provider_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    document_reference = models.CharField(max_length=255, null=True, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"KYC for {self.account} - {self.status}"
