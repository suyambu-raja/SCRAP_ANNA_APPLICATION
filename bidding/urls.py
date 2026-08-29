from django.urls import path
from bidding.views import (
    CreateCompanyPickupRequestView,
    MyCompanyPickupRequestsView,
    EligibleOfferRequestsView,
    SubmitOfferView,
    MyOffersView,
    CloseBiddingWindowView,
    FinalizeCompanyBillView
)

app_name = 'bidding'

urlpatterns = [
    path('requests/', CreateCompanyPickupRequestView.as_view(), name='create-company-pickup-request'),
    path('requests/mine/', MyCompanyPickupRequestsView.as_view(), name='my-company-pickup-requests'),
    path('requests/eligible-for-offers/', EligibleOfferRequestsView.as_view(), name='eligible-offer-requests'),
    path('requests/<uuid:pickup_request_id>/offer/', SubmitOfferView.as_view(), name='submit-offer'),
    path('requests/<uuid:pickup_request_id>/close-bidding/', CloseBiddingWindowView.as_view(), name='close-bidding-window'),
    
    path('offers/mine/', MyOffersView.as_view(), name='my-offers'),
    path('offers/<uuid:company_offer_id>/finalize/', FinalizeCompanyBillView.as_view(), name='finalize-company-bill'),
]
