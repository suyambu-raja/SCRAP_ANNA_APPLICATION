from rest_framework import serializers
from .models import KYCRecord


class SubmitKYCSerializer(serializers.Serializer):
    """
    Serializer for validating KYC submission input.
    """
    provider_name = serializers.CharField(max_length=100)
    document_reference = serializers.CharField(max_length=255)


class KYCRecordSerializer(serializers.ModelSerializer):
    """
    Serializer for representing a KYCRecord, read-only.
    """
    class Meta:
        model = KYCRecord
        fields = '__all__'
        read_only_fields = [
            'id', 'account', 'provider_name', 'status', 
            'document_reference', 'verified_at', 'created_at', 'updated_at'
        ]


class ProviderCallbackSerializer(serializers.Serializer):
    """
    Serializer for the KYC provider webhook/callback payload.
    """
    kyc_record_id = serializers.UUIDField()
    provider_status = serializers.ChoiceField(choices=KYCRecord.Status.choices)
    recycle_company_connection_confirmed = serializers.BooleanField(required=False, default=False)
