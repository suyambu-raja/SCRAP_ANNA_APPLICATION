import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from common.permissions import IsCompanyRole, IsMerchantRole, IsAdminRole
from pickups.models import PickupRequest
from pickups.serializers import PickupRequestSerializer
from accounts.models import Account

from bidding.models import CompanyBid
from bidding.serializers import (
    CreateCompanyPickupRequestSerializer,
    SubmitBidSerializer,
    CompanyBidSerializer,
    FinalizeCompanyBillSerializer,
    CompanyBillSerializer
)
from bidding.services import (
    create_company_pickup_request,
    get_eligible_merchants_for_bid,
    submit_bid,
    close_bidding_window,
    finalize_company_bill
)

logger = logging.getLogger(__name__)

class CreateCompanyPickupRequestView(APIView):
    """
    Company endpoint to create a new pickup request that opens for merchant bidding.
    """
    permission_classes = [IsCompanyRole]

    def post(self, request):
        serializer = CreateCompanyPickupRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        category_id = serializer.validated_data['category_id']
        latitude = serializer.validated_data['latitude']
        longitude = serializer.validated_data['longitude']
        
        pickup_request = create_company_pickup_request(
            company_account=request.user,
            category_id=category_id,
            latitude=latitude,
            longitude=longitude
        )
        
        return Response(PickupRequestSerializer(pickup_request).data, status=status.HTTP_201_CREATED)


class MyCompanyPickupRequestsView(APIView):
    """
    Company endpoint to view their own pickup requests.
    """
    permission_classes = [IsCompanyRole]

    def get(self, request):
        requests = PickupRequest.objects.filter(source=request.user).order_by('-requested_at')
        serializer = PickupRequestSerializer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EligibleBidRequestsView(APIView):
    """
    Merchant endpoint to list all open Company pickup requests they are eligible to bid on.
    """
    permission_classes = [IsMerchantRole]

    def get(self, request):
        # Fetch all open company requests
        open_requests = PickupRequest.objects.filter(
            source__role=Account.Role.COMPANY,
            status=PickupRequest.Status.PENDING
        )
        
        eligible_requests = []
        # TODO: This iterates through all open requests and performs a DB query for each to check eligibility.
        # This is currently O(N) queries where N is the number of open company requests. 
        # Consider optimizing this by reversing the query (e.g. using distance filters directly on PickupRequest) 
        # as the platform scales.
        for req in open_requests:
            if get_eligible_merchants_for_bid(req).filter(account=request.user).exists():
                eligible_requests.append(req)
                
        serializer = PickupRequestSerializer(eligible_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubmitBidView(APIView):
    """
    Merchant endpoint to submit or update a bid on a Company pickup request.
    """
    permission_classes = [IsMerchantRole]

    def post(self, request, pickup_request_id):
        serializer = SubmitBidSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        bid_rate_per_kg = serializer.validated_data['bid_rate_per_kg']
        
        bid = submit_bid(
            pickup_request_id=pickup_request_id,
            merchant_account=request.user,
            bid_rate_per_kg=bid_rate_per_kg
        )
        
        return Response(CompanyBidSerializer(bid).data, status=status.HTTP_201_CREATED)


class MyBidsView(APIView):
    """
    Merchant endpoint to view all their submitted bids.
    """
    permission_classes = [IsMerchantRole]

    def get(self, request):
        bids = CompanyBid.objects.filter(merchant=request.user).order_by('-submitted_at')
        serializer = CompanyBidSerializer(bids, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CloseBiddingWindowView(APIView):
    """
    Admin-only endpoint to manually close a bidding window and select the winning bid.
    Normally handled by an automated Celery task.
    """
    permission_classes = [IsAdminRole]

    def post(self, request, pickup_request_id):
        winning_bid = close_bidding_window(pickup_request_id=pickup_request_id)
        
        if winning_bid is None:
            return Response(
                {"detail": "No bids received. Bidding window closed and request marked as closed."}, 
                status=status.HTTP_200_OK
            )
            
        return Response(CompanyBidSerializer(winning_bid).data, status=status.HTTP_200_OK)


class FinalizeCompanyBillView(APIView):
    """
    Merchant endpoint to finalize the Company transaction after physical collection.
    Requires submitting the actual collected weight to generate the final Bill.
    """
    permission_classes = [IsMerchantRole]

    def post(self, request, company_bid_id):
        serializer = FinalizeCompanyBillSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            company_bid = CompanyBid.objects.get(id=company_bid_id)
        except CompanyBid.DoesNotExist:
            return Response({"detail": "CompanyBid not found."}, status=status.HTTP_404_NOT_FOUND)
            
        if company_bid.merchant != request.user:
            raise PermissionError("You are not the merchant who owns this bid.")
            
        actual_weight_kg = serializer.validated_data['actual_weight_kg']
        
        bill = finalize_company_bill(
            company_bid=company_bid,
            actual_weight_kg=actual_weight_kg
        )
        
        return Response(CompanyBillSerializer(bill).data, status=status.HTTP_201_CREATED)
