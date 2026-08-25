import logging
from typing import Optional, List, Dict, Any
from django.db import transaction
from django.db.models import QuerySet

from accounts.models import Account
from complaints.models import Complaint
from pickups.models import Bill
from marketplace.models import MarketplaceSale
from trust.services import record_merchant_penalty

logger = logging.getLogger(__name__)

def create_complaint(
    raised_by_account: Account, 
    complaint_type: str, 
    related_bill_id: Optional[int] = None, 
    related_sale_id: Optional[int] = None, 
    evidence_urls: Optional[List[str]] = None
) -> Complaint:
    """
    Creates a new complaint. Can be raised by any authenticated account.
    
    Args:
        raised_by_account (Account): The account raising the complaint.
        complaint_type (str): The type/category of the complaint (e.g. "weight dispute").
        related_bill_id (int, optional): ID of a related pickups Bill.
        related_sale_id (int, optional): ID of a related MarketplaceSale.
        evidence_urls (list, optional): List of evidence URL strings.
        
    Returns:
        Complaint: The newly created complaint in OPEN status.
        
    Raises:
        ValueError: If both bill and sale IDs are provided, or if the referenced record is not found.
    """
    if related_bill_id is not None and related_sale_id is not None:
        raise ValueError("A complaint can reference at most one transaction (bill OR sale), not both.")
        
    bill = None
    if related_bill_id is not None:
        try:
            bill = Bill.objects.get(id=related_bill_id)
        except Bill.DoesNotExist:
            raise ValueError(f"Related Bill {related_bill_id} not found.")
            
    sale = None
    if related_sale_id is not None:
        try:
            sale = MarketplaceSale.objects.get(id=related_sale_id)
        except MarketplaceSale.DoesNotExist:
            raise ValueError(f"Related MarketplaceSale {related_sale_id} not found.")
            
    evidence = evidence_urls if evidence_urls is not None else []
    
    complaint = Complaint.objects.create(
        raised_by=raised_by_account,
        complaint_type=complaint_type,
        related_bill=bill,
        related_sale=sale,
        evidence_urls=evidence,
        status=Complaint.Status.OPEN
    )
    
    logger.info(f"Created Complaint {complaint.id} for {raised_by_account.phone_number} (Type: {complaint_type})")
    return complaint


def get_complaint_status(complaint_id: int, requesting_account: Account) -> Complaint:
    """
    Retrieves the status of a specific complaint.
    
    Args:
        complaint_id (int): The ID of the complaint.
        requesting_account (Account): The account requesting the status.
        
    Returns:
        Complaint: The complaint object.
        
    Raises:
        ValueError: If the complaint does not exist.
        PermissionError: If the requester is neither the original complainant nor an Admin.
    """
    try:
        complaint = Complaint.objects.get(id=complaint_id)
    except Complaint.DoesNotExist:
        raise ValueError(f"Complaint {complaint_id} does not exist.")
        
    is_owner = complaint.raised_by_id == requesting_account.id
    is_admin = getattr(requesting_account, 'role', None) == Account.Role.ADMIN
    
    if not (is_owner or is_admin):
        raise PermissionError("You do not have permission to view this complaint's status.")
        
    return complaint


