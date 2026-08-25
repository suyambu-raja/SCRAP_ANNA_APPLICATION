from rest_framework import serializers

from marketplace.models import MarketplaceListing, MarketplaceSale

class CreateMarketplaceListingSerializer(serializers.Serializer):
    """
    Serializer for a merchant creating a new marketplace listing.
    """
    item_name = serializers.CharField(max_length=200)
    category = serializers.CharField(max_length=100)
    merchant_price = serializers.DecimalField(max_digits=10, decimal_places=2)


class MarketplaceListingSerializer(serializers.ModelSerializer):
    """
    Output serializer for MarketplaceListing.
    """
    class Meta:
        model = MarketplaceListing
        fields = '__all__'
        read_only_fields = [f.name for f in MarketplaceListing._meta.fields]


class PlaceOrderSerializer(serializers.Serializer):
    """
    Serializer for a buyer placing an order for a marketplace listing.
    """
    delivery_address = serializers.CharField()


class MarketplaceSaleSerializer(serializers.ModelSerializer):
    """
    Output serializer for MarketplaceSale.
    """
    class Meta:
        model = MarketplaceSale
        fields = '__all__'
        read_only_fields = [f.name for f in MarketplaceSale._meta.fields]
