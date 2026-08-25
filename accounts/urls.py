from django.urls import path
from accounts.views import (
    RequestOTPView,
    VerifyOTPAndLoginView,
    RegisterAccountView,
    MyProfileView
)

app_name = 'accounts'

urlpatterns = [
    path('request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('verify-otp/', VerifyOTPAndLoginView.as_view(), name='verify-otp'),
    path('register/', RegisterAccountView.as_view(), name='register'),
    path('me/', MyProfileView.as_view(), name='my-profile'),
]
