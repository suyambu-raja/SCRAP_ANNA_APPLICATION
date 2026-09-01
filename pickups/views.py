import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from common.permissions import IsUserRole, IsVerifiedMerchant, IsAdminRole
from pickups.models import PickupRequest, Lead
from pickups.serializers import (
    CreatePickupRequestSerializer,
    PickupRequestSerializer,
    LeadSerializer,
    RecordWeightAndPriceSerializer,
    BillSerializer,
    ApplyRangeOverrideSerializer,
    RangeOverrideSerializer
)
from pickups.services import (
    create_pickup_request,
    broadcast_lead_to_merchants,
    accept_lead,
    record_weight_and_price,
    apply_range_override
)
from accounts.services import get_effective_merchant_profile
from maps.services import get_route_and_eta

logger = logging.getLogger(__name__)

class CreatePickupRequestView(APIView):
    """
    User endpoint to create a new pickup request and instantly broadcast it to eligible merchants.
    """
    permission_classes = [IsUserRole]

    def post(self, request):
        serializer = CreatePickupRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        category_id = serializer.validated_data['category_id']
        latitude = serializer.validated_data['latitude']
        longitude = serializer.validated_data['longitude']
        
        # Create the request
        pickup_request = create_pickup_request(
            source_account=request.user,
            category_id=category_id,
            latitude=latitude,
            longitude=longitude
        )
        
        # Immediately broadcast it as a single atomic user action
        broadcast_leads = broadcast_lead_to_merchants(pickup_request)
        
        response_data = {
            "pickup_request": PickupRequestSerializer(pickup_request).data,
            "leads_broadcast_count": len(broadcast_leads)
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)


class MyPickupRequestsView(APIView):
    """
    User endpoint to view their own pickup requests history.
    """
    permission_classes = [IsUserRole]

    def get(self, request):
        requests = PickupRequest.objects.filter(source=request.user).order_by('-requested_at')
        serializer = PickupRequestSerializer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MerchantLeadsView(APIView):
    """
    Merchant endpoint to view their active (broadcasted) leads inbox.
    """
    permission_classes = [IsVerifiedMerchant]

    def get(self, request):
        leads = Lead.objects.filter(
            merchant=request.user, 
            status=Lead.Status.BROADCASTED
        ).order_by('-created_at')
        
        serializer = LeadSerializer(leads, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AcceptLeadView(APIView):
    """
    Merchant endpoint to accept a broadcasted lead.
    """
    permission_classes = [IsVerifiedMerchant]

    def post(self, request, lead_id):
        accepted_lead = accept_lead(lead_id=lead_id, merchant_account=request.user)
        serializer = LeadSerializer(accepted_lead)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecordWeightAndPriceView(APIView):
    """
    Merchant endpoint to record the final weight and unit price upon scrap collection.
    Automatically calculates commission and generates a Bill.
    """
    permission_classes = [IsVerifiedMerchant]

    def post(self, request, lead_id):
        serializer = RecordWeightAndPriceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        weight_kg = serializer.validated_data['weight_kg']
        price_per_unit = serializer.validated_data['price_per_unit']
        
        bill = record_weight_and_price(
            lead_id=lead_id,
            weight_kg=weight_kg,
            price_per_unit=price_per_unit,
            merchant_account=request.user
        )
        
        serializer_out = BillSerializer(bill)
        return Response(serializer_out.data, status=status.HTTP_201_CREATED)


class ApplyRangeOverrideView(APIView):
    """
    Admin-only endpoint to manually override the broadcast radius for a stuck pickup request.
    """
    permission_classes = [IsAdminRole]

    def post(self, request, pickup_request_id):
        serializer = ApplyRangeOverrideSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        new_radius_km = serializer.validated_data['new_radius_km']
        
        override = apply_range_override(
            pickup_request_id=pickup_request_id,
            new_radius_km=new_radius_km,
            admin_account=request.user
        )
        
        serializer_out = RangeOverrideSerializer(override)
        return Response(serializer_out.data, status=status.HTTP_201_CREATED)


class LeadRouteView(APIView):
    """
    Merchant endpoint: returns the driving route and ETA from the merchant's
    registered profile location to the pickup address of an accepted lead.

    Architecture constraint (PRD §11.2):
        On-demand "show me the route to my job" action. Must NEVER be called
        during matching or broadcast — only after the merchant has accepted.

    Ownership: only the merchant assigned to this lead may fetch its route
    (same check as AcceptLeadView).
    """
    permission_classes = [IsVerifiedMerchant]

    def get(self, request, lead_id):
        try:
            lead = Lead.objects.select_related("pickup_request").get(id=lead_id)
        except Lead.DoesNotExist:
            raise ValueError(f"Lead {lead_id} not found.")

        if lead.merchant != request.user:
            raise PermissionError("You are not the merchant assigned to this lead.")

        profile = get_effective_merchant_profile(request.user)
        result = get_route_and_eta(
            origin_lat=profile.latitude,
            origin_lng=profile.longitude,
            dest_lat=lead.pickup_request.latitude,
            dest_lng=lead.pickup_request.longitude,
        )
        return Response(result, status=status.HTTP_200_OK)
