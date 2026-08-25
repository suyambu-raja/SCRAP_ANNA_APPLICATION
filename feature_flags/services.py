import logging
from django.core.cache import cache
from django.db.models import QuerySet

from accounts.models import Account
from feature_flags.models import FeatureFlag

logger = logging.getLogger(__name__)

def is_flag_enabled(flag_name: str) -> bool:
    """
    Checks if a given feature flag is enabled.
    
    This function uses Django's cache framework to avoid hitting the database
    on every check. The cache timeout is set to 300 seconds (5 minutes). If the
    flag does not exist in the database, it defaults to False safely without
    raising an exception.
    
    Args:
        flag_name (str): The name of the feature flag to check.
        
    Returns:
        bool: True if the flag is enabled, False otherwise (or if it doesn't exist).
    """
    cache_key = f"feature_flag:{flag_name}"
    cached_value = cache.get(cache_key)
    
    if cached_value is not None:
        return cached_value
        
    try:
        flag = FeatureFlag.objects.get(flag_name=flag_name)
        is_enabled = flag.is_enabled
    except FeatureFlag.DoesNotExist:
        # Default to False if the flag hasn't been configured yet
        is_enabled = False
        
    # Cache the result for 300 seconds (5 minutes)
    cache.set(cache_key, is_enabled, timeout=300)
    
    return is_enabled


def toggle_flag(flag_name: str, is_enabled: bool, admin_account: Account) -> FeatureFlag:
    """
    Toggles a feature flag on or off. Only Admin accounts can perform this action.
    
    This will create the flag if it doesn't exist. It will also immediately
    invalidate the cache for this flag so changes take effect without delay.
    
    Args:
        flag_name (str): The name of the feature flag.
        is_enabled (bool): The new boolean state for the flag.
        admin_account (Account): The Admin account making the change.
        
    Returns:
        FeatureFlag: The created or updated feature flag object.
        
    Raises:
        PermissionError: If admin_account is not an ADMIN.
    """
    if getattr(admin_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("Only ADMIN accounts can toggle feature flags.")
        
    flag, created = FeatureFlag.objects.update_or_create(
        flag_name=flag_name,
        defaults={
            'is_enabled': is_enabled,
            'toggled_by': admin_account
        }
    )
    
    # Invalidate the cache entry immediately so next is_flag_enabled call sees the change
    cache_key = f"feature_flag:{flag_name}"
    cache.delete(cache_key)
    
    logger.info(f"Feature flag '{flag_name}' toggled to {is_enabled} by {admin_account.phone_number}.")
    
    return flag


def list_all_flags(admin_account: Account) -> QuerySet:
    """
    Lists all feature flags in the system.
    
    Args:
        admin_account (Account): The Admin account requesting the list.
        
    Returns:
        QuerySet: A queryset of all FeatureFlag objects, ordered alphabetically.
        
    Raises:
        PermissionError: If admin_account is not an ADMIN.
    """
    if getattr(admin_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("Only ADMIN accounts can view feature flags.")
        
    return FeatureFlag.objects.all().order_by('flag_name')
