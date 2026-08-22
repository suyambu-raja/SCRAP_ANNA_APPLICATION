from django.db import models
from common.models import BaseModel
from accounts.models import Account

class FeatureFlag(BaseModel):
    flag_name = models.CharField(max_length=100, unique=True)
    is_enabled = models.BooleanField(default=False)
    toggled_by = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={"role": "ADMIN"}, db_index=True)

    def __str__(self):
        return self.flag_name
