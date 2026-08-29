import logging
from typing import Optional
from django.db import transaction
from django.utils import timezone

from accounts.models import Account, MerchantProfile
from accounts.services import get_profile_for_account
from kyc.models import KYCRecord

logger = logging.getLogger(__name__)

def check_for_duplicate_document(document_reference: str, excluding_account: Optional[Account] = None) -> bool:
    """
    Checks if any OTHER account has a VERIFIED KYC record with the same document reference.
    This acts as a simple fraud-prevention check against free-trial/duplicate-account abuse.
    
    Args:
        document_reference (str): The document identifier to check.
        excluding_account (Account, optional): The account to exclude from the check.
        
    Returns:
        bool: True if a duplicate is found, False otherwise.
    """
    qs = KYCRecord.objects.filter(
        document_reference=document_reference, 
        status=KYCRecord.Status.VERIFIED
    )
    
    if excluding_account:
        qs = qs.exclude(account=excluding_account)
        
    return qs.exists()


def submit_kyc(account: Account, provider_name: str, document_reference: str) -> KYCRecord:
    """
    Submits a new KYC record for an account. KYC is mandatory for MERCHANT and COMPANY roles.
    
    Args:
        account (Account): The account submitting KYC.
        provider_name (str): The name of the KYC provider.
        document_reference (str): The reference/ID of the uploaded document.
        
    Returns:
        KYCRecord: The newly created pending KYC record.
        
    Raises:
        PermissionError: If the account role is not MERCHANT or COMPANY.
        ValueError: If a duplicate VERIFIED document reference is found.
    """
    if account.role not in [Account.Role.MERCHANT, Account.Role.COMPANY]:
        raise PermissionError("Only MERCHANT and COMPANY accounts can submit KYC.")
        
    profile = get_profile_for_account(account)
    if profile.registration_status != 'APPROVED':
        raise ValueError(f"Registration must be approved by an Admin before KYC can be submitted. Current status: {profile.registration_status}")
        
    if check_for_duplicate_document(document_reference, excluding_account=account):
        raise ValueError(f"Document reference {document_reference} is already verified by another account.")
        
    kyc_record = KYCRecord.objects.create(
        account=account,
        provider_name=provider_name,
        document_reference=document_reference,
        status=KYCRecord.Status.PENDING
    )
    
    # TODO: ACTUAL KYC PROVIDER INTEGRATION PENDING
    # The specific third-party KYC provider is TBD (Section 12 of the PRD).
    # Replace the below placeholders with the actual HTTP call to the provider.
    
    # import requests
    # url = "https://api.example-kyc-provider.com/v1/verifications"
    # headers = {
    #     "Authorization": "Bearer PENDING_PROVIDER_TOKEN",
    #     "Content-Type": "application/json"
    # }
    # payload = {
    #     "reference_id": str(kyc_record.id),
    #     "document_id": document_reference,
    #     "customer_phone": str(account.phone_number)
    # }
    # response = requests.post(url, json=payload, headers=headers)
    # response.raise_for_status()
    
    logger.info(f"[PLACEHOLDER] KYC submitted for {account.phone_number}, record {kyc_record.id}")
    return kyc_record


def handle_provider_callback(kyc_record_id: int, provider_status: str, recycle_company_connection_confirmed: bool = False) -> KYCRecord:
    """
    Simulates a webhook/callback handler from the KYC provider to update the verification status.
    
    DESIGN NOTE: The `recycle_company_connection_confirmed` flag is accepted as an explicit parameter here 
    because KYCRecord itself has no field for this. This is a deliberate design choice given the current 
    schema, to allow Big Merchant tier upgrades based on vendor responses without altering the model.
    
    Args:
        kyc_record_id (int): The ID of the KYC record.
        provider_status (str): The returned status from the provider.
        recycle_company_connection_confirmed (bool): True if the provider confirmed a genuine recycling-company connection.
        
    Returns:
        KYCRecord: The updated KYC record.
        
    Raises:
        ValueError: If the KYC record doesn't exist or the status is not recognized.
    """
    try:
        kyc_record = KYCRecord.objects.select_related('account').get(id=kyc_record_id)
    except KYCRecord.DoesNotExist:
        raise ValueError(f"KYCRecord {kyc_record_id} does not exist.")
        
    if provider_status not in KYCRecord.Status.values:
        raise ValueError(f"Invalid provider_status. Must be one of {KYCRecord.Status.values}.")
        
    with transaction.atomic():
        kyc_record.status = provider_status
        update_fields = ['status']
        
        if provider_status == KYCRecord.Status.VERIFIED:
            kyc_record.verified_at = timezone.now()
            update_fields.append('verified_at')
            
            account = kyc_record.account
            if not account.is_verified:
                account.is_verified = True
                account.save(update_fields=['is_verified'])
                
            if account.role == Account.Role.MERCHANT and recycle_company_connection_confirmed:
                try:
                    profile = account.merchant_profile
                    profile.tier = MerchantProfile.Tier.BIG
                    profile.recycle_company_verified = True
                    profile.save(update_fields=['tier', 'recycle_company_verified'])
                    logger.info(f"Merchant {account.phone_number} upgraded to BIG tier upon KYC verification.")
                except MerchantProfile.DoesNotExist:
                    logger.error(f"MerchantProfile missing for verified merchant {account.phone_number}")
                    
        kyc_record.save(update_fields=update_fields)
        
        logger.info(f"KYC record {kyc_record.id} updated to {provider_status}.")
        
    # Local import to prevent circular dependencies
    from notifications.services import notify
    
    if provider_status == KYCRecord.Status.VERIFIED:
        try:
            notify(kyc_record.account, "KYC_VERIFIED", {})
        except Exception as e:
            logger.warning(f"Failed to send KYC_VERIFIED notification to {kyc_record.account.phone_number}: {e}")
    elif provider_status == KYCRecord.Status.REJECTED:
        try:
            notify(kyc_record.account, "KYC_REJECTED", {})
        except Exception as e:
            logger.warning(f"Failed to send KYC_REJECTED notification to {kyc_record.account.phone_number}: {e}")
            
    return kyc_record


def get_kyc_status(account: Account) -> Optional[KYCRecord]:
    """
    Retrieves the most recent KYC record for an account.
    
    Args:
        account (Account): The account to check.
        
    Returns:
        KYCRecord or None: The latest KYC record, or None if none exists.
    """
    return KYCRecord.objects.filter(account=account).order_by('-created_at').first()
