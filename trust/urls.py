from django.urls import path
from . import views

urlpatterns = [
    path('reviews/', views.CreateReviewView.as_view(), name='create-review'),
    path('reviews/mine/', views.MyReceivedReviewsView.as_view(), name='my-received-reviews'),
    path('reviews/merchant/<uuid:merchant_id>/', views.AdminViewMerchantReviewsView.as_view(), name='admin-view-merchant-reviews'),
    path('penalties/', views.RecordPenaltyView.as_view(), name='record-penalty'),
    path('penalties/mine/', views.MyPenaltyHistoryView.as_view(), name='my-penalty-history'),
]
