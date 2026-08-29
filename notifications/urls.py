from django.urls import path
from notifications.views import (
    MyNotificationHistoryView,
    AdminViewAccountNotificationHistoryView,
    MyNotificationPreferencesView
)

app_name = 'notifications'

urlpatterns = [
    path('history/mine/', MyNotificationHistoryView.as_view(), name='my-notification-history'),
    path('history/<uuid:account_id>/', AdminViewAccountNotificationHistoryView.as_view(), name='admin-view-notification-history'),
    path('preferences/mine/', MyNotificationPreferencesView.as_view(), name='my-notification-preferences'),
]