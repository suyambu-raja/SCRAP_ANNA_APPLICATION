\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\import logging
import uuid
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.services import get_effective_merchant_profile
from appliances.models import ApplianceListing
from bidding.models import CompanyOffer
from common.permissions import IsMerchantRole, IsVerifiedMerchant
from maps.services import get_route_and_eta
from merchant_network.models import MerchantToMerchantSale
from pickups.models import Lead

logger = logging.getLogger(__name__)


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

    def get(self, request: Request, lead_id: uuid.UUID) -> Response:
        """
        Fetch driving route and ETA to a lead's pickup location.

        Args:
            request (Request): DRF request object containing authenticated merchant user.
            lead_id (uuid.UUID): Primary key of the Lead.

        Returns:
            Response: 200 OK with distance_km, duration_minutes, and raw_response.

        Raises:
            ValueError: If Lead does not exist.
            PermissionError: If requesting merchant is not assigned to this lead.
        """
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

    def get(self, request: Request, company_offer_id: uuid.UUID) -> Response:
        """
        Fetch driving route and ETA to a company offer's pickup location.

        Args:
            request (Request): DRF request object containing authenticated merchant user.
            company_offer_id (uuid.UUID): Primary key of the CompanyOffer.

        Returns:
            Response: 200 OK with distance_km, duration_minutes, and raw_response.

        Raises:
            ValueError: If CompanyOffer does not exist or has not won.
            PermissionError: If requesting merchant does not own this offer.
        """
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


class SaleRouteView(APIView):
    """
    Merchant endpoint: returns the driving route and ETA for a PICKUP-fulfillment
    merchant-to-merchant sale.

    The Big Merchant is the one travelling to collect the scrap, so:
        - Origin  = Big Merchant's registered profile location
        - Destination = Source Merchant's registered profile location

    For DELIVERY fulfillment the source merchant brings the scrap to the big
    merchant — no route lookup is needed by the big merchant, so this endpoint
    raises a clear error for that case rather than returning a misleading result.

    Architecture constraint (PRD §11.2):
        On-demand "show me the route to my job" action, only callable after a
        sale has been created (i.e. an offer has been selected). Must NEVER be
        called during matching or offer evaluation.

    Ownership: either party to the sale may fetch the route
    (same check as CompleteSaleView).
    """

    permission_classes = [IsVerifiedMerchant]

    def get(self, request: Request, sale_id: uuid.UUID) -> Response:
        """
        Fetch driving route and ETA between merchants for a M2M sale.

        Args:
            request (Request): DRF request object containing authenticated merchant user.
            sale_id (uuid.UUID): Primary key of the MerchantToMerchantSale.

        Returns:
            Response: 200 OK with distance_km, duration_minutes, and raw_response.

        Raises:
            ValueError: If Sale does not exist or fulfillment method is not PICKUP.
            PermissionError: If requesting user is not party to the sale.
        """
        try:
            sale = MerchantToMerchantSale.objects.select_related(
                "source_merchant", "big_merchant"
            ).get(id=sale_id)
        except MerchantToMerchantSale.DoesNotExist:
            raise ValueError(f"Sale {sale_id} does not exist.")

        if request.user != sale.source_merchant and request.user != sale.big_merchant:
            raise PermissionError("You are not a party to this sale.")

        if sale.fulfillment_method != MerchantToMerchantSale.FulfillmentMethod.PICKUP:
            raise ValueError(
                "Route lookup only applies to PICKUP fulfillment. "
                "For DELIVERY fulfillment the source merchant brings the scrap — "
                "no outbound route is needed by the big merchant."
            )

        big_merchant_profile = get_effective_merchant_profile(sale.big_merchant)
        source_merchant_profile = get_effective_merchant_profile(sale.source_merchant)

        result = get_route_and_eta(
            origin_lat=big_merchant_profile.latitude,
            origin_lng=big_merchant_profile.longitude,
            dest_lat=source_merchant_profile.latitude,
            dest_lng=source_merchant_profile.longitude,
        )
        return Response(result, status=status.HTTP_200_OK)


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

    def get(self, request: Request, listing_id: uuid.UUID) -> Response:
        """
        Fetch driving route and ETA to a user's address for an accepted appliance listing.

        Args:
            request (Request): DRF request object containing authenticated merchant user.
            listing_id (uuid.UUID): Primary key of the ApplianceListing.

        Returns:
            Response: 200 OK with distance_km, duration_minutes, and raw_response.

        Raises:
            ValueError: If ApplianceListing does not exist.
            PermissionError: If requesting merchant did not accept this listing.
        """
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
