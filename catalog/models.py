from django.db import models
from common.models import BaseModel
from accounts.models import Account

class ScrapCategory(BaseModel):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="subcategories", db_index=True)
    unit = models.CharField(max_length=20, default="kg")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class DailyPriceRange(BaseModel):
    category = models.ForeignKey(ScrapCategory, on_delete=models.PROTECT, related_name="price_ranges", db_index=True)
    min_price = models.DecimalField(max_digits=10, decimal_places=2)
    max_price = models.DecimalField(max_digits=10, decimal_places=2)
    effective_date = models.DateField(db_index=True)
    set_by = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="price_ranges_set", limit_choices_to={"role": "ADMIN"}, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['category', 'effective_date']),
        ]

    def __str__(self):
        return f"{self.category} prices on {self.effective_date}"
