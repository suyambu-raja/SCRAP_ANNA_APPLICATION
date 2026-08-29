from rest_framework import serializers
from notifications.models import NotificationLog
from accounts.models import Language

class NotificationLogSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for displaying notification history.
    """
    class Meta:
        model = NotificationLog
        fields = '__all__'
        read_only_fields = [f.name for f in NotificationLog._meta.fields]

class UpdateNotificationPreferencesSerializer(serializers.Serializer):
    """
    Serializer for updating an account's notification preferences.
    """
    voice_call_enabled = serializers.BooleanField(required=False)
    language_preference = serializers.ChoiceField(choices=Language.choices, required=False)
    
    def validate(self, data):
        if 'voice_call_enabled' not in data and 'language_preference' not in data:
            raise serializers.ValidationError("At least one preference must be provided for update.")
        return data

class NotificationPreferencesOutputSerializer(serializers.Serializer):
    """
    Read-only serializer for returning updated notification preferences.
    """
    voice_call_enabled = serializers.BooleanField()
    language_preference = serializers.CharField()
