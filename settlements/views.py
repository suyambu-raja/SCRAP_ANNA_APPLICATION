import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from common.permissions import IsAdminRole, IsMerchantRole
from settlements.models import (
    CommissionRate, 
    CommissionRateHistory, 
    SettlementRecord, 
    MarketplaceSettlementRecord
)
from settlements.serializers import (
    CommissionRateSerializer,
    UpdateCommissionRateSerializer,
    CommissionRateHistorySerializer,
    SettlementRecordSerializer,
    MarketplaceSettlementRecordSerializer
)
from settlements.services import update_commission_rate

logger = logging.getLogger(__name__)

class CommissionRateListView(APIView):
    """
    Admin-only endpoint to view all active commission rates across the platform.
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        rates = CommissionRate.objects.all().order_by('transaction_type')
        serializer = CommissionRateSerializer(rates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateCommissionRateView(APIView):
    """
    Admin-only endpoint to update a commission rate.
    Automatically creates a history audit log entry.
    """
    permission_classes = [IsAdminRole]

    def post(self, request):
        serializer = UpdateCommissionRateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        transaction_type = serializer.validated_data['transaction_type']
        new_rate_percent = serializer.validated_data['new_rate_percent']
        
        # Update the rate using the service layer logic
        updated_rate = update_commission_rate(
            transaction_type=transaction_type, 
            new_rate_percent=new_rate_percent, 
            changed_by_account=request.user
        )
        
        # Return the newly updated rate object
        output_serializer = CommissionRateSerializer(updated_rate)
        return Response(output_serializer.data, status=status.HTTP_200_OK)


class CommissionRateHistoryView(APIView):
    """
    Admin-only endpoint to view the audit trail of commission rate changes.
    Supports optional filtering via ?transaction_type=
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        qs = CommissionRateHistory.objects.all().select_related('changed_by', 'commission_rate').order_by('-created_at')
        
        transaction_type = request.query_params.get('transaction_type')
        if transaction_type:
            qs = qs.filter(commission_rate__transaction_type=transaction_type)
            
        serializer = CommissionRateHistorySerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MySettlementsView(APIView):
    """
    Merchant-facing endpoint to view their settlement records.
    Returns records grouped by the two distinct tracks: standard (pickups/B2B) and marketplace.
    """
    permission_classes = [IsMerchantRole]

    def get(self, request):
        merchant = request.user
        
        # Fetch standard settlements
        standard_qs = SettlementRecord.objects.filter(merchant=merchant).order_by('-created_at')
        standard_data = SettlementRecordSerializer(standard_qs, many=True).data
        
        # Fetch marketplace settlements
        marketplace_qs = MarketplaceSettlementRecord.objects.filter(merchant=merchant).order_by('-created_at')
        marketplace_data = MarketplaceSettlementRecordSerializer(marketplace_qs, many=True).data
        
        return Response({
            "pickup_and_company_settlements": standard_data,
            "marketplace_settlements": marketplace_data
        }, status=status.HTTP_200_OK)
