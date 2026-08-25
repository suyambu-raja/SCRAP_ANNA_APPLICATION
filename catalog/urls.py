from django.urls import path
from catalog.views import (
    CategoryTreeView,
    SubcategoryListView,
    ActivePriceRangeView,
    SetDailyPriceRangeView
)

app_name = 'catalog'

urlpatterns = [
    path('categories/tree/', CategoryTreeView.as_view(), name='category-tree'),
    path('categories/<uuid:category_id>/subcategories/', SubcategoryListView.as_view(), name='subcategory-list'),
    path('categories/<uuid:category_id>/price-range/', ActivePriceRangeView.as_view(), name='active-price-range'),
    path('price-ranges/set/', SetDailyPriceRangeView.as_view(), name='set-price-range'),
]
