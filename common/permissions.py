from rest_framework import permissions
from accounts.models import Account

class IsUserRole(permissions.IsAuthenticated):
    """Allows access only to accounts with the USER role."""
    def has_permission(self, request, view):
        return super().has_permission(request, view) and getattr(request.user, 'role', None) == Account.Role.USER

class IsCompanyRole(permissions.IsAuthenticated):
    """Allows access only to accounts with the COMPANY role."""
    def has_permission(self, request, view):
        return super().has_permission(request, view) and getattr(request.user, 'role', None) == Account.Role.COMPANY

class IsMerchantRole(permissions.IsAuthenticated):
    """Allows access only to accounts with the MERCHANT role."""
    def has_permission(self, request, view):
        return super().has_permission(request, view) and getattr(request.user, 'role', None) == Account.Role.MERCHANT

class IsAdminRole(permissions.IsAuthenticated):
    """Allows access only to accounts with the ADMIN role."""
    def has_permission(self, request, view):
        return super().has_permission(request, view) and getattr(request.user, 'role', None) == Account.Role.ADMIN

class IsVerifiedMerchant(IsMerchantRole):
    """Allows access only to MERCHANT accounts that have passed KYC verification."""
    def has_permission(self, request, view):
        return super().has_permission(request, view) and getattr(request.user, 'is_verified', False)
