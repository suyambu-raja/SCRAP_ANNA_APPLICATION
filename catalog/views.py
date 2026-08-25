import logging
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from common.permissions import IsAdminRole
from catalog.serializers import (
    ScrapCategorySerializer,
    CategoryTreeNodeSerializer,
    DailyPriceRangeSerializer,
    SetDailyPriceRangeSerializer
)
from catalog.services import (
    get_category_tree,
    get_subcategories,
    get_active_price_range,
    set_daily_price_range
)

logger = logging.getLogger(__name__)

class CategoryTreeView(APIView):
    """
    Public endpoint to view the entire active category structure as a nested tree.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        tree = get_category_tree()
        # Return the built dictionary directly without forcing it through a ModelSerializer
        return Response(tree, status=status.HTTP_200_OK)


class SubcategoryListView(APIView):
    """
    Public endpoint to list immediate subcategories for a given parent category ID.
    """
    permission_classes = [AllowAny]

    def get(self, request, category_id):
        subcategories = get_subcategories(category_id)
        serializer = ScrapCategorySerializer(subcategories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ActivePriceRangeView(APIView):
    """
    Public endpoint to fetch the active price range for a category.
    Optional query parameter ?date=YYYY-MM-DD. Defaults to today if not provided.
    """
    permission_classes = [AllowAny]

    def get(self, request, category_id):
        date_str = request.query_params.get('date')
        on_date = None
        if date_str:
            try:
                on_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                raise ValueError("Invalid date format. Use YYYY-MM-DD.")
                
        price_range = get_active_price_range(category_id=category_id, on_date=on_date)
                            
        serializer = DailyPriceRangeSerializer(price_range)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SetDailyPriceRangeView(APIView):
    """
    Admin-only endpoint to set a new daily price range for a category.
    """
    permission_classes = [IsAdminRole]

    def post(self, request):
        serializer = SetDailyPriceRangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        category_id = serializer.validated_data['category_id']
        min_price = serializer.validated_data['min_price']
        max_price = serializer.validated_data['max_price']
        effective_date = serializer.validated_data['effective_date']
        
        # Set the daily price range via service layer
        price_range = set_daily_price_range(
            category_id=category_id,
            min_price=min_price,
            max_price=max_price,
            effective_date=effective_date,
            set_by_account=request.user
        )
        
        output_serializer = DailyPriceRangeSerializer(price_range)
        return Response(output_serializer.data, status=status.HTTP_200_OK)
