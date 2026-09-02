import logging

from django.db import migrations

logger = logging.getLogger(__name__)

NOTIFICATION_TYPE = "REGISTRATION_REJECTED"
LANGUAGE = "EN"

# The corrected text - includes {rejection_reason} and adds the 3-attempt limit
# clarification that gives users genuinely useful context upfront.
UPDATED_TEMPLATE_TEXT = (
    "Your registration was not approved. Reason: {rejection_reason}. "
    "Please review and resubmit your details within 3 attempts, or your account "
    "will be permanently rejected."
)

# The reverse target - keeps the {rejection_reason} placeholder (fixing the original
# seed bug is intentional), but removes the 3-attempt clarifying sentence.
PREVIOUS_TEMPLATE_TEXT = (
    "Your registration was not approved. Reason: {rejection_reason}. "
    "Please review and resubmit your details."
)


def forwards_func(apps, schema_editor):
    NotificationTemplate = apps.get_model("notifications", "NotificationTemplate")
    db_alias = schema_editor.connection.alias

    updated = NotificationTemplate.objects.using(db_alias).filter(
        notification_type=NOTIFICATION_TYPE,
        language=LANGUAGE,
    ).update(template_text=UPDATED_TEMPLATE_TEXT)

    if updated == 0:
        logger.warning(
            "Data migration 0004: NotificationTemplate row for "
            "notification_type=%r language=%r was not found. "
            "No rows were updated.",
            NOTIFICATION_TYPE,
            LANGUAGE,
        )


def reverse_func(apps, schema_editor):
    NotificationTemplate = apps.get_model("notifications", "NotificationTemplate")
    db_alias = schema_editor.connection.alias

    updated = NotificationTemplate.objects.using(db_alias).filter(
        notification_type=NOTIFICATION_TYPE,
        language=LANGUAGE,
    ).update(template_text=PREVIOUS_TEMPLATE_TEXT)

    if updated == 0:
        logger.warning(
            "Data migration 0004 (reverse): NotificationTemplate row for "
            "notification_type=%r language=%r was not found. "
            "No rows were reverted.",
            NOTIFICATION_TYPE,
            LANGUAGE,
        )


class Migration(migrations.Migration):

    dependencies = [
        ("notifications", "0003_auto_20260829_1247"),
    ]

    operations = [
        migrations.RunPython(forwards_func, reverse_func),
    ]
