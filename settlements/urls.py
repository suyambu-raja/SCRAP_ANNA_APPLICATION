from django.urls import path
from settlements.views import (
    CommissionRateListView,
    UpdateCommissionRateView,
    CommissionRateHistoryView,
    MySettlementsView
)

app_name = 'settlements'

urlpatterns = [
    path('commission-rates/', CommissionRateListView.as_view(), name='commission-rates-list'),
    path('commission-rates/update/', UpdateCommissionRateView.as_view(), name='commission-rates-update'),
    path('commission-rates/history/', CommissionRateHistoryView.as_view(), name='commission-rates-history'),
    path('my-settlements/', MySettlementsView.as_view(), name='my-settlements'),
]
