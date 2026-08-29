import logging
from celery import shared_task
from settlements.services import send_settlement_reminders

logger = logging.getLogger(__name__)

@shared_task
def send_settlement_reminders_task():
    """
    Celery task that triggers the settlement reminders.
    """
    logger.info("Starting send_settlement_reminders_task...")
    result = send_settlement_reminders()
    logger.info(f"Finished send_settlement_reminders_task: {result}")
    return result
