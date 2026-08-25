import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from common.permissions import IsMerchantRole
from marketplace.models import MarketplaceListing, MarketplaceSale
from marketplace.serializers import (
    CreateMarketplaceListingSerializer,
    MarketplaceListingSerializer,
    PlaceOrderSerializer,
    MarketplaceSaleSerializer
)
from marketplace.services import (
    create_marketplace_listing,
    get_active_listings,
    place_order
)

logger = logging.getLogger(__name__)

class CreateMarketplaceListingView(APIView):
    """
    Merchant endpoint to list an item on the marketplace.
    """
    permission_classes = [IsMerchantRole]

    def post(self, request):
        serializer = CreateMarketplaceListingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        item_name = serializer.validated_data['item_name']
        category = serializer.validated_data['category']
        merchant_price = serializer.validated_data['merchant_price']
        
        listing = create_marketplace_listing(
            merchant_account=request.user,
            item_name=item_name,
            category=category,
            merchant_price=merchant_price
        )
        
        return Response(MarketplaceListingSerializer(listing).data, status=status.HTTP_201_CREATED)


class MyMarketplaceListingsView(APIView):
    """
    Merchant endpoint to view their own marketplace listings.
    """
    permission_classes = [IsMerchantRole]

    def get(self, request):
        listings = MarketplaceListing.objects.filter(merchant=request.user).order_by('-created_at')
        serializer = MarketplaceListingSerializer(listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ActiveListingsView(APIView):
    """
    Public (authenticated) endpoint to browse all currently active marketplace listings.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        listings = get_active_listings()
        serializer = MarketplaceListingSerializer(listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlaceOrderView(APIView):
    """
    Public (authenticated) endpoint to purchase a marketplace listing.
    Any valid account role can buy from the marketplace.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, listing_id):
        serializer = PlaceOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        delivery_address = serializer.validated_data['delivery_address']
        
        sale = place_order(
            listing_id=listing_id,
            buyer_account=request.user,
            delivery_address=delivery_address
        )
        
        return Response(MarketplaceSaleSerializer(sale).data, status=status.HTTP_201_CREATED)


class MyOrdersView(APIView):
    """
    Public (authenticated) endpoint to view all purchases made by the current user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = MarketplaceSale.objects.filter(buyer=request.user).order_by('-purchased_at')
        serializer = MarketplaceSaleSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
