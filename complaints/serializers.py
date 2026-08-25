from rest_framework import serializers
from .models import Complaint


class CreateComplaintSerializer(serializers.Serializer):
    """
    Serializer for creating a new complaint.
    """
    complaint_type = serializers.CharField(help_text="The type/category of the complaint.")
    related_bill_id = serializers.UUIDField(required=False, allow_null=True)
    related_sale_id = serializers.UUIDField(required=False, allow_null=True)
    evidence_urls = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of URLs pointing to evidence files."
    )

    def validate(self, attrs):
        if attrs.get('related_bill_id') and attrs.get('related_sale_id'):
            raise serializers.ValidationError("Cannot provide both related_bill_id and related_sale_id.")
        return attrs


class ComplaintSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for Complaint models.
    """
    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = [f.name for f in Complaint._meta.fields]


class AutoPullTransactionDataSerializer(serializers.Serializer):
    """
    Serializer for validating query parameters when auto-pulling transaction data.
    """
    related_bill_id = serializers.UUIDField(required=False, allow_null=True)
    related_sale_id = serializers.UUIDField(required=False, allow_null=True)


class ResolveComplaintSerializer(serializers.Serializer):
    """
    Serializer for resolving a complaint.
    """
    resolution_outcome = serializers.ChoiceField(
        choices=Complaint.ResolutionOutcome.choices,
        help_text="The outcome of the resolution."
    )
    resolution_notes = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        help_text="Optional notes regarding the resolution."
    )
