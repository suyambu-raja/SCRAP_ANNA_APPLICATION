import random
import logging
from typing import Dict, Any

from django.core.cache import cache
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import (
    Account,
    UserProfile,
    CompanyProfile,
    MerchantProfile,
    AdminProfile,
)

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
