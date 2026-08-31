import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from common.permissions import IsUserRole, IsVerifiedMerchant
from appliances.models import ApplianceListing
from appliances.serializers import (
    CreateApplianceListingSerializer,
    ApplianceListingSerializer,
    RecordFinalPriceSerializer,
    ApplianceBillSerializer
)
from appliances.services import (
    create_appliance_listing,
    get_visible_listings_for_merchant,
    accept_listing,
    record_final_price
)
from accounts.services import get_effective_merchant_profile
from maps.services import get_route_and_eta

logger = logging.getLogger(__name__)

class CreateApplianceListingView(APIView):
    """
    User endpoint to create a new appliance listing.
    """
    permission_classes = [IsUserRole]

    def post(self, request):
        serializer = CreateApplianceListingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        item_type = serializer.validated_data['item_type']
        condition = serializer.validated_data['condition']
        photo_urls = serializer.validated_data['photo_urls']
        
        listing = create_appliance_listing(
            user_account=request.user,
            item_type=item_type,
            condition=condition,
            photo_urls=photo_urls
        )
        
        return Response(ApplianceListingSerializer(listing).data, status=status.HTTP_201_CREATED)


class MyApplianceListingsView(APIView):
    """
    User endpoint to view their own appliance listings history.
    """
    permission_classes = [IsUserRole]

    def get(self, request):
        listings = ApplianceListing.objects.filter(user=request.user).order_by('-created_at')
        serializer = ApplianceListingSerializer(listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VisibleListingsForMerchantView(APIView):
    """
    Merchant endpoint to view all unassigned appliance listings visible to them.
    """
    permission_classes = [IsVerifiedMerchant]

    def get(self, request):
        listings = get_visible_listings_for_merchant(merchant_account=request.user)
        serializer = ApplianceListingSerializer(listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AcceptListingView(APIView):
    """
    Merchant endpoint to accept an unassigned appliance listing.
    Exceptions (like already accepted) are intentionally left to propagate to custom_exception_handler.
    """
    permission_classes = [IsVerifiedMerchant]

    def post(self, request, listing_id):
        listing = accept_listing(listing_id=listing_id, merchant_account=request.user)
        return Response(ApplianceListingSerializer(listing).data, status=status.HTTP_200_OK)


class RecordFinalPriceView(APIView):
    """
    Merchant endpoint to record the final agreed price for the appliance and close the transaction.
    Returns the generated ApplianceBill.
    Exceptions (like not authorized, already closed) propagate to custom_exception_handler.
    """
    permission_classes = [IsVerifiedMerchant]

    def post(self, request, listing_id):
        serializer = RecordFinalPriceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        agreed_price = serializer.validated_data['agreed_price']
        
        bill = record_final_price(
            listing_id=listing_id,
            merchant_account=request.user,
            agreed_price=agreed_price
        )
        
        return Response(ApplianceBillSerializer(bill).data, status=status.HTTP_201_CREATED)


class ListingRouteView(APIView):
    """
    Merchant endpoint: returns the driving route and ETA from the merchant's
    registered profile location to the user's registered address for an
    accepted appliance listing.

    Architecture constraint (PRD §11.2):
        On-demand "show me the route to my job" action. Only callable after
        the merchant has accepted the listing. Must NEVER be called during
        discovery or matching.

    Ownership: only the merchant who accepted this listing may fetch its route
    (same check pattern as RecordFinalPriceView via accept_listing service).

    Destination: listing.user.user_profile.latitude / longitude
        The UserProfile is a OneToOne on Account (related_name='user_profile')
        and holds the household user's registered address coordinates.
    """
    permission_classes = [IsVerifiedMerchant]

    def get(self, request, listing_id):
        try:
            listing = ApplianceListing.objects.select_related(
                "user__user_profile"
            ).get(id=listing_id)
        except ApplianceListing.DoesNotExist:
            raise ValueError(f"ApplianceListing {listing_id} not found.")

        if listing.accepted_merchant != request.user:
            raise PermissionError(
                "You are not the merchant who accepted this listing."
            )

        profile = get_effective_merchant_profile(request.user)
        user_profile = listing.user.user_profile
        result = get_route_and_eta(
            origin_lat=profile.latitude,
            origin_lng=profile.longitude,
            dest_lat=user_profile.latitude,
            dest_lng=user_profile.longitude,
        )
        return Response(result, status=status.HTTP_200_OK)
