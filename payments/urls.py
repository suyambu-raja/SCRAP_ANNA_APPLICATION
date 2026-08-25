from django.urls import path
from payments.views import (
    MyPaymentTransactionsView,
    CashfreeWebhookView,
    MyCommissionOwedView,
    TriggerCommissionAutopayView
)

app_name = 'payments'

urlpatterns = [
    path('transactions/mine/', MyPaymentTransactionsView.as_view(), name='my-payment-transactions'),
    
    # Public webhook receiver
    path('webhooks/cashfree/', CashfreeWebhookView.as_view(), name='cashfree-webhook'),
    
    path('commission-owed/mine/', MyCommissionOwedView.as_view(), name='my-commission-owed'),
    path('commission-owed/autopay/', TriggerCommissionAutopayView.as_view(), name='trigger-commission-autopay'),
]
