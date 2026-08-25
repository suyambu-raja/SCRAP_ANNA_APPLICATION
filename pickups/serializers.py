from rest_framework import serializers

from pickups.models import PickupRequest, Lead, Bill, RangeOverride

class CreatePickupRequestSerializer(serializers.Serializer):
    """
    Serializer for creating a new PickupRequest.
    """
    category_id = serializers.UUIDField()
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)


class PickupRequestSerializer(serializers.ModelSerializer):
    """
    Output serializer for PickupRequest.
    """
    class Meta:
        model = PickupRequest
        fields = '__all__'
        read_only_fields = [f.name for f in PickupRequest._meta.fields]


class LeadSerializer(serializers.ModelSerializer):
    """
    Output serializer for Lead.
    """
    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = [f.name for f in Lead._meta.fields]


class RecordWeightAndPriceSerializer(serializers.Serializer):
    """
    Serializer for recording final weight and price when collecting scrap.
    """
    weight_kg = serializers.DecimalField(max_digits=10, decimal_places=3)
    price_per_unit = serializers.DecimalField(max_digits=10, decimal_places=2)


class BillSerializer(serializers.ModelSerializer):
    """
    Output serializer for Bill.
    """
    class Meta:
        model = Bill
        fields = '__all__'
        read_only_fields = [f.name for f in Bill._meta.fields]


class ApplyRangeOverrideSerializer(serializers.Serializer):
    """
    Serializer for admins to apply a manual broadcast radius override.
    """
    new_radius_km = serializers.DecimalField(max_digits=5, decimal_places=2)


class RangeOverrideSerializer(serializers.ModelSerializer):
    """
    Output serializer for RangeOverride.
    """
    class Meta:
        model = RangeOverride
        fields = '__all__'
        read_only_fields = [f.name for f in RangeOverride._meta.fields]
