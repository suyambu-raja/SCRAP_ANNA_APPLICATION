from rest_framework import serializers

from bidding.models import CompanyOffer, CompanyBill

class CreateCompanyPickupRequestSerializer(serializers.Serializer):
    """
    Serializer for creating a new PickupRequest under the Company flow.
    """
    category_id = serializers.UUIDField()
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)


class SubmitOfferSerializer(serializers.Serializer):
    """
    Serializer for a merchant submitting an offer on a Company pickup request.
    """
    offer_amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class CompanyOfferSerializer(serializers.ModelSerializer):
    """
    Output serializer for CompanyOffer.
    """
    class Meta:
        model = CompanyOffer
        fields = '__all__'
        read_only_fields = [f.name for f in CompanyOffer._meta.fields]


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
