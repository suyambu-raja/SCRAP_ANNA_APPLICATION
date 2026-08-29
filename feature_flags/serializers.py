from rest_framework import serializers
from .models import FeatureFlag


class FeatureFlagSerializer(serializers.ModelSerializer):
    """
    Serializer for representing a feature flag, including its current state.
    """
    class Meta:
        model = FeatureFlag
        fields = '__all__'
        read_only_fields = ['id', 'flag_name', 'is_enabled', 'toggled_by', 'created_at', 'updated_at']


class ToggleFlagSerializer(serializers.Serializer):
    """
    Serializer for validating inputs when toggling a feature flag.
    """
    flag_name = serializers.CharField(max_length=100)
    is_enabled = serializers.BooleanField()


class FlagCheckResponseSerializer(serializers.Serializer):
    """
    Serializer purely for documenting the shape of the public flag check endpoint response.
    """
    flag_name = serializers.CharField(max_length=100)
    is_enabled = serializers.BooleanField()
