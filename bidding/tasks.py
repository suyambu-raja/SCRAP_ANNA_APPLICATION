import logging
from celery import shared_task
from bidding.services import (
    send_offer_window_reminders,
    get_bidding_windows_ready_to_close,
    close_bidding_window
)

logger = logging.getLogger(__name__)

@shared_task
def send_offer_window_reminders_task():
    """
    Celery task that triggers the offer window reminders.
    """
    logger.info("Starting send_offer_window_reminders_task...")
    result = send_offer_window_reminders()
    logger.info(f"Finished send_offer_window_reminders_task: {result}")
    return result


@shared_task
def process_bidding_window_closures_task():
    """
    Celery task that processes all bidding windows ready to close.
    """
    logger.info("Starting process_bidding_window_closures_task...")
    ready_requests = get_bidding_windows_ready_to_close()
    
    processed = 0
    succeeded = 0
    no_offers = 0
    failed = 0
    
    for pickup_request in ready_requests:
        processed += 1
        try:
            winner = close_bidding_window(pickup_request_id=pickup_request.id)
            if winner:
                succeeded += 1
            else:
                no_offers += 1
        except Exception as e:
            logger.error(f"Failed to close bidding window for request {pickup_request.id}: {e}")
            failed += 1
            
    logger.info(
        f"Finished process_bidding_window_closures_task. "
        f"Processed: {processed}, Succeeded: {succeeded}, No Offers: {no_offers}, Failed: {failed}"
    )
    
    return {
        "processed": processed,
        "succeeded": succeeded,
        "no_offers": no_offers,
        "failed": failed
    }
