import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from common.permissions import IsAdminRole
from .models import Complaint
from .serializers import (
    CreateComplaintSerializer,
    ComplaintSerializer,
    AutoPullTransactionDataSerializer,
    ResolveComplaintSerializer,
)
from . import services

logger = logging.getLogger(__name__)


class CreateComplaintView(APIView):
    """
    POST /complaints/
    Create a new complaint.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CreateComplaintSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = services.create_complaint(
            raised_by_account=request.user,
            complaint_type=serializer.validated_data['complaint_type'],
            related_bill_id=serializer.validated_data.get('related_bill_id'),
            related_sale_id=serializer.validated_data.get('related_sale_id'),
            evidence_urls=serializer.validated_data.get('evidence_urls')
        )
        return Response(ComplaintSerializer(result).data, status=status.HTTP_201_CREATED)


class MyComplaintsView(APIView):
    """
    GET /complaints/mine/
    Allows an authenticated user to view the complaints they have raised.
    Ordered by created_at descending.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        results = Complaint.objects.filter(raised_by=request.user).order_by('-created_at')
        return Response(ComplaintSerializer(results, many=True).data, status=status.HTTP_200_OK)


class ComplaintStatusView(APIView):
    """
    GET /complaints/<uuid:complaint_id>/status/
    View a specific complaint's status.
    Only the original complainant or an Admin can view it (enforced by service).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, complaint_id, *args, **kwargs):
        result = services.get_complaint_status(
            complaint_id=complaint_id,
            requesting_account=request.user
        )
        return Response(ComplaintSerializer(result).data, status=status.HTTP_200_OK)


class AdminComplaintQueueView(APIView):
    """
    GET /complaints/admin-queue/
    Allows an Admin to view the queue of complaints.
    Optional ?status= query parameter.
    Requires Admin role.
    """
    permission_classes = [IsAdminRole]

    def get(self, request, *args, **kwargs):
        status_filter = request.query_params.get('status')
        results = services.get_admin_complaint_queue(
            admin_account=request.user,
            status_filter=status_filter
        )
        return Response(ComplaintSerializer(results, many=True).data, status=status.HTTP_200_OK)


class AutoPullTransactionDataView(APIView):
    """
    GET /complaints/auto-pull-data/
    Helper to pull transaction details before submitting a complaint.
    Read related_bill_id and related_sale_id from query params.
    Requires authentication.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = AutoPullTransactionDataSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        result_dict = services.auto_pull_transaction_data(
            related_bill_id=serializer.validated_data.get('related_bill_id'),
            related_sale_id=serializer.validated_data.get('related_sale_id')
        )
        return Response(result_dict, status=status.HTTP_200_OK)


class ResolveComplaintView(APIView):
    """
    POST /complaints/<uuid:complaint_id>/resolve/
    Allows an admin to resolve a complaint.
    Requires Admin role.
    """
    permission_classes = [IsAdminRole]

    def post(self, request, complaint_id, *args, **kwargs):
        serializer = ResolveComplaintSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = services.resolve_complaint(
            complaint_id=complaint_id,
            admin_account=request.user,
            resolution_outcome=serializer.validated_data['resolution_outcome'],
            resolution_notes=serializer.validated_data.get('resolution_notes')
        )
        return Response(ComplaintSerializer(result).data, status=status.HTTP_200_OK)
