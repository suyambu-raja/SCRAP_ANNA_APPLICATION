from django.urls import path
from . import views

urlpatterns = [
    path('', views.CreateComplaintView.as_view(), name='create-complaint'),
    path('mine/', views.MyComplaintsView.as_view(), name='my-complaints'),
    path('<uuid:complaint_id>/status/', views.ComplaintStatusView.as_view(), name='complaint-status'),
    path('admin-queue/', views.AdminComplaintQueueView.as_view(), name='admin-complaint-queue'),
    path('auto-pull-data/', views.AutoPullTransactionDataView.as_view(), name='auto-pull-data'),
    path('<uuid:complaint_id>/resolve/', views.ResolveComplaintView.as_view(), name='resolve-complaint'),
]
