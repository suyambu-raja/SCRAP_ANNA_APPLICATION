from rest_framework import serializers
from decimal import Decimal

from settlements.models import (
    CommissionRate, 
    CommissionRateHistory, 
    SettlementRecord, 
    MarketplaceSettlementRecord
)

class CommissionRateSerializer(serializers.ModelSerializer):
    """
    Serializer for CommissionRate. 
    Only rate_percent is realistically meant to be changed directly, 
    so we expose all fields but typically use a separate serializer for the update action itself.
    """
    class Meta:
        model = CommissionRate
        fields = '__all__'
        read_only_fields = ['id', 'transaction_type', 'updated_by', 'created_at', 'updated_at']


class UpdateCommissionRateSerializer(serializers.Serializer):
    """
    Serializer for validating an admin's request to change a commission rate.
    """
    transaction_type = serializers.ChoiceField(choices=CommissionRate.TransactionType.choices)
    new_rate_percent = serializers.DecimalField(max_digits=4, decimal_places=2)
    
    def validate_new_rate_percent(self, value):
        if not (Decimal('0.00') <= value <= Decimal('100.00')):
            raise serializers.ValidationError("Rate percent must be between 0 and 100.")
        return value


class CommissionRateHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for CommissionRateHistory. Read-only audit trail.
    """
    changed_by = serializers.CharField(source='changed_by.phone_number', read_only=True)
    transaction_type = serializers.CharField(source='commission_rate.transaction_type', read_only=True)
    
    class Meta:
        model = CommissionRateHistory
        fields = ['id', 'transaction_type', 'old_rate_percent', 'new_rate_percent', 'changed_by', 'created_at']
        read_only_fields = fields


class SettlementRecordSerializer(serializers.ModelSerializer):
    """
    Serializer for standard SettlementRecord rows (pickups, merchant-to-merchant).
    """
    class Meta:
        model = SettlementRecord
        fields = '__all__'
        read_only_fields = ['id', 'merchant', 'source_reference_id', 'gross_transacted_value', 
                           'commission_rate', 'commission_owed', 'settlement_date', 
                           'payment_status', 'created_at', 'updated_at']


class MarketplaceSettlementRecordSerializer(serializers.ModelSerializer):
    """
    Serializer for MarketplaceSettlementRecord rows.
    """
    class Meta:
        model = MarketplaceSettlementRecord
        fields = '__all__'
        read_only_fields = ['id', 'merchant', 'source_reference_id', 'commission_owed', 
                           'settlement_date', 'payment_status', 'created_at', 'updated_at']
