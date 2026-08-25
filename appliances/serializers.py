from rest_framework import serializers

from appliances.models import ApplianceListing, ApplianceBill

class CreateApplianceListingSerializer(serializers.Serializer):
    """
    Serializer for a User creating a new appliance listing.
    """
    item_type = serializers.CharField(max_length=100)
    condition = serializers.ChoiceField(choices=ApplianceListing.Condition.choices)
    photo_urls = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=True
    )


class ApplianceListingSerializer(serializers.ModelSerializer):
    """
    Output serializer for ApplianceListing.
    """
    class Meta:
        model = ApplianceListing
        fields = '__all__'
        read_only_fields = [f.name for f in ApplianceListing._meta.fields]


class RecordFinalPriceSerializer(serializers.Serializer):
    """
    Serializer for a merchant recording the final agreed price for a collected appliance.
    """
    agreed_price = serializers.DecimalField(max_digits=10, decimal_places=2)


class ApplianceBillSerializer(serializers.ModelSerializer):
    """
    Output serializer for ApplianceBill.
    """
    class Meta:
        model = ApplianceBill
        fields = '__all__'
        read_only_fields = [f.name for f in ApplianceBill._meta.fields]
