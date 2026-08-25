import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from common.permissions import IsMerchantRole
from payments.models import PaymentTransaction
from payments.serializers import (
    PaymentTransactionSerializer,
    CashfreeWebhookSerializer,
    CommissionOwedResponseSerializer
)
from payments.services import (
    handle_cashfree_webhook,
    calculate_total_commission_owed,
    trigger_commission_autopay
)

logger = logging.getLogger(__name__)


class MyPaymentTransactionsView(APIView):
    """
    Endpoint for users and merchants to view their payment transaction history.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = PaymentTransaction.objects.filter(account=request.user).order_by('-created_at')
        serializer = PaymentTransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CashfreeWebhookView(APIView):
    """
    Public webhook receiver for Cashfree payment status updates.
    
    TODO [SECURITY CRITICAL]: In a real production system, this endpoint MUST be 
    secured via webhook signature verification (checking a secret signature header 
    sent by Cashfree). Currently, this endpoint uses AllowAny and relies on the 
    raw JSON body without cryptographic verification against spoofing. Add signature 
    validation logic BEFORE production deployment.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        # We validate just to ensure it's valid JSON for now, given the placeholder schema.
        # In the future, this serializer should strictly map to Cashfree's payload format.
        serializer = CashfreeWebhookSerializer(data={'raw_payload': request.data})
        serializer.is_valid(raise_exception=True)
        
        # We pass the raw dict directly since actual parsing happens in the service layer.
        handle_cashfree_webhook(payload=request.data)
        
        # Always return 200 OK so the webhook provider knows it was successfully received.
        return Response({"status": "received"}, status=status.HTTP_200_OK)


class MyCommissionOwedView(APIView):
    """
    Merchant endpoint to check the total unpaid commission they owe the platform.
    """
    permission_classes = [IsMerchantRole]

    def get(self, request):
        total_owed = calculate_total_commission_owed(merchant_account=request.user)
        # Not using a full output serializer here, just conforming to the simple requested dict shape
        return Response({"total_owed": total_owed}, status=status.HTTP_200_OK)


class TriggerCommissionAutopayView(APIView):
    """
    Merchant endpoint to manually trigger a payment for all currently outstanding commissions.
    """
    permission_classes = [IsMerchantRole]

    def post(self, request):
        transaction = trigger_commission_autopay(merchant_account=request.user)
        return Response(PaymentTransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)
