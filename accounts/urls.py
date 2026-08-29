from django.urls import path
from accounts.views import (
    RequestOTPView,
    VerifyOTPAndLoginView,
    RegisterAccountView,
    MyProfileView,
    PendingRegistrationsView,
    ApproveRegistrationView,
    RejectRegistrationView,
    ResubmitRegistrationView,
    CreateMerchantBranchView,
    MyBranchesView,
    DeactivateBranchView
)

app_name = 'accounts'

urlpatterns = [
    path('request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('verify-otp/', VerifyOTPAndLoginView.as_view(), name='verify-otp'),
    path('register/', RegisterAccountView.as_view(), name='register'),
    path('me/', MyProfileView.as_view(), name='my-profile'),
    path('registrations/pending/', PendingRegistrationsView.as_view(), name='pending-registrations'),
    path('registrations/<uuid:account_id>/approve/', ApproveRegistrationView.as_view(), name='approve-registration'),
    path('registrations/<uuid:account_id>/reject/', RejectRegistrationView.as_view(), name='reject-registration'),
    path('registrations/resubmit/', ResubmitRegistrationView.as_view(), name='resubmit-registration'),
    path('branches/', CreateMerchantBranchView.as_view(), name='create-branch'),
    path('branches/mine/', MyBranchesView.as_view(), name='my-branches'),
    path('branches/<uuid:branch_id>/deactivate/', DeactivateBranchView.as_view(), name='deactivate-branch'),
]
