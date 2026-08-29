from rest_framework import serializers
from decimal import Decimal

from catalog.models import ScrapCategory, DailyPriceRange

class ScrapCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the ScrapCategory model, primarily used for flat listing.
    """
    class Meta:
        model = ScrapCategory
        fields = ['id', 'name', 'unit', 'parent', 'is_active']
        read_only_fields = fields


class CategoryTreeNodeSerializer(serializers.Serializer):
    """
    Serializer purely for documenting the shape of the nested dictionary returned 
    by get_category_tree(). It validates/represents raw dicts, not model instances.
    """
    id = serializers.UUIDField()
    name = serializers.CharField()
    unit = serializers.CharField()
    # Handle the recursive structure using a MethodField for swagger documentation purposes,
    # though DRF technically allows self-referencing. For simplicity in plain serializers:
    subcategories = serializers.ListField(
        child=serializers.DictField(), 
        required=False
    )


class DailyPriceRangeSerializer(serializers.ModelSerializer):
    """
    Serializer for the DailyPriceRange model.
    """
    class Meta:
        model = DailyPriceRange
        fields = '__all__'
        read_only_fields = ['id', 'category', 'min_price', 'max_price', 'effective_date', 'set_by', 'created_at']


class SetDailyPriceRangeSerializer(serializers.Serializer):
    """
    Serializer for validating an admin's request to set a daily price range for a category.
    """
    category_id = serializers.UUIDField()
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    effective_date = serializers.DateField()

    def validate(self, data):
        min_price = data.get('min_price')
        max_price = data.get('max_price')
        
        if min_price and max_price and min_price >= max_price:
            raise serializers.ValidationError({"min_price": "min_price must be strictly less than max_price."})
            
        return data
