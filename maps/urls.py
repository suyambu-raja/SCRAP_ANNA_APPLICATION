from django.urls import path
from maps.views import (
    LeadRouteView,
    OfferRouteView,
    SaleRouteView,
    ListingRouteView,
)

app_name = "maps"

urlpatterns = [
    path("leads/<uuid:lead_id>/route/", LeadRouteView.as_view(), name="lead-route"),
    path("offers/<uuid:company_offer_id>/route/", OfferRouteView.as_view(), name="offer-route"),
    path("sales/<uuid:sale_id>/route/", SaleRouteView.as_view(), name="sale-route"),
    path("listings/<uuid:listing_id>/route/", ListingRouteView.as_view(), name="listing-route"),
]

