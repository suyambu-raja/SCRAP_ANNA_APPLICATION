from rest_framework import serializers

from payments.models import PaymentTransaction

class PaymentTransactionSerializer(serializers.ModelSerializer):
    """
    Output serializer for PaymentTransaction.
    """
    class Meta:
        model = PaymentTransaction
        fields = '__all__'
        read_only_fields = [f.name for f in PaymentTransaction._meta.fields]


class CashfreeWebhookSerializer(serializers.Serializer):
    """
    Loosely typed serializer for Cashfree Webhooks.
    
    TODO: Once Cashfree's actual webhook payload schema is confirmed for production, 
    replace this raw JSONField with strict individual fields corresponding to the 
    actual expected vendor webhook body.
    """
    raw_payload = serializers.JSONField()


class CommissionOwedResponseSerializer(serializers.Serializer):
    """
    Serializer purely to document the response shape of the 'how much do I owe' endpoint.
    """
    total_owed = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
