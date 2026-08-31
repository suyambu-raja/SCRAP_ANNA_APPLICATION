from django.urls import path
from appliances.views import (
    CreateApplianceListingView,
    MyApplianceListingsView,
    VisibleListingsForMerchantView,
    AcceptListingView,
    RecordFinalPriceView,
    ListingRouteView,
)

app_name = 'appliances'

urlpatterns = [
    path('listings/', CreateApplianceListingView.as_view(), name='create-appliance-listing'),
    path('listings/mine/', MyApplianceListingsView.as_view(), name='my-appliance-listings'),
    path('listings/visible/', VisibleListingsForMerchantView.as_view(), name='visible-listings'),
    path('listings/<uuid:listing_id>/accept/', AcceptListingView.as_view(), name='accept-listing'),
    path('listings/<uuid:listing_id>/record-price/', RecordFinalPriceView.as_view(), name='record-final-price'),
    path('listings/<uuid:listing_id>/route/', ListingRouteView.as_view(), name='listing-route'),
]
