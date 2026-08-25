from django.urls import path
from marketplace.views import (
    CreateMarketplaceListingView,
    MyMarketplaceListingsView,
    ActiveListingsView,
    PlaceOrderView,
    MyOrdersView
)

app_name = 'marketplace'

urlpatterns = [
    path('listings/', CreateMarketplaceListingView.as_view(), name='create-marketplace-listing'),
    path('listings/mine/', MyMarketplaceListingsView.as_view(), name='my-marketplace-listings'),
    path('listings/active/', ActiveListingsView.as_view(), name='active-listings'),
    path('listings/<uuid:listing_id>/order/', PlaceOrderView.as_view(), name='place-order'),
    
    path('orders/mine/', MyOrdersView.as_view(), name='my-orders'),
]
