import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from accounts.models import Account
from common.permissions import IsMerchantRole, IsAdminRole

from .serializers import (
    CreateReviewSerializer,
    ReviewRecordSerializer,
    RecordPenaltySerializer,
    MerchantPenaltySerializer,
)
from . import services

logger = logging.getLogger(__name__)


class CreateReviewView(APIView):
    """
    POST /reviews/
    Create a new review for a merchant.
    Requires authentication. Target must be a merchant (enforced by service).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CreateReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        merchant_id = serializer.validated_data['merchant_id']
        try:
            merchant_account = Account.objects.get(id=merchant_id)
        except Account.DoesNotExist:
            raise ValueError(f"Merchant with ID {merchant_id} not found.")

        result = services.create_review(
            merchant_account=merchant_account,
            rated_by_account=request.user,
            rating=serializer.validated_data['rating'],
            comment=serializer.validated_data.get('comment')
        )
        return Response(ReviewRecordSerializer(result).data, status=status.HTTP_201_CREATED)


class MyReceivedReviewsView(APIView):
    """
    GET /reviews/mine/
    Allows a merchant to view the reviews they have received.
    Requires Merchant role.
    """
    permission_classes = [IsMerchantRole]

    def get(self, request, *args, **kwargs):
        results = services.get_reviews_for_merchant(
            merchant_account=request.user,
            requesting_account=request.user
        )
        return Response(ReviewRecordSerializer(results, many=True).data, status=status.HTTP_200_OK)


class AdminViewMerchantReviewsView(APIView):
    """
    GET /reviews/merchant/<uuid:merchant_id>/
    Allows an admin to view reviews received by a specific merchant.
    Requires Admin role.
    """
    permission_classes = [IsAdminRole]

    def get(self, request, merchant_id, *args, **kwargs):
        try:
            merchant_account = Account.objects.get(id=merchant_id)
        except Account.DoesNotExist:
            raise ValueError(f"Merchant with ID {merchant_id} not found.")

        results = services.get_reviews_for_merchant(
            merchant_account=merchant_account,
            requesting_account=request.user
        )
        return Response(ReviewRecordSerializer(results, many=True).data, status=status.HTTP_200_OK)


class RecordPenaltyView(APIView):
    """
    POST /penalties/
    Allows an admin to manually record a penalty for a merchant.
    Requires Admin role.
    """
    permission_classes = [IsAdminRole]

    def post(self, request, *args, **kwargs):
        serializer = RecordPenaltySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        merchant_id = serializer.validated_data['merchant_id']
        try:
            merchant_account = Account.objects.get(id=merchant_id)
        except Account.DoesNotExist:
            raise ValueError(f"Merchant with ID {merchant_id} not found.")

        result = services.record_merchant_penalty(
            merchant_account=merchant_account,
            offense_type=serializer.validated_data['offense_type']
        )
        return Response(MerchantPenaltySerializer(result).data, status=status.HTTP_201_CREATED)


class MyPenaltyHistoryView(APIView):
    """
    GET /penalties/mine/
    Allows a merchant to view their own penalty history.
    Requires Merchant role.
    """
    permission_classes = [IsMerchantRole]

    def get(self, request, *args, **kwargs):
        results = services.get_penalty_history(
            merchant_account=request.user,
            requesting_account=request.user
        )
        return Response(MerchantPenaltySerializer(results, many=True).data, status=status.HTTP_200_OK)
