from rest_framework import serializers
from .models import ReviewRecord, MerchantPenalty


class CreateReviewSerializer(serializers.Serializer):
    """
    Serializer for creating a new review for a merchant.
    """
    merchant_id = serializers.UUIDField(help_text="The UUID of the merchant being reviewed.")
    rating = serializers.IntegerField(
        min_value=1,
        max_value=5,
        help_text="Rating between 1 and 5."
    )
    comment = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        help_text="Optional comment for the review."
    )


class ReviewRecordSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for ReviewRecord models.
    """
    class Meta:
        model = ReviewRecord
        fields = '__all__'
        read_only_fields = [f.name for f in ReviewRecord._meta.fields]


class RecordPenaltySerializer(serializers.Serializer):
    """
    Serializer for recording a new penalty against a merchant.
    """
    merchant_id = serializers.UUIDField(help_text="The UUID of the merchant to penalize.")
    offense_type = serializers.CharField(help_text="The type of offense committed.")


class MerchantPenaltySerializer(serializers.ModelSerializer):
    """
    Read-only serializer for MerchantPenalty models.
    """
    class Meta:
        model = MerchantPenalty
        fields = '__all__'
        read_only_fields = [f.name for f in MerchantPenalty._meta.fields]
