import logging
from celery import shared_task
from pickups.services import get_expired_leads, reassign_expired_lead

logger = logging.getLogger(__name__)

@shared_task
def process_expired_leads_task():
    """
    Celery task that processes all expired leads.
    """
    logger.info("Starting process_expired_leads_task...")
    expired_leads = get_expired_leads()
    
    processed = 0
    succeeded = 0
    failed = 0
    
    for lead in expired_leads:
        processed += 1
        try:
            reassign_expired_lead(lead)
            succeeded += 1
        except Exception as e:
            logger.error(f"Failed to reassign expired lead {lead.id}: {e}")
            failed += 1
            
    logger.info(f"Finished process_expired_leads_task. Processed: {processed}, Succeeded: {succeeded}, Failed: {failed}")
    
    return {
        "processed": processed,
        "succeeded": succeeded,
        "failed": failed
    }
