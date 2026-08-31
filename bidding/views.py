import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from common.permissions import IsCompanyRole, IsMerchantRole, IsAdminRole
from pickups.models import PickupRequest
from pickups.serializers import PickupRequestSerializer
from accounts.models import Account

from bidding.models import CompanyOffer
from bidding.serializers import (
    CreateCompanyPickupRequestSerializer,
    SubmitOfferSerializer,
    CompanyOfferSerializer,
    FinalizeCompanyBillSerializer,
    CompanyBillSerializer
)
from bidding.services import (
    create_company_pickup_request,
    get_eligible_merchants_for_offer,
    submit_offer,
    close_bidding_window,
    finalize_company_bill
)
from accounts.services import get_effective_merchant_profile
from maps.services import get_route_and_eta

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


class EligibleOfferRequestsView(APIView):
    """
    Merchant endpoint to list all open Company pickup requests they are eligible to submit an offer on.
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
            if get_eligible_merchants_for_offer(req).filter(account=request.user).exists():
                eligible_requests.append(req)
                
        serializer = PickupRequestSerializer(eligible_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubmitOfferView(APIView):
    """
    Merchant endpoint to submit or update an offer on a Company pickup request.
    """
    permission_classes = [IsMerchantRole]

    def post(self, request, pickup_request_id):
        serializer = SubmitOfferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        offer_amount = serializer.validated_data['offer_amount']
        
        offer = submit_offer(
            pickup_request_id=pickup_request_id,
            merchant_account=request.user,
            offer_amount=offer_amount
        )
        
        return Response(CompanyOfferSerializer(offer).data, status=status.HTTP_201_CREATED)


class MyOffersView(APIView):
    """
    Merchant endpoint to view all their submitted offers.
    """
    permission_classes = [IsMerchantRole]

    def get(self, request):
        offers = CompanyOffer.objects.filter(merchant=request.user).order_by('-submitted_at')
        serializer = CompanyOfferSerializer(offers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CloseBiddingWindowView(APIView):
    """
    Admin-only endpoint to manually close a bidding window and select the winning offer.
    Normally handled by an automated Celery task.
    """
    permission_classes = [IsAdminRole]

    def post(self, request, pickup_request_id):
        winning_offer = close_bidding_window(pickup_request_id=pickup_request_id)
        
        if winning_offer is None:
            return Response(
                {"detail": "No offers received. Bidding window closed and request marked as closed."}, 
                status=status.HTTP_200_OK
            )
            
        return Response(CompanyOfferSerializer(winning_offer).data, status=status.HTTP_200_OK)


class FinalizeCompanyBillView(APIView):
    """
    Merchant endpoint to finalize the Company transaction after physical collection.
    Requires submitting the actual collected weight to generate the final Bill.
    """
    permission_classes = [IsMerchantRole]

    def post(self, request, company_offer_id):
        serializer = FinalizeCompanyBillSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            company_offer = CompanyOffer.objects.get(id=company_offer_id)
        except CompanyOffer.DoesNotExist:
            raise ValueError(f"CompanyOffer {company_offer_id} not found.")
            
        if company_offer.merchant != request.user:
            raise PermissionError("You are not the merchant who owns this offer.")
            
        actual_weight_kg = serializer.validated_data['actual_weight_kg']
        
        bill = finalize_company_bill(
            company_offer=company_offer,
            actual_weight_kg=actual_weight_kg
        )
        
        return Response(CompanyBillSerializer(bill).data, status=status.HTTP_201_CREATED)


class OfferRouteView(APIView):
    """
    Merchant endpoint: returns the driving route and ETA from the merchant's
    registered profile location to the pickup address of a won CompanyOffer.

    Architecture constraint (PRD §11.2):
        On-demand "show me the route to my job" action. The route is only
        meaningful once the merchant has won the bid — a pending or losing
        offer has no committed job to navigate to.

    Ownership: only the merchant who submitted this offer may fetch its route
    (same check as FinalizeCompanyBillView).
    """
    permission_classes = [IsMerchantRole]

    def get(self, request, company_offer_id):
        try:
            offer = CompanyOffer.objects.select_related("pickup_request").get(
                id=company_offer_id
            )
        except CompanyOffer.DoesNotExist:
            raise ValueError(f"CompanyOffer {company_offer_id} not found.")

        if offer.merchant != request.user:
            raise PermissionError("You are not the merchant who owns this offer.")

        if not offer.is_winner:
            raise ValueError(
                "Route lookup is only available for winning offers. "
                "This offer has not been selected as the winner."
            )

        profile = get_effective_merchant_profile(request.user)
        result = get_route_and_eta(
            origin_lat=profile.latitude,
            origin_lng=profile.longitude,
            dest_lat=offer.pickup_request.latitude,
            dest_lng=offer.pickup_request.longitude,
        )
        return Response(result, status=status.HTTP_200_OK)
