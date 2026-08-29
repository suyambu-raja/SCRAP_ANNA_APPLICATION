import logging
from django.conf import settings
from django.utils import timezone
from django.db.models import QuerySet

from accounts.models import Account, Language
from accounts.services import get_profile_for_account, get_effective_merchant_profile
from notifications.models import NotificationLog, NotificationTemplate

logger = logging.getLogger(__name__)

# Fetch settings with defaults handling
VOICE_CALL_PROVIDER_API_KEY = getattr(settings, 'VOICE_CALL_PROVIDER_API_KEY', '')
VOICE_CALL_PROVIDER_BASE_URL = getattr(settings, 'VOICE_CALL_PROVIDER_BASE_URL', '')
VOICE_CALL_PROVIDER_NAME = getattr(settings, 'VOICE_CALL_PROVIDER_NAME', '')


def _resolve_language(account: Account) -> str:
    """
    Helper to resolve the language preference of the account.
    Branches resolve to the parent's language preference.
    Users default to EN.
    """
    if account.role == Account.Role.USER:
        return Language.EN
    elif account.role == Account.Role.COMPANY:
        profile = get_profile_for_account(account)
        return profile.language_preference
    elif account.role == Account.Role.MERCHANT:
        profile = get_effective_merchant_profile(account)
        return profile.language_preference
    return Language.EN


def render_notification_message(notification_type: str, language: str, context: dict) -> str:
    """
    Renders a notification message from a NotificationTemplate.
    Falls back to EN if the requested language template is not found.
    Raises ValueError if neither the requested language nor EN template exists,
    or if a placeholder is missing in the context.
    """
    template = NotificationTemplate.objects.filter(
        notification_type=notification_type, language=language, is_active=True
    ).first()
    
    if not template:
        if language != Language.EN:
            logger.warning(f"NotificationTemplate not found for type '{notification_type}' in language '{language}'. Falling back to EN.")
            template = NotificationTemplate.objects.filter(
                notification_type=notification_type, language=Language.EN, is_active=True
            ).first()
            
        if not template:
            raise ValueError(f"No active NotificationTemplate found for type '{notification_type}' in requested language '{language}' or fallback 'EN'.")
            
    try:
        return template.template_text.format(**context)
    except KeyError as e:
        raise ValueError(f"Missing placeholder key in context for template '{notification_type}': {e}")


def send_push_notification(account: Account, notification_type: str, context: dict) -> NotificationLog:
    """
    Sends a standard push notification to the given account.
    
    Args:
        account (Account): The recipient account.
        notification_type (str): The type of notification (e.g. 'NEW_LEAD').
        context (dict): The context dictionary for template rendering.
        
    Returns:
        NotificationLog: The log of the push notification delivery attempt.
    """
    lang = _resolve_language(account)
    message_content = render_notification_message(notification_type, lang, context)
    
    log = NotificationLog.objects.create(
        account=account,
        notification_type=notification_type,
        channel=NotificationLog.Channel.PUSH,
        language_used=lang,
        message_content=message_content,
        delivery_status=NotificationLog.DeliveryStatus.PENDING
    )
    
    # TODO: Push notification vendor selection is pending.
    # Replace the below with the actual SDK call or HTTP request once integrated.
    # try:
    #     response = requests.post(
    #         "https://api.placeholder-push-provider.com/send",
    #         json={"to": account.phone_number, "message": message_content}
    #     )
    #     if response.ok:
    #         log.provider_reference = response.json().get('id')
    # except Exception as e:
    #     log.delivery_status = NotificationLog.DeliveryStatus.FAILED
    #     log.save()
    #     logger.error(f"Failed to send push notification to {account.phone_number}: {e}")
    #     return log
    
    # Simulate a successful send
    log.delivery_status = NotificationLog.DeliveryStatus.SENT
    log.sent_at = timezone.now()
    log.provider_reference = "simulated_push_id_pending_vendor"
    log.save()
    
    logger.info(f"Simulated sending push notification to {account.phone_number} (Type: {notification_type})")
    
    return log


