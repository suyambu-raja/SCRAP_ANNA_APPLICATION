from django.urls import path
from .views import SubmitKYCView, MyKYCStatusView, AdminProviderCallbackView

urlpatterns = [
    path('submit/', SubmitKYCView.as_view(), name='kyc-submit'),
    path('status/mine/', MyKYCStatusView.as_view(), name='kyc-status-mine'),
    path('admin/provider-callback/', AdminProviderCallbackView.as_view(), name='kyc-admin-provider-callback'),
]
