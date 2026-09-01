from django.urls import path
from merchant_network.views import (
    CreateBulkOrderView,
    MyBulkOrdersView,
    OpenBulkOrdersForBigMerchantsView,
    SubmitBulkOrderOfferView,
    OffersForMyBulkOrderView,
    SelectOfferView,
    ConfirmActualWeightView,
    CompleteSaleView,
    SaleRouteView,
)

app_name = 'merchant_network'

urlpatterns = [
    path('bulk-orders/', CreateBulkOrderView.as_view(), name='create-bulk-order'),
    path('bulk-orders/mine/', MyBulkOrdersView.as_view(), name='my-bulk-orders'),
    path('bulk-orders/open/', OpenBulkOrdersForBigMerchantsView.as_view(), name='open-bulk-orders'),
    
    path('bulk-orders/<uuid:bulk_order_id>/offers/', SubmitBulkOrderOfferView.as_view(), name='submit-bulk-order-offer'),
    
    # Mapped GET list view to a distinct path (/offers/list/) to avoid 
    # shadowing the POST view above, since they are separate DRF APIView classes.
    path('bulk-orders/<uuid:bulk_order_id>/offers/list/', OffersForMyBulkOrderView.as_view(), name='list-bulk-order-offers'),
    
    path('bulk-orders/<uuid:bulk_order_id>/select-offer/', SelectOfferView.as_view(), name='select-offer'),
    
    path('sales/<uuid:sale_id>/confirm-weight/', ConfirmActualWeightView.as_view(), name='confirm-weight'),
    path('sales/<uuid:sale_id>/complete/', CompleteSaleView.as_view(), name='complete-sale'),
    path('sales/<uuid:sale_id>/route/', SaleRouteView.as_view(), name='sale-route'),
]
