import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from common.permissions import IsAdminRole, IsMerchantRole
from django.forms.models import model_to_dict

from accounts.models import Account
from accounts.serializers import (
    RequestOTPSerializer,
    VerifyOTPForLoginSerializer,
    RegisterAccountSerializer,
    AccountOutputSerializer,
    CompanyProfileSummarySerializer,
    MerchantProfileSummarySerializer,
    PendingRegistrationsSerializer,
    RejectRegistrationSerializer,
    ResubmitRegistrationSerializer,
    CreateMerchantBranchSerializer,
    MerchantBranchSerializer
)
from accounts.services import (
    generate_otp,
    verify_otp,
    create_account_with_profile,
    issue_tokens_for_account,
    get_profile_for_account,
    get_pending_registrations,
    approve_registration,
    reject_registration,
    resubmit_registration,
    create_merchant_branch,
    get_branches_for_merchant,
    deactivate_branch
)

logger = logging.getLogger(__name__)

class RequestOTPView(APIView):
    """
    Step 1 of the auth flow. Requests an OTP for a given phone number.
    This does NOT return the OTP in the response body.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        
        # Generates and "sends" the OTP (SMS sending is a placeholder in services.py)
        generate_otp(phone_number)
        
        return Response(
            {"detail": "OTP sent successfully."}, 
            status=status.HTTP_200_OK
        )


class VerifyOTPAndLoginView(APIView):
    """
    Login endpoint for EXISTING accounts. Verifies the OTP and returns JWT tokens.
    Will reject the request if the account does not exist.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPForLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        otp = serializer.validated_data['otp']
        
        # Verify the OTP first
        if not verify_otp(phone_number, otp):
            raise ValueError("Invalid or expired OTP.")
            
        # Ensure account exists since this is login, not registration
        try:
            account = Account.objects.get(phone_number=phone_number)
        except Account.DoesNotExist:
            raise ValueError("Account not found. Please register first.")
            
        # Issue tokens
        tokens = issue_tokens_for_account(account)
        
        # Prepare response
        account_data = AccountOutputSerializer(account).data
        response_data = {
            "tokens": tokens,
            "account": account_data
        }
        
        logger.info(f"User {phone_number} logged in successfully.")
        return Response(response_data, status=status.HTTP_200_OK)


class RegisterAccountView(APIView):
    """
    Step 2 of the registration flow. Verifies the OTP and creates the account
    along with its role-specific profile data.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        otp = serializer.validated_data['otp']
        role = serializer.validated_data['role']
        profile_data = serializer.validated_data['profile_data']
        
        # Verify the OTP
        if not verify_otp(phone_number, otp):
            raise ValueError("Invalid or expired OTP.")
            
        # Create account and profile atomically
        account = create_account_with_profile(phone_number, role, profile_data)
        
        # Issue tokens for auto-login after registration
        tokens = issue_tokens_for_account(account)
        
        # Prepare response
        account_data = AccountOutputSerializer(account).data
        response_data = {
            "tokens": tokens,
            "account": account_data
        }
        
        logger.info(f"New account {phone_number} registered with role {role}.")
        return Response(response_data, status=status.HTTP_201_CREATED)


class MyProfileView(APIView):
    """
    Retrieves the role-specific profile data for the authenticated account.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        account = request.user
        profile = get_profile_for_account(account)
        
        # The profile object differs by role (UserProfile, CompanyProfile, etc).
        # We can dynamically serialize its fields directly. We explicitly exclude the 
        # internal 'account' ForeignKey and the auto-generated 'id' to keep the payload clean.
        if profile:
            profile_data = model_to_dict(profile, exclude=['account', 'id'])
            
            # Note: Decimal fields may not be JSON serializable out of the box via model_to_dict, 
            # so we explicitly stringify them.
            for key, value in profile_data.items():
                if hasattr(value, 'quantize'):  # simple duck-type check for Decimal
                    profile_data[key] = str(value)
                    
            return Response(profile_data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)


class PendingRegistrationsView(APIView):
    """
    Retrieves all pending registrations (companies and merchants).
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        result = get_pending_registrations(admin_account=request.user)
        return Response(PendingRegistrationsSerializer(result).data, status=status.HTTP_200_OK)


class ApproveRegistrationView(APIView):
    """
    Approves a pending registration.
    """
    permission_classes = [IsAdminRole]

    def post(self, request, account_id):
        try:
            account = Account.objects.get(id=account_id)
        except Account.DoesNotExist:
            raise ValueError("Account not found.")
            
        result = approve_registration(account=account, admin_account=request.user)
        return Response({
            "detail": "Registration approved.", 
            "registration_status": result.registration_status
        }, status=status.HTTP_200_OK)


class RejectRegistrationView(APIView):
    """
    Rejects a pending registration with a reason.
    """
    permission_classes = [IsAdminRole]

    def post(self, request, account_id):
        serializer = RejectRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            account = Account.objects.get(id=account_id)
        except Account.DoesNotExist:
            raise ValueError("Account not found.")
            
        result = reject_registration(
            account=account, 
            admin_account=request.user, 
            reason=serializer.validated_data['reason']
        )
        return Response({
            "detail": "Registration rejected.", 
            "registration_status": result.registration_status, 
            "resubmission_count": result.resubmission_count
        }, status=status.HTTP_200_OK)


class ResubmitRegistrationView(APIView):
    """
    Resubmits a rejected registration with updated profile data.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ResubmitRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        result = resubmit_registration(
            account=request.user, 
            updated_profile_data=serializer.validated_data['updated_profile_data']
        )
        return Response({
            "detail": "Registration resubmitted.", 
            "registration_status": result.registration_status
        }, status=status.HTTP_200_OK)


class CreateMerchantBranchView(APIView):
    """
    Creates a new merchant branch.
    """
    permission_classes = [IsMerchantRole]

    def post(self, request):
        serializer = CreateMerchantBranchSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        result = create_merchant_branch(
            parent_merchant_account=request.user,
            branch_phone_number=serializer.validated_data['branch_phone_number'],
            branch_name=serializer.validated_data['branch_name'],
            latitude=serializer.validated_data['latitude'],
            longitude=serializer.validated_data['longitude']
        )
        return Response(MerchantBranchSerializer(result).data, status=status.HTTP_201_CREATED)


class MyBranchesView(APIView):
    """
    Retrieves all branches for the authenticated merchant.
    """
    permission_classes = [IsMerchantRole]

    def get(self, request):
        result = get_branches_for_merchant(parent_merchant_account=request.user)
        return Response(MerchantBranchSerializer(result, many=True).data, status=status.HTTP_200_OK)


class DeactivateBranchView(APIView):
    """
    Deactivates a specific merchant branch.
    """
    permission_classes = [IsMerchantRole]

    def post(self, request, branch_id):
        result = deactivate_branch(branch_id=branch_id, parent_merchant_account=request.user)
        return Response(MerchantBranchSerializer(result).data, status=status.HTTP_200_OK)

