from django.db import models
from common.models import BaseModel
from accounts.models import Account

class ReviewRecord(BaseModel):
    merchant = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="reviews_received", db_index=True)
    rated_by = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="reviews_given", db_index=True)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(null=True, blank=True)
    is_private = models.BooleanField(default=True)

    def __str__(self):
        return f"Review {self.rating} by {self.rated_by}"

class MerchantPenalty(BaseModel):
    class LadderStage(models.TextChoices):
        WARNING = 'WARNING', 'Warning'
        SUSPENSION = 'SUSPENSION', 'Suspension'
        BAN = 'BAN', 'Ban'

    merchant = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="penalties", db_index=True)
    offense_type = models.CharField(max_length=100)
    offense_count = models.PositiveIntegerField(default=1)
    ladder_stage = models.CharField(max_length=20, choices=LadderStage.choices, db_index=True)

    def __str__(self):
        return f"Penalty {self.ladder_stage} for {self.merchant}"