def send_voice_call_notification(account: Account, notification_type: str, context: dict) -> NotificationLog:
    """
    Sends an AI voice call notification to the given merchant or company account.
    Voice calls are supplementary and respect the account's voice_call_enabled setting.
    
    Args:
        account (Account): The recipient account (must be MERCHANT or COMPANY).
        notification_type (str): The type of notification.
        context (dict): The context dictionary for template rendering.
        
    Returns:
        NotificationLog: The log of the voice call delivery attempt (or failure/skip reason).
        
    Raises:
        ValueError: If the account role is not MERCHANT or COMPANY.
    """
    if account.role not in [Account.Role.MERCHANT, Account.Role.COMPANY]:
        raise ValueError("Voice calls are only supported for MERCHANT and COMPANY accounts.")
        
    # Resolve the effective profile. For branches, this correctly fetches the parent's profile.
    if account.role == Account.Role.MERCHANT:
        profile = get_effective_merchant_profile(account)
    else:
        profile = get_profile_for_account(account)
        
    if not profile.voice_call_enabled:
        log = NotificationLog.objects.create(
            account=account,
            notification_type=notification_type,
            channel=NotificationLog.Channel.VOICE_CALL,
            language_used=profile.language_preference,
            message_content=f"Skipped voice call: voice_call_enabled is False.\nNotification type: {notification_type}",
            delivery_status=NotificationLog.DeliveryStatus.FAILED
        )
        logger.info(f"Skipped voice call to {account.phone_number} because voice calls are disabled.")
        return log
        
    message_content = render_notification_message(notification_type, profile.language_preference, context)
        
    log = NotificationLog.objects.create(
        account=account,
        notification_type=notification_type,
        channel=NotificationLog.Channel.VOICE_CALL,
        language_used=profile.language_preference,
        message_content=message_content,
        delivery_status=NotificationLog.DeliveryStatus.PENDING
    )
    
    # TODO: Voice call / TTS vendor selection is pending.
    # Replace the below with the actual SDK call or HTTP request using VOICE_CALL_PROVIDER_BASE_URL
    # and VOICE_CALL_PROVIDER_API_KEY once a vendor is chosen.
    # try:
    #     response = requests.post(
    #         f"{VOICE_CALL_PROVIDER_BASE_URL}/call",
    #         headers={"Authorization": f"Bearer {VOICE_CALL_PROVIDER_API_KEY}"},
    #         json={"to": account.phone_number, "text": message_content, "lang": profile.language_preference}
    #     )
    #     if response.ok:
    #         data = response.json()
    #         log.provider_reference = data.get('call_id')
    #         # call_duration_seconds will typically be updated via a webhook later, 
    #         # but for placeholder we just estimate.
    # except Exception as e:
    #     log.delivery_status = NotificationLog.DeliveryStatus.FAILED
    #     log.save()
    #     logger.error(f"Failed to initiate voice call to {account.phone_number}: {e}")
    #     return log
    
    # Simulate a successful call
    log.delivery_status = NotificationLog.DeliveryStatus.SENT
    log.sent_at = timezone.now()
    log.provider_reference = "simulated_call_id_pending_vendor"
    # Placeholder estimate: roughly 15 seconds plus 1 second per 3 words
    log.call_duration_seconds = 15 + (len(message_content.split()) // 3)
    log.save()
    
    logger.info(f"Simulated voice call to {account.phone_number} (Type: {notification_type})")
    
    return log


def notify(account: Account, notification_type: str, context: dict) -> dict:
    """
    Main dispatcher for sending notifications across supported channels.
    Always sends a push notification. For merchants/companies, additionally attempts 
    a voice call (which will self-skip if disabled by the user).
    
    Note: These channels are intentionally NOT wrapped in a single database transaction. 
    They are independent delivery attempts; if push fails (or errors), it should not 
    roll back the voice call log, and vice versa.
    
    Args:
        account (Account): The recipient account.
        notification_type (str): The type of notification.
        context (dict): The context dictionary for template rendering.
        
    Returns:
        dict: A dictionary mapping channels to their resulting NotificationLog records.
              e.g. {"push": <NotificationLog>, "voice": <NotificationLog or None>}
    """
    results = {
        "push": None,
        "voice": None
    }
    
    # Always attempt a push notification
    try:
        results["push"] = send_push_notification(account, notification_type, context)
    except Exception as e:
        logger.error(f"Exception during push notification dispatch for {account.phone_number}: {e}")
        
    # Attempt voice call if applicable
    if account.role in [Account.Role.MERCHANT, Account.Role.COMPANY]:
        try:
            results["voice"] = send_voice_call_notification(account, notification_type, context)
        except Exception as e:
            logger.error(f"Exception during voice call dispatch for {account.phone_number}: {e}")
            
    return results


def get_notification_history(account: Account, requesting_account: Account) -> QuerySet:
    """
    Retrieves the notification log history for a specific account.
    
    Args:
        account (Account): The account whose history is being requested.
        requesting_account (Account): The account making the request.
        
    Returns:
        QuerySet: The ordered notification logs.
        
    Raises:
        PermissionError: If requesting_account is neither the account itself nor an ADMIN.
    """
    if requesting_account != account and getattr(requesting_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("You can only view your own notification history unless you are an ADMIN.")
        
    return NotificationLog.objects.filter(account=account).order_by('-created_at')
