import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from drf_spectacular.utils import extend_schema

from common.permissions import IsAdminRole
from .serializers import FeatureFlagSerializer, ToggleFlagSerializer, FlagCheckResponseSerializer
from . import services

logger = logging.getLogger(__name__)


class CheckFlagView(APIView):
    """
    Public endpoint to check whether a specific feature flag is enabled.
    This is used by clients to gate features like Phase 2 flows before login.
    """
    permission_classes = [AllowAny]

    @extend_schema(responses={200: FlagCheckResponseSerializer})
    def get(self, request, flag_name: str) -> Response:
        """
        Check the status of a specific feature flag by its name.
        """
        is_enabled = services.is_flag_enabled(flag_name)
        return Response(
            {"flag_name": flag_name, "is_enabled": is_enabled},
            status=status.HTTP_200_OK
        )


class ListAllFlagsView(APIView):
    """
    Admin-only endpoint to list all feature flags in the system.
    """
    permission_classes = [IsAdminRole]

    @extend_schema(responses={200: FeatureFlagSerializer(many=True)})
    def get(self, request) -> Response:
        """
        Return a list of all feature flags.
        """
        flags = services.list_all_flags(admin_account=request.user)
        serializer = FeatureFlagSerializer(flags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ToggleFlagView(APIView):
    """
    Admin-only endpoint to toggle a feature flag on or off.
    """
    permission_classes = [IsAdminRole]

    @extend_schema(request=ToggleFlagSerializer, responses={200: FeatureFlagSerializer})
    def post(self, request) -> Response:
        """
        Toggle the status of a feature flag. Creates the flag if it does not exist.
        """
        serializer = ToggleFlagSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        flag_name = serializer.validated_data['flag_name']
        is_enabled = serializer.validated_data['is_enabled']

        flag = services.toggle_flag(
            flag_name=flag_name,
            is_enabled=is_enabled,
            admin_account=request.user
        )
        return Response(
            FeatureFlagSerializer(flag).data,
            status=status.HTTP_200_OK
        )
