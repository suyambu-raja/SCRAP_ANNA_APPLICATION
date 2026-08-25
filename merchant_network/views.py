import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from common.permissions import IsVerifiedMerchant
from merchant_network.models import BulkOrder, MerchantToMerchantSale
from merchant_network.serializers import (
    CreateBulkOrderSerializer,
    BulkOrderSerializer,
    SubmitBulkOrderOfferSerializer,
    BulkOrderOfferSerializer,
    SelectOfferSerializer,
    MerchantToMerchantSaleSerializer,
    ConfirmActualWeightSerializer
)
from merchant_network.services import (
    create_bulk_order,
    get_eligible_big_merchants,
    submit_bulk_order_offer,
    get_offers_for_bulk_order,
    select_offer,
    confirm_actual_weight,
    complete_sale
)

logger = logging.getLogger(__name__)

class CreateBulkOrderView(APIView):
    """
    Small/Medium merchant endpoint to create a bulk order for sale to Big Merchants.
    Exceptions like attempting this as a Big Merchant propagate as 403 automatically.
    """
    permission_classes = [IsVerifiedMerchant]

    def post(self, request):
        serializer = CreateBulkOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        category_id = serializer.validated_data['category_id']
        estimated_quantity_kg = serializer.validated_data['estimated_quantity_kg']
        address_label = serializer.validated_data['address_label']
        latitude = serializer.validated_data['latitude']
        longitude = serializer.validated_data['longitude']
        expected_rate_per_kg = serializer.validated_data['expected_rate_per_kg']
        
        bulk_order = create_bulk_order(
            merchant_account=request.user,
            category_id=category_id,
            estimated_quantity_kg=estimated_quantity_kg,
            address_label=address_label,
            latitude=latitude,
            longitude=longitude,
            expected_rate_per_kg=expected_rate_per_kg
        )
        
        return Response(BulkOrderSerializer(bulk_order).data, status=status.HTTP_201_CREATED)


class MyBulkOrdersView(APIView):
    """
    Small/Medium merchant endpoint to list all their created bulk orders.
    """
    permission_classes = [IsVerifiedMerchant]

    def get(self, request):
        orders = BulkOrder.objects.filter(merchant=request.user).order_by('-created_at')
        serializer = BulkOrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OpenBulkOrdersForBigMerchantsView(APIView):
    """
    Big Merchant endpoint to discover open bulk orders in their eligible radius.
    """
    permission_classes = [IsVerifiedMerchant]

    def get(self, request):
        open_orders = BulkOrder.objects.filter(status=BulkOrder.Status.OPEN)
        
        eligible_orders = []
        # TODO: This checks eligibility per order iteratively via separate queries.
        # This incurs an O(N) query cost (where N is open bulk orders).
        # We should reverse this query in the future to rely on the Big Merchant's 
        # location and filter BulkOrder directly via geo-distance checks.
        for order in open_orders:
            if get_eligible_big_merchants(order).filter(account=request.user).exists():
                eligible_orders.append(order)
                
        serializer = BulkOrderSerializer(eligible_orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubmitBulkOrderOfferView(APIView):
    """
    Big Merchant endpoint to submit a price offer on a bulk order.
    """
    permission_classes = [IsVerifiedMerchant]

    def post(self, request, bulk_order_id):
        serializer = SubmitBulkOrderOfferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        offered_rate_per_kg = serializer.validated_data['offered_rate_per_kg']
        
        offer = submit_bulk_order_offer(
            bulk_order_id=bulk_order_id,
            big_merchant_account=request.user,
            offered_rate_per_kg=offered_rate_per_kg
        )
        
        return Response(BulkOrderOfferSerializer(offer).data, status=status.HTTP_201_CREATED)


class OffersForMyBulkOrderView(APIView):
    """
    Small/Medium merchant endpoint to view all offers received for their bulk order.
    """
    permission_classes = [IsVerifiedMerchant]

    def get(self, request, bulk_order_id):
        offers = get_offers_for_bulk_order(
            bulk_order_id=bulk_order_id,
            requesting_merchant_account=request.user
        )
        
        serializer = BulkOrderOfferSerializer(offers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SelectOfferView(APIView):
    """
    Small/Medium merchant endpoint to manually select a winning offer.
    """
    permission_classes = [IsVerifiedMerchant]

    def post(self, request, bulk_order_id):
        serializer = SelectOfferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        offer_id = serializer.validated_data['offer_id']
        fulfillment_method = serializer.validated_data['fulfillment_method']
        
        sale = select_offer(
            bulk_order_id=bulk_order_id,
            selecting_merchant_account=request.user,
            offer_id=offer_id,
            fulfillment_method=fulfillment_method
        )
        
        return Response(MerchantToMerchantSaleSerializer(sale).data, status=status.HTTP_201_CREATED)


class ConfirmActualWeightView(APIView):
    """
    Big Merchant (buyer) endpoint to confirm the actual physical weight received.
    """
    permission_classes = [IsVerifiedMerchant]

    def post(self, request, sale_id):
        serializer = ConfirmActualWeightSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        actual_weight_kg = serializer.validated_data['actual_weight_kg']
        
        sale = confirm_actual_weight(
            sale_id=sale_id,
            confirming_merchant_account=request.user,
            actual_weight_kg=actual_weight_kg
        )
        
        return Response(MerchantToMerchantSaleSerializer(sale).data, status=status.HTTP_200_OK)


class CompleteSaleView(APIView):
    """
    Endpoint (typically Admin or automated trigger) to mark the sale as fully completed 
    and calculate final settlement commissions.
    """
    permission_classes = [IsVerifiedMerchant]

    def post(self, request, sale_id):
        try:
            sale = MerchantToMerchantSale.objects.get(id=sale_id)
        except MerchantToMerchantSale.DoesNotExist:
            raise ValueError(f"Sale {sale_id} does not exist.")
            
        if request.user != sale.source_merchant and request.user != sale.big_merchant:
            raise PermissionError("You are not a party to this sale.")
            
        sale_result = complete_sale(sale_id=sale_id)
        
        return Response(MerchantToMerchantSaleSerializer(sale_result).data, status=status.HTTP_200_OK)
