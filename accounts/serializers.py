from rest_framework import serializers
from phonenumber_field.serializerfields import PhoneNumberField

from accounts.models import Account, UserProfile, CompanyProfile, MerchantProfile, MerchantBranch

class RequestOTPSerializer(serializers.Serializer):
    """
    Serializer for requesting an OTP for login or registration.
    """
    phone_number = PhoneNumberField()


class VerifyOTPForLoginSerializer(serializers.Serializer):
    """
    Serializer for verifying an OTP for an existing account login.
    """
    phone_number = PhoneNumberField()
    otp = serializers.CharField(max_length=6)


class UserProfileDataSerializer(serializers.ModelSerializer):
    """
    Nested serializer for User role profile data.
    """
    class Meta:
        model = UserProfile
        fields = ['name', 'address', 'latitude', 'longitude', 'location_type']


class CompanyProfileDataSerializer(serializers.ModelSerializer):
    """
    Nested serializer for Company role profile data.
    """
    class Meta:
        model = CompanyProfile
        fields = ['company_name', 'registration_number', 'address', 'latitude', 'longitude', 'shop_photo_url']


class MerchantProfileDataSerializer(serializers.ModelSerializer):
    """
    Nested serializer for Merchant role profile data.
    Excludes admin/KYC-controlled fields like tier and recycle_company_verified.
    """
    class Meta:
        model = MerchantProfile
        fields = ['name', 'has_storage', 'latitude', 'longitude', 'shop_photo_url']


class RegisterAccountSerializer(serializers.Serializer):
    """
    Serializer for the two-step registration flow, combining OTP verification
    and profile data creation.
    """
    phone_number = PhoneNumberField()
    otp = serializers.CharField(max_length=6)
    role = serializers.ChoiceField(
        choices=[c for c in Account.Role.choices if c[0] != Account.Role.ADMIN],
        error_messages={'invalid_choice': "Invalid role or ADMIN role is not allowed."}
    )
    profile_data = serializers.JSONField()

    def validate_role(self, value):
        if value == Account.Role.ADMIN:
            raise serializers.ValidationError("Cannot register as ADMIN via this endpoint.")
        return value

    def validate(self, data):
        role = data.get('role')
        profile_data = data.get('profile_data')
        
        # Determine the right serializer for the selected role
        if role == Account.Role.USER:
            profile_serializer = UserProfileDataSerializer(data=profile_data)
        elif role == Account.Role.COMPANY:
            profile_serializer = CompanyProfileDataSerializer(data=profile_data)
        elif role == Account.Role.MERCHANT:
            profile_serializer = MerchantProfileDataSerializer(data=profile_data)
        else:
            raise serializers.ValidationError({"role": "Invalid or unhandled role."})
            
        # Validate the inner profile data
        if not profile_serializer.is_valid():
            raise serializers.ValidationError({"profile_data": profile_serializer.errors})
            
        # Inject the validated (and type-coerced) data back so the view can use it cleanly
        data['profile_data'] = profile_serializer.validated_data
        
        return data


class AccountOutputSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for returning account details.
    """
    class Meta:
        model = Account
        fields = ['id', 'phone_number', 'email', 'role', 'is_active', 'is_verified', 'date_joined']
        read_only_fields = fields


class TokenResponseSerializer(serializers.Serializer):
    """
    Output-only serializer to document the JWT token response shape.
    """
    access = serializers.CharField()
    refresh = serializers.CharField()

class CompanyProfileSummarySerializer(serializers.ModelSerializer):
    """
    Read-only serializer for Company Profile summary in admin view.
    """
    account = serializers.CharField(source='account.phone_number', read_only=True)

    class Meta:
        model = CompanyProfile
        fields = ['id', 'account', 'company_name', 'registration_number', 'address', 'latitude', 'longitude', 'shop_photo_url', 'registration_status', 'resubmission_count', 'rejection_reason', 'created_at']
        read_only_fields = fields

class MerchantProfileSummarySerializer(serializers.ModelSerializer):
    """
    Read-only serializer for Merchant Profile summary in admin view.
    """
    account = serializers.CharField(source='account.phone_number', read_only=True)

    class Meta:
        model = MerchantProfile
        fields = ['id', 'account', 'name', 'has_storage', 'latitude', 'longitude', 'shop_photo_url', 'registration_status', 'resubmission_count', 'rejection_reason', 'created_at']
        read_only_fields = fields

class PendingRegistrationsSerializer(serializers.Serializer):
    """
    Serializer for the dict of pending registrations.
    """
    companies = CompanyProfileSummarySerializer(many=True)
    merchants = MerchantProfileSummarySerializer(many=True)

class RejectRegistrationSerializer(serializers.Serializer):
    """
    Serializer for rejecting a registration.
    """
    reason = serializers.CharField(required=True)

class ResubmitRegistrationSerializer(serializers.Serializer):
    """
    Serializer for resubmitting a registration.
    """
    updated_profile_data = serializers.JSONField(required=True)

class CreateMerchantBranchSerializer(serializers.Serializer):
    """
    Serializer for creating a new merchant branch.
    """
    branch_phone_number = PhoneNumberField()
    branch_name = serializers.CharField(max_length=150)
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)

class MerchantBranchSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for a merchant branch.
    """
    class Meta:
        model = MerchantBranch
        fields = '__all__'
