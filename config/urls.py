from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/kyc/', include('kyc.urls')),
    path('api/v1/catalog/', include('catalog.urls')),
    path('api/v1/pickups/', include('pickups.urls')),
    path('api/v1/bidding/', include('bidding.urls')),
    path('api/v1/appliances/', include('appliances.urls')),
    path('api/v1/merchant-network/', include('merchant_network.urls')),
    path('api/v1/marketplace/', include('marketplace.urls')),
    path('api/v1/complaints/', include('complaints.urls')),
    path('api/v1/trust/', include('trust.urls')),
    path('api/v1/settlements/', include('settlements.urls')),
    path('api/v1/payments/', include('payments.urls')),
    path('api/v1/feature-flags/', include('feature_flags.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/notifications/', include('notifications.urls')),
]
