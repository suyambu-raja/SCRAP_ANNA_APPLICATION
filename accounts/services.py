import random
import logging
from typing import Dict, Any
from decimal import Decimal

from django.core.cache import cache
from django.db import transaction
from django.db.models import QuerySet
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import (
    Account,
    UserProfile,
    CompanyProfile,
    MerchantProfile,
    AdminProfile,
    RegistrationStatus,
    MerchantBranch
)
from django.utils import timezone

logger = logging.getLogger(__name__)

def generate_otp(phone_number: str) -> str:
    """
    Generates a 6-digit numeric OTP for the given phone number.
    Stores the OTP in the cache with a 5-minute expiry.
    
    Args:
        phone_number (str): The phone number to generate the OTP for.
        
    Returns:
        str: The generated 6-digit OTP.
    """
    otp = str(random.randint(100000, 999999))
    cache_key = f"otp_{phone_number}"
    
    # Store OTP in cache for 5 minutes (300 seconds)
    cache.set(cache_key, otp, timeout=300)
    
    # TODO: Integrate with SMS gateway to send the OTP
    logger.info(f"Generated OTP for phone number: {phone_number}")
    
    return otp

def verify_otp(phone_number: str, submitted_otp: str) -> bool:
    """
    Verifies the submitted OTP against the stored OTP in the cache.
    Deletes the OTP from cache after a successful verification.
    
    Args:
        phone_number (str): The phone number associated with the OTP.
        submitted_otp (str): The OTP submitted by the user.
        
    Returns:
        bool: True if OTP matches and is valid, False otherwise.
    """
    cache_key = f"otp_{phone_number}"
    stored_otp = cache.get(cache_key)
    
    if stored_otp is not None and stored_otp == submitted_otp:
        # Delete the OTP from cache after successful verification (single-use)
        cache.delete(cache_key)
        return True
        
    return False

def create_account_with_profile(phone_number: str, role: str, profile_data: dict) -> Account:
    """
    Creates an Account and its corresponding role-specific profile in a single transaction.
    
    Args:
        phone_number (str): The user's phone number.
        role (str): The role of the user (USER, COMPANY, or MERCHANT).
        profile_data (dict): A dictionary of data needed to create the profile.
        
    Returns:
        Account: The created Account instance.
        
    Raises:
        ValueError: If the role is invalid or required profile data is missing.
    """
    valid_roles = [Account.Role.USER, Account.Role.COMPANY, Account.Role.MERCHANT]
    
    if role not in valid_roles:
        raise ValueError(f"Invalid role '{role}'. Only {valid_roles} are allowed.")

    try:
        with transaction.atomic():
            # Create account with an unusable password since auth is OTP-based
            account = Account.objects.create_user(
                phone_number=phone_number,
                role=role,
                password=None
            )
            
            if role == Account.Role.USER:
                UserProfile.objects.create(account=account, **profile_data)
            elif role == Account.Role.COMPANY:
                CompanyProfile.objects.create(account=account, **profile_data)
            elif role == Account.Role.MERCHANT:
                MerchantProfile.objects.create(account=account, **profile_data)
                
            return account
    except Exception as e:
        # Catch exceptions (e.g. database integrity errors due to missing fields)
        # and raise a clear ValueError.
        raise ValueError(f"Failed to create account and profile: {str(e)}")

def issue_tokens_for_account(account: Account) -> Dict[str, str]:
    """
    Generates JWT access and refresh tokens for the given account.
    Includes the user's role as a custom claim.
    
    Args:
        account (Account): The account to generate tokens for.
        
    Returns:
        dict: A dictionary containing 'access' and 'refresh' tokens as strings.
    """
    refresh = RefreshToken.for_user(account)
    
    # Add custom role claim
    refresh['role'] = account.role
    
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }

