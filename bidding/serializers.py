from rest_framework import serializers

from bidding.models import CompanyBid, CompanyBill

class CreateCompanyPickupRequestSerializer(serializers.Serializer):
    """
    Serializer for creating a new PickupRequest under the Company flow.
    """
    category_id = serializers.UUIDField()
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)


class SubmitBidSerializer(serializers.Serializer):
    """
    Serializer for a merchant submitting a bid on a Company pickup request.
    """
    bid_rate_per_kg = serializers.DecimalField(max_digits=10, decimal_places=2)


class CompanyBidSerializer(serializers.ModelSerializer):
    """
    Output serializer for CompanyBid.
    """
    class Meta:
        model = CompanyBid
        fields = '__all__'
        read_only_fields = [f.name for f in CompanyBid._meta.fields]


class FinalizeCompanyBillSerializer(serializers.Serializer):
    """
    Serializer for finalizing a CompanyBill by reporting actual weight collected.
    """
    actual_weight_kg = serializers.DecimalField(max_digits=10, decimal_places=3)


class CompanyBillSerializer(serializers.ModelSerializer):
    """
    Output serializer for CompanyBill.
    """
    class Meta:
        model = CompanyBill
        fields = '__all__'
        read_only_fields = [f.name for f in CompanyBill._meta.fields]
