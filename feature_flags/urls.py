from django.urls import path
from .views import CheckFlagView, ListAllFlagsView, ToggleFlagView

urlpatterns = [
    path('check/<str:flag_name>/', CheckFlagView.as_view(), name='check-flag'),
    path('toggle/', ToggleFlagView.as_view(), name='toggle-flag'),
    path('', ListAllFlagsView.as_view(), name='list-all-flags'),
]
