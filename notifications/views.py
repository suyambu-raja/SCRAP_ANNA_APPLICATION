import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from common.permissions import IsAdminRole
from accounts.models import Account
from accounts.services import get_profile_for_account, get_effective_merchant_profile
from notifications.services import get_notification_history
from notifications.serializers import (
    NotificationLogSerializer,
    UpdateNotificationPreferencesSerializer,
    NotificationPreferencesOutputSerializer
)

logger = logging.getLogger(__name__)

class MyNotificationHistoryView(APIView):
    """
    Retrieves the notification history for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = get_notification_history(account=request.user, requesting_account=request.user)
        return Response(NotificationLogSerializer(history, many=True).data, status=status.HTTP_200_OK)


class AdminViewAccountNotificationHistoryView(APIView):
    """
    Allows an admin to view the notification history of any given account.
    """
    permission_classes = [IsAdminRole]

    def get(self, request, account_id):
        try:
            target_account = Account.objects.get(id=account_id)
        except Account.DoesNotExist:
            raise ValueError("Account not found.")
            
        history = get_notification_history(account=target_account, requesting_account=request.user)
        return Response(NotificationLogSerializer(history, many=True).data, status=status.HTTP_200_OK)


class MyNotificationPreferencesView(APIView):
    """
    Allows a Merchant or Company to retrieve and update their notification preferences.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in [Account.Role.MERCHANT, Account.Role.COMPANY]:
            raise PermissionError("Only MERCHANT and COMPANY accounts have notification preferences.")
            
        if request.user.role == Account.Role.MERCHANT:
            profile = get_effective_merchant_profile(request.user)
        else:
            profile = get_profile_for_account(request.user)
            
        return Response(NotificationPreferencesOutputSerializer({
            "voice_call_enabled": profile.voice_call_enabled,
            "language_preference": profile.language_preference
        }).data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.role not in [Account.Role.MERCHANT, Account.Role.COMPANY]:
            raise PermissionError("Only MERCHANT and COMPANY accounts can update notification preferences.")
            
        serializer = UpdateNotificationPreferencesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if request.user.role == Account.Role.MERCHANT:
            profile = get_effective_merchant_profile(request.user)
        else:
            profile = get_profile_for_account(request.user)
            
        updated = False
        if 'voice_call_enabled' in serializer.validated_data:
            profile.voice_call_enabled = serializer.validated_data['voice_call_enabled']
            updated = True
            
        if 'language_preference' in serializer.validated_data:
            profile.language_preference = serializer.validated_data['language_preference']
            updated = True
            
        if updated:
            profile.save()
            logger.info(f"Notification preferences updated for account {request.user.phone_number}.")
            
        return Response(NotificationPreferencesOutputSerializer({
            "voice_call_enabled": profile.voice_call_enabled,
            "language_preference": profile.language_preference
        }).data, status=status.HTTP_200_OK)