def get_admin_complaint_queue(admin_account: Account, status_filter: Optional[str] = None) -> QuerySet:
    """
    Retrieves the complaint queue for Admins.
    
    Args:
        admin_account (Account): The Admin account requesting the queue.
        status_filter (str, optional): An optional status string to filter by.
        
    Returns:
        QuerySet: A queryset of Complaint objects, ordered oldest first.
        
    Raises:
        PermissionError: If the account is not an ADMIN.
    """
    if getattr(admin_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("Only ADMIN accounts can view the complaint queue.")
        
    qs = Complaint.objects.all().order_by('created_at')
    
    if status_filter:
        qs = qs.filter(status=status_filter)
        
    return qs


def auto_pull_transaction_data(related_bill_id: Optional[int] = None, related_sale_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Auto-pulls relevant transaction details to present to the user before submitting a complaint.
    
    Args:
        related_bill_id (int, optional): ID of a related pickups Bill.
        related_sale_id (int, optional): ID of a related MarketplaceSale.
        
    Returns:
        dict: The transaction details.
        
    Raises:
        ValueError: If neither or both IDs are provided, or the record does not exist.
    """
    if (related_bill_id is None) == (related_sale_id is None):
        raise ValueError("Must provide exactly one of related_bill_id or related_sale_id.")
        
    if related_bill_id is not None:
        try:
            bill = Bill.objects.select_related('merchant').get(id=related_bill_id)
        except Bill.DoesNotExist:
            raise ValueError(f"Bill {related_bill_id} not found.")
            
        return {
            "type": "BILL",
            "weight_kg": str(bill.weight_kg),
            "price_per_unit": str(bill.price_per_unit),
            "total_amount": str(bill.total_amount),
            "merchant_phone": str(bill.merchant.phone_number)
        }
        
    if related_sale_id is not None:
        try:
            sale = MarketplaceSale.objects.select_related('listing__merchant').get(id=related_sale_id)
        except MarketplaceSale.DoesNotExist:
            raise ValueError(f"MarketplaceSale {related_sale_id} not found.")
            
        return {
            "type": "MARKETPLACE_SALE",
            "item_name": sale.listing.item_name,
            "amount_paid": str(sale.amount_paid),
            "delivery_slot": sale.delivery_slot.isoformat() if sale.delivery_slot else None,
            "merchant_phone": str(sale.listing.merchant.phone_number)
        }


def resolve_complaint(complaint_id: int, admin_account: Account, resolution_outcome: str, resolution_notes: Optional[str] = None) -> Complaint:
    """
    Resolves a complaint and automatically enforces trust penalties if appropriate.
    
    Args:
        complaint_id (int): The ID of the complaint.
        admin_account (Account): The Admin account resolving the complaint.
        resolution_outcome (str): The outcome (must be in Complaint.ResolutionOutcome choices).
        resolution_notes (str, optional): Notes regarding the resolution.
        
    Returns:
        Complaint: The resolved complaint.
        
    Raises:
        PermissionError: If admin_account is not an ADMIN.
        ValueError: If complaint doesn't exist, is already resolved, or outcome is invalid.
    """
    if getattr(admin_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("Only ADMIN accounts can resolve complaints.")
        
    if resolution_outcome not in Complaint.ResolutionOutcome.values:
        raise ValueError(f"Invalid resolution outcome. Must be one of {Complaint.ResolutionOutcome.values}.")
        
    with transaction.atomic():
        try:
            # select_for_update to ensure we don't resolve concurrently
            complaint = Complaint.objects.select_for_update().get(id=complaint_id)
        except Complaint.DoesNotExist:
            raise ValueError(f"Complaint {complaint_id} does not exist.")
            
        if complaint.status == Complaint.Status.RESOLVED:
            raise ValueError("This complaint is already RESOLVED.")
            
        complaint.status = Complaint.Status.RESOLVED
        complaint.resolution_outcome = resolution_outcome
        
        if resolution_notes:
            complaint.resolution_notes = resolution_notes
            logger.info(f"Resolution notes for Complaint {complaint_id}: {resolution_notes}")
            
        complaint.save(update_fields=['status', 'resolution_outcome', 'resolution_notes'])
            
        # Handle asymmetric trust consequences
        if resolution_outcome == Complaint.ResolutionOutcome.AGAINST_MERCHANT:
            merchant = None
            if complaint.related_bill_id:
                # Need to fetch merchant via related bill
                bill = Bill.objects.select_related('merchant').get(id=complaint.related_bill_id)
                merchant = bill.merchant
            elif complaint.related_sale_id:
                # Need to fetch merchant via related sale listing
                sale = MarketplaceSale.objects.select_related('listing__merchant').get(id=complaint.related_sale_id)
                merchant = sale.listing.merchant
                
            if merchant:
                record_merchant_penalty(merchant, offense_type=f"complaint_resolved_against_merchant_{complaint.complaint_type}")
                logger.info(f"Applied penalty to merchant {merchant.phone_number} for Complaint {complaint_id}.")
            else:
                logger.warning(f"Complaint {complaint_id} resolved AGAINST_MERCHANT, but no linked transaction found to identify merchant. Skipping penalty.")
                
        elif resolution_outcome == Complaint.ResolutionOutcome.AGAINST_SOURCE:
            # INTENTIONAL: Per the asymmetric trust rule, sources (Households/Companies) 
            # are NEVER penalized. Skipping any penalty call here explicitly.
            logger.info(f"Complaint {complaint_id} resolved AGAINST_SOURCE. Sources are never penalized per asymmetric trust rule.")
            
        return complaint
