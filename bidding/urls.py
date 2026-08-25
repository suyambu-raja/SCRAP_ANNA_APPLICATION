from django.urls import path
from bidding.views import (
    CreateCompanyPickupRequestView,
    MyCompanyPickupRequestsView,
    EligibleBidRequestsView,
    SubmitBidView,
    MyBidsView,
    CloseBiddingWindowView,
    FinalizeCompanyBillView
)

app_name = 'bidding'

urlpatterns = [
    path('requests/', CreateCompanyPickupRequestView.as_view(), name='create-company-pickup-request'),
    path('requests/mine/', MyCompanyPickupRequestsView.as_view(), name='my-company-pickup-requests'),
    path('requests/eligible-for-bidding/', EligibleBidRequestsView.as_view(), name='eligible-bid-requests'),
    path('requests/<uuid:pickup_request_id>/bid/', SubmitBidView.as_view(), name='submit-bid'),
    path('requests/<uuid:pickup_request_id>/close-bidding/', CloseBiddingWindowView.as_view(), name='close-bidding-window'),
    
    path('bids/mine/', MyBidsView.as_view(), name='my-bids'),
    path('bids/<uuid:company_bid_id>/finalize/', FinalizeCompanyBillView.as_view(), name='finalize-company-bill'),
]
