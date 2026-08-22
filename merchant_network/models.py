from django.db import models
from common.models import BaseModel
from accounts.models import Account

class MerchantToMerchantSale(BaseModel):
    source_merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="sales_as_source", db_index=True)
    big_merchant = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="sales_as_buyer", db_index=True)
    weight_kg = models.DecimalField(max_digits=10, decimal_places=3)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2)
    sold_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale from {self.source_merchant} to {self.big_merchant}"
