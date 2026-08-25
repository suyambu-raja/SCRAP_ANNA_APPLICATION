from rest_framework import serializers

from merchant_network.models import BulkOrder, BulkOrderOffer, MerchantToMerchantSale

class CreateBulkOrderSerializer(serializers.Serializer):
    """
    Serializer for creating a new BulkOrder.
    """
    category_id = serializers.UUIDField()
    estimated_quantity_kg = serializers.DecimalField(max_digits=10, decimal_places=3)
    address_label = serializers.CharField(max_length=255)
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    expected_rate_per_kg = serializers.DecimalField(max_digits=10, decimal_places=2)


class BulkOrderSerializer(serializers.ModelSerializer):
    """
    Output serializer for BulkOrder.
    """
    class Meta:
        model = BulkOrder
        fields = '__all__'
        read_only_fields = [f.name for f in BulkOrder._meta.fields]


class SubmitBulkOrderOfferSerializer(serializers.Serializer):
    """
    Serializer for a Big Merchant offering a rate on a BulkOrder.
    """
    offered_rate_per_kg = serializers.DecimalField(max_digits=10, decimal_places=2)


class BulkOrderOfferSerializer(serializers.ModelSerializer):
    """
    Output serializer for BulkOrderOffer.
    """
    class Meta:
        model = BulkOrderOffer
        fields = '__all__'
        read_only_fields = [f.name for f in BulkOrderOffer._meta.fields]


class SelectOfferSerializer(serializers.Serializer):
    """
    Serializer for a smaller merchant selecting a winning offer and fulfillment method.
    """
    offer_id = serializers.UUIDField()
    fulfillment_method = serializers.ChoiceField(choices=MerchantToMerchantSale.FulfillmentMethod.choices)


class MerchantToMerchantSaleSerializer(serializers.ModelSerializer):
    """
    Output serializer for MerchantToMerchantSale.
    """
    class Meta:
        model = MerchantToMerchantSale
        fields = '__all__'
        read_only_fields = [f.name for f in MerchantToMerchantSale._meta.fields]


class ConfirmActualWeightSerializer(serializers.Serializer):
    """
    Serializer for the buyer confirming the actual received weight.
    """
    actual_weight_kg = serializers.DecimalField(max_digits=10, decimal_places=3)
