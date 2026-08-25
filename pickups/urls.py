from django.urls import path
from pickups.views import (
    CreatePickupRequestView,
    MyPickupRequestsView,
    MerchantLeadsView,
    AcceptLeadView,
    RecordWeightAndPriceView,
    ApplyRangeOverrideView
)

app_name = 'pickups'

urlpatterns = [
    path('requests/', CreatePickupRequestView.as_view(), name='create-pickup-request'),
    path('requests/mine/', MyPickupRequestsView.as_view(), name='my-pickup-requests'),
    path('requests/<uuid:pickup_request_id>/override-range/', ApplyRangeOverrideView.as_view(), name='apply-range-override'),
    
    path('leads/mine/', MerchantLeadsView.as_view(), name='merchant-leads'),
    path('leads/<uuid:lead_id>/accept/', AcceptLeadView.as_view(), name='accept-lead'),
    path('leads/<uuid:lead_id>/record-weight-price/', RecordWeightAndPriceView.as_view(), name='record-weight-price'),
]
