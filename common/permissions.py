from rest_framework.permissions import BasePermission
from accounts.models import Account


class IsUserRole(BasePermission):
    """
    Allows access only to authenticated accounts with the USER role.
    Used for endpoints meant for individual household consumers.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', None) == Account.Role.USER
        )


class IsCompanyRole(BasePermission):
    """
    Allows access only to authenticated accounts with the COMPANY role.
    Used for endpoints meant for corporate/enterprise clients.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', None) == Account.Role.COMPANY
        )


class IsMerchantRole(BasePermission):
    """
    Allows access only to authenticated accounts with the MERCHANT role.
    Used for endpoints meant for scrap collectors/vendors.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', None) == Account.Role.MERCHANT
        )


class IsAdminRole(BasePermission):
    """
    Allows access only to authenticated accounts with the ADMIN role.
    Used for internal platform administration endpoints.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', None) == Account.Role.ADMIN
        )


class IsVerifiedMerchant(BasePermission):
    """
    Allows access only to authenticated accounts with the MERCHANT role 
    that have also passed KYC verification (is_verified == True).
    Used for actions that require KYC-cleared merchants (e.g. accepting leads, submitting bids).
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            getattr(request.user, 'role', None) == Account.Role.MERCHANT and 
            getattr(request.user, 'is_verified', False) is True
        )
