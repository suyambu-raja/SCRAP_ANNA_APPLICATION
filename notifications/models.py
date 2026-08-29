from django.db import models
from common.models import BaseModel
from accounts.models import Account, Language

class NotificationLog(BaseModel):
    class Channel(models.TextChoices):
        PUSH = 'PUSH', 'Push Notification'
        VOICE_CALL = 'VOICE_CALL', 'AI Voice Call'
        
    class DeliveryStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        SENT = 'SENT', 'Sent'
        FAILED = 'FAILED', 'Failed'
        
    # The recipient. Note: for branch accounts, this should be 
    # the branch's own account (since branches have independent logins and 
    # should receive their own notifications directly), not resolved up to 
    # the parent merchant.
    account = models.ForeignKey(
        Account, 
        on_delete=models.CASCADE, 
        related_name="notification_logs", 
        db_index=True
    )
    
    # e.g. "NEW_LEAD", "OFFER_WINDOW_CLOSING", "COMPLAINT_UPDATE", 
    # "SETTLEMENT_REMINDER" — open-ended, not a rigid TextChoices enum, since 
    # new types will likely be added over time without needing a migration
    notification_type = models.CharField(max_length=100, db_index=True)
    
    channel = models.CharField(
        max_length=20, 
        choices=Channel.choices, 
        db_index=True
    )
    
    language_used = models.CharField(
        max_length=5, 
        choices=Language.choices
    )
    
    # The actual notification text (or the script that was converted to 
    # speech, for voice calls)
    message_content = models.TextField()
    
    delivery_status = models.CharField(
        max_length=20, 
        choices=DeliveryStatus.choices, 
        default=DeliveryStatus.PENDING, 
        db_index=True
    )
    
    # External ID from the push/voice provider once real integration exists, 
    # for tracing a specific notification back to the provider's own records
    provider_reference = models.CharField(max_length=255, null=True, blank=True)
    
    # Only relevant for VOICE_CALL channel — actual call length, useful for 
    # cost tracking once billed per-minute. Null for PUSH notifications.
    call_duration_seconds = models.PositiveIntegerField(null=True, blank=True)
    
    # When it was actually sent/attempted (may differ from created_at if queued)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['account', 'notification_type', 'created_at']),
        ]
        
    def __str__(self):
        return f"{self.notification_type} via {self.channel} to {self.account.phone_number}"

class NotificationTemplate(BaseModel):
    notification_type = models.CharField(max_length=100, db_index=True)
    language = models.CharField(
        max_length=5, 
        choices=Language.choices
    )
    template_text = models.TextField()
    is_active = models.BooleanField(default=True)
    updated_by = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"role": "ADMIN"}
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['notification_type', 'language'], 
                name='unique_template_per_type_and_language'
            )
        ]

    def __str__(self):
        return f"{self.notification_type} - {self.language}"