def get_profile_for_account(account: Account) -> Any:
    """
    Retrieves the role-specific profile associated with the given account.
    
    Args:
        account (Account): The account to retrieve the profile for.
        
    Returns:
        Any: The profile instance (UserProfile, CompanyProfile, MerchantProfile, or AdminProfile).
        
    Raises:
        ValueError: If no matching profile exists.
    """
    try:
        if account.role == Account.Role.USER:
            return account.user_profile
        elif account.role == Account.Role.COMPANY:
            return account.company_profile
        elif account.role == Account.Role.MERCHANT:
            return account.merchant_profile
        elif account.role == Account.Role.ADMIN:
            return account.admin_profile
        else:
            raise ValueError(f"Unknown role '{account.role}' for account {account.phone_number}.")
    except ObjectDoesNotExist:
        raise ValueError(f"Data integrity error: No profile found for account {account.phone_number} with role {account.role}.")


# Note: For create_account_with_profile(), shop_photo_url is naturally expected 
# to be included in profile_data for MERCHANT/COMPANY registrations, since the 
# field now exists on both profile models.

def get_pending_registrations(admin_account: Account) -> dict:
    """
    Retrieves all pending registrations for Company and Merchant accounts.
    Returns a dict with 'companies' and 'merchants' keys containing lists of profiles.
    
    Args:
        admin_account (Account): The admin account requesting the list.
        
    Returns:
        dict: A dictionary containing lists of pending CompanyProfile and MerchantProfile objects.
        
    Raises:
        PermissionError: If admin_account is not an ADMIN.
    """
    if getattr(admin_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("Only ADMIN accounts can view pending registrations.")
        
    pending_companies = list(CompanyProfile.objects.filter(
        registration_status=RegistrationStatus.PENDING_REVIEW
    ).order_by('created_at'))
    
    pending_merchants = list(MerchantProfile.objects.filter(
        registration_status=RegistrationStatus.PENDING_REVIEW
    ).order_by('created_at'))
    
    return {
        "companies": pending_companies,
        "merchants": pending_merchants
    }

def approve_registration(account: Account, admin_account: Account) -> Any:
    """
    Approves a pending or rejected registration for a Merchant or Company.
    
    Args:
        account (Account): The merchant or company account to approve.
        admin_account (Account): The admin account approving the registration.
        
    Returns:
        Any: The updated profile object.
        
    Raises:
        PermissionError: If admin_account is not an ADMIN, or account is not MERCHANT/COMPANY.
        ValueError: If registration_status is not PENDING_REVIEW or REJECTED.
    """
    if getattr(admin_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("Only ADMIN accounts can approve registrations.")
        
    if account.role not in [Account.Role.MERCHANT, Account.Role.COMPANY]:
        raise PermissionError("Only MERCHANT and COMPANY accounts require registration approval.")
        
    profile = get_profile_for_account(account)
    
    if profile.registration_status not in [RegistrationStatus.PENDING_REVIEW, RegistrationStatus.REJECTED]:
        raise ValueError(f"Cannot approve registration with status {profile.registration_status}.")
        
    with transaction.atomic():
        profile.registration_status = RegistrationStatus.APPROVED
        profile.reviewed_by = admin_account
        profile.reviewed_at = timezone.now()
        profile.save()
        
    # Local import to prevent circular dependencies between accounts and notifications
    from notifications.services import notify
    try:
        notify(account, "REGISTRATION_APPROVED", {})
    except Exception as e:
        logger.warning(f"Failed to send REGISTRATION_APPROVED notification to {account.phone_number}: {e}")
        
    logger.info(f"Registration for {account.phone_number} approved by {admin_account.phone_number}.")
    return profile

def reject_registration(account: Account, admin_account: Account, reason: str) -> Any:
    """
    Rejects a pending registration for a Merchant or Company.
    
    Note: resubmission_count tracks REJECTIONS received (incremented here when Admin rejects), 
    not resubmission attempts made. This is the natural place to enforce the 3-strike limit.
    
    Args:
        account (Account): The merchant or company account to reject.
        admin_account (Account): The admin account rejecting the registration.
        reason (str): The explanation for rejection shown to the user.
        
    Returns:
        Any: The updated profile object.
        
    Raises:
        PermissionError: If admin_account is not an ADMIN, or account is not MERCHANT/COMPANY.
        ValueError: If registration_status is not PENDING_REVIEW, or reason is empty.
    """
    if getattr(admin_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("Only ADMIN accounts can reject registrations.")
        
    if account.role not in [Account.Role.MERCHANT, Account.Role.COMPANY]:
        raise PermissionError("Only MERCHANT and COMPANY accounts can be rejected.")
        
    if not reason or not reason.strip():
        raise ValueError("A rejection reason must be provided.")
        
    profile = get_profile_for_account(account)
    
    if profile.registration_status != RegistrationStatus.PENDING_REVIEW:
        raise ValueError(f"Cannot reject registration with status {profile.registration_status}. It must be PENDING_REVIEW.")
        
    with transaction.atomic():
        profile.resubmission_count += 1
        
        if profile.resubmission_count > 3:
            profile.registration_status = RegistrationStatus.PERMANENTLY_REJECTED
        else:
            profile.registration_status = RegistrationStatus.REJECTED
            
        profile.rejection_reason = reason
        profile.reviewed_by = admin_account
        profile.reviewed_at = timezone.now()
        profile.save()
        
    # Local import to prevent circular dependencies between accounts and notifications
    from notifications.services import notify
    try:
        if profile.registration_status == RegistrationStatus.REJECTED:
            notify(account, "REGISTRATION_REJECTED", {"rejection_reason": reason})
        else:
            notify(account, "REGISTRATION_PERMANENTLY_REJECTED", {})
    except Exception as e:
        logger.warning(f"Failed to send rejection notification to {account.phone_number}: {e}")
        
    logger.info(f"Registration for {account.phone_number} rejected by {admin_account.phone_number} (Strike {profile.resubmission_count}).")
    return profile

def resubmit_registration(account: Account, updated_profile_data: dict) -> Any:
    """
    Resubmits a rejected registration with updated profile data.
    
    Args:
        account (Account): The merchant or company account resubmitting.
        updated_profile_data (dict): The updated fields for the profile.
        
    Returns:
        Any: The updated profile object.
        
    Raises:
        ValueError: If registration_status is not REJECTED, or invalid fields are provided.
    """
    profile = get_profile_for_account(account)
    
    if profile.registration_status != RegistrationStatus.REJECTED:
        raise ValueError(f"Cannot resubmit registration with status {profile.registration_status}. Only REJECTED registrations can be resubmitted.")
        
    # Define explicit allowlist of user-editable fields per profile type to prevent privilege escalation
    if isinstance(profile, CompanyProfile):
        allowed_fields = {"company_name", "registration_number", "address", "latitude", "longitude", "shop_photo_url"}
    elif isinstance(profile, MerchantProfile):
        allowed_fields = {"name", "has_storage", "latitude", "longitude", "shop_photo_url"}
    else:
        raise ValueError(f"Resubmission not supported for profile type {profile.__class__.__name__}")
    
    with transaction.atomic():
        for key, value in updated_profile_data.items():
            if key in allowed_fields:
                setattr(profile, key, value)
            else:
                raise ValueError(f"Invalid or restricted field '{key}' provided for {profile.__class__.__name__}.")
                
        profile.registration_status = RegistrationStatus.PENDING_REVIEW
        profile.rejection_reason = None
        profile.save()
        
    logger.info(f"Registration for {account.phone_number} successfully resubmitted.")
    return profile

def create_merchant_branch(
    parent_merchant_account: Account, 
    branch_phone_number: str, 
    branch_name: str, 
    latitude: Decimal, 
    longitude: Decimal
) -> MerchantBranch:
    """
    Creates a new branch for a parent merchant business.
    
    A branch gets its own login (Account) but relies on the parent's MerchantProfile 
    for KYC, tier, and trust score. This function connects to future lead/offer 
    matching logic in pickups/bidding which will resolve nearest locations by branch.
    
    Args:
        parent_merchant_account (Account): The owner merchant account.
        branch_phone_number (str): The phone number for the branch login.
        branch_name (str): The name of the branch.
        latitude (Decimal): Branch latitude.
        longitude (Decimal): Branch longitude.
        
    Returns:
        MerchantBranch: The created branch linking the new account to the parent.
        
    Raises:
        PermissionError: If parent account is not a MERCHANT.
        ValueError: If parent's registration is not APPROVED.
    """
    if getattr(parent_merchant_account, 'role', None) != Account.Role.MERCHANT:
        raise PermissionError("Only MERCHANT accounts can create branches.")
        
    parent_profile = get_profile_for_account(parent_merchant_account)
    if parent_profile.registration_status != RegistrationStatus.APPROVED:
        raise ValueError("Branches can only be created by an APPROVED parent merchant.")
        
    with transaction.atomic():
        # Note: The branch Account's is_verified is a snapshot of the parent's status 
        # at creation time. If the parent's verification status changes later, 
        # that must be handled separately.
        # Also note: We intentionally create an Account WITHOUT a profile here. 
        # Branches link to the parent's MerchantProfile via MerchantBranch.
        branch_account = Account.objects.create_user(
            phone_number=branch_phone_number,
            role=Account.Role.MERCHANT,
            password=None,
            is_verified=parent_merchant_account.is_verified
        )
        
        branch = MerchantBranch.objects.create(
            branch_account=branch_account,
            parent_merchant=parent_merchant_account,
            branch_name=branch_name,
            latitude=latitude,
            longitude=longitude
        )
        
    # Local import to prevent circular dependencies between accounts and notifications
    from notifications.services import notify
    try:
        notify(branch_account, "BRANCH_CREATED", {"branch_name": branch_name})
    except Exception as e:
        logger.warning(f"Failed to send BRANCH_CREATED notification to {branch_account.phone_number}: {e}")
        
    logger.info(f"Branch '{branch_name}' created for merchant {parent_merchant_account.phone_number}.")
    return branch

def get_branches_for_merchant(parent_merchant_account: Account) -> QuerySet:
    """
    Retrieves all branches owned by a parent merchant account.
    
    Args:
        parent_merchant_account (Account): The parent merchant.
        
    Returns:
        QuerySet: The branches belonging to the parent merchant, ordered by creation date.
        
    Raises:
        PermissionError: If the account is not a MERCHANT.
    """
    if getattr(parent_merchant_account, 'role', None) != Account.Role.MERCHANT:
        raise PermissionError("Only MERCHANT accounts have branches.")
        
    return MerchantBranch.objects.filter(parent_merchant=parent_merchant_account).order_by('created_at')

def deactivate_branch(branch_id: int, parent_merchant_account: Account) -> MerchantBranch:
    """
    Operationally deactivates a branch so it won't receive new matches.
    
    Note: This does NOT deactivate the branch's login account (branch_account.is_active). 
    Deciding whether to lock the login itself is a separate concern.
    
    Args:
        branch_id (int): The ID of the MerchantBranch.
        parent_merchant_account (Account): The owner merchant account.
        
    Returns:
        MerchantBranch: The deactivated branch.
        
    Raises:
        ValueError: If the branch is not found.
        PermissionError: If the parent_merchant_account is not the owner of the branch.
    """
    try:
        branch = MerchantBranch.objects.get(id=branch_id)
    except MerchantBranch.DoesNotExist:
        raise ValueError(f"MerchantBranch {branch_id} not found.")
        
    if branch.parent_merchant != parent_merchant_account:
        raise PermissionError("You can only deactivate your own branches.")
        
    branch.is_active = False
    branch.save()
    
    logger.info(f"Branch '{branch.branch_name}' deactivated by merchant {parent_merchant_account.phone_number}.")
    return branch

def get_effective_merchant_profile(account: Account) -> MerchantProfile:
    """
    Resolves the effective MerchantProfile that governs trust/tier/penalties 
    for the given merchant account (whether it's a standalone parent or a branch).
    
    Args:
        account (Account): The merchant-role account.
        
    Returns:
        MerchantProfile: The governing merchant profile.
        
    Raises:
        ValueError: If no valid profile can be resolved.
    """
    if getattr(account, 'role', None) != Account.Role.MERCHANT:
        raise ValueError("Cannot resolve a MerchantProfile for a non-MERCHANT account.")
        
    # Check if this account is a branch
    if hasattr(account, 'merchant_branch'):
        # Resolve UP to the parent's profile
        return get_profile_for_account(account.merchant_branch.parent_merchant)
        
    # If not a branch, it must be a standalone parent merchant
    try:
        return get_profile_for_account(account)
    except ValueError as e:
        raise ValueError(f"Data integrity issue: {e}")
