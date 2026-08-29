import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema

from common.permissions import IsAdminRole
from .serializers import SubmitKYCSerializer, KYCRecordSerializer, ProviderCallbackSerializer
from . import services

logger = logging.getLogger(__name__)


class SubmitKYCView(APIView):
    """
    Endpoint for MERCHANT and COMPANY accounts to submit KYC documents.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(request=SubmitKYCSerializer, responses={201: KYCRecordSerializer})
    def post(self, request) -> Response:
        """
        Submit a new KYC record.
        """
        serializer = SubmitKYCSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        record = services.submit_kyc(
            account=request.user,
            provider_name=serializer.validated_data['provider_name'],
            document_reference=serializer.validated_data['document_reference']
        )
        return Response(KYCRecordSerializer(record).data, status=status.HTTP_201_CREATED)


class MyKYCStatusView(APIView):
    """
    Endpoint for users to check their own KYC status.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: KYCRecordSerializer})
    def get(self, request) -> Response:
        """
        Retrieve the most recent KYC record for the authenticated user.
        """
        record = services.get_kyc_status(account=request.user)
        if record is None:
            return Response({"detail": "No KYC record found."}, status=status.HTTP_200_OK)
        return Response(KYCRecordSerializer(record).data, status=status.HTTP_200_OK)


class AdminProviderCallbackView(APIView):
    """
    Admin-only endpoint to manually trigger the KYC callback logic.
    
    TODO: This will need to change to a properly-secured public webhook 
    endpoint once a real KYC vendor is chosen (e.g., verifying signature 
    headers instead of using IsAdminRole).
    """
    permission_classes = [IsAdminRole]

    @extend_schema(request=ProviderCallbackSerializer, responses={200: KYCRecordSerializer})
    def post(self, request) -> Response:
        """
        Process a KYC provider status callback.
        """
        serializer = ProviderCallbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        record = services.handle_provider_callback(
            kyc_record_id=serializer.validated_data['kyc_record_id'],
            provider_status=serializer.validated_data['provider_status'],
            recycle_company_connection_confirmed=serializer.validated_data['recycle_company_connection_confirmed']
        )
        return Response(KYCRecordSerializer(record).data, status=status.HTTP_200_OK)
