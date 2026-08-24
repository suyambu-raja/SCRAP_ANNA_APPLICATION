import logging
import datetime
from typing import List, Dict, Any, Optional
from decimal import Decimal

from django.utils import timezone
from django.db.models import QuerySet

from catalog.models import ScrapCategory, DailyPriceRange
from accounts.models import Account

logger = logging.getLogger(__name__)


def get_category_tree() -> List[Dict[str, Any]]:
    """
    Returns the full category tree as a nested structure.
    Each category dict includes its id, name, unit, and a "subcategories" list of its children.
    Only includes active categories.
    
    Returns:
        List[Dict[str, Any]]: The nested category tree.
    """
    # Fetch all active categories in a single query to avoid N+1 problems.
    # For an arbitrary-depth self-referencing tree, building the tree in-memory 
    # from a flat list is more efficient than cascading prefetch_related() calls.
    categories = list(ScrapCategory.objects.filter(is_active=True))
    
    # Build a quick lookup dictionary mapping category IDs to their dict representations
    cat_dict = {
        cat.id: {
            "id": cat.id,
            "name": cat.name,
            "unit": cat.unit,
            "subcategories": []
        }
        for cat in categories
    }
    
    tree = []
    
    # Populate the tree structure
    for cat in categories:
        if cat.parent_id is None:
            # Top-level category
            tree.append(cat_dict[cat.id])
        else:
            # Child category: attach it to its parent's subcategories list
            # We assume referential integrity where active children have active parents.
            if cat.parent_id in cat_dict:
                cat_dict[cat.parent_id]["subcategories"].append(cat_dict[cat.id])
                
    return tree


def get_subcategories(category_id: int) -> QuerySet:
    """
    Returns direct child ScrapCategory rows for a given parent category_id.
    Only includes active categories.
    
    Args:
        category_id (int): The ID of the parent category.
        
    Returns:
        QuerySet: A queryset of child ScrapCategory objects.
        
    Raises:
        ValueError: If the parent category_id does not exist in the database.
    """
    if not ScrapCategory.objects.filter(id=category_id).exists():
        raise ValueError(f"Category with id {category_id} does not exist.")
        
    return ScrapCategory.objects.filter(parent_id=category_id, is_active=True)


def validate_no_circular_reference(category_id: int, proposed_parent_id: Optional[int]) -> bool:
    """
    Checks if assigning a proposed_parent_id to a category would create a circular tree reference.
    Walks up the proposed parent's ancestor chain to ensure category_id does not appear.
    
    Args:
        category_id (int): The ID of the category being moved.
        proposed_parent_id (int, optional): The ID of the proposed new parent category.
        
    Returns:
        bool: True if safe to assign, False if it would create a cycle.
    """
    if proposed_parent_id is None:
        return True  # Making it a top-level category is always safe
        
    if category_id == proposed_parent_id:
        return False  # Cannot be its own parent
        
    current_parent_id = proposed_parent_id
    
    while current_parent_id is not None:
        if current_parent_id == category_id:
            return False  # Found the category in the ancestor chain
            
        try:
            parent_cat = ScrapCategory.objects.get(id=current_parent_id)
            current_parent_id = parent_cat.parent_id
        except ScrapCategory.DoesNotExist:
            # Parent doesn't exist, chain breaks
            break
            
    return True


def get_active_price_range(category_id: int, on_date: Optional[datetime.date] = None) -> DailyPriceRange:
    """
    Returns the DailyPriceRange row for this category with the most recent effective_date 
    that is <= on_date (the range currently in effect).
    
    Args:
        category_id (int): The ID of the category.
        on_date (datetime.date, optional): The date to check against. Defaults to today.
        
    Returns:
        DailyPriceRange: The active price range.
        
    Raises:
        ValueError: If no price range has ever been set for this category up to the given date.
    """
    if on_date is None:
        on_date = timezone.now().date()
        
    range_record = DailyPriceRange.objects.filter(
        category_id=category_id,
        effective_date__lte=on_date
    ).order_by('-effective_date').first()
    
    if not range_record:
        raise ValueError(
            f"Data integrity error: No price range has ever been set for category "
            f"{category_id} up to {on_date}. Cannot price scrap."
        )
        
    return range_record


def validate_price_within_range(category_id: int, entered_price: Decimal, on_date: Optional[datetime.date] = None) -> bool:
    """
    Validates if a merchant-entered price falls within the platform-set range for a category.
    
    Args:
        category_id (int): The ID of the category.
        entered_price (Decimal): The price entered by the merchant.
        on_date (datetime.date, optional): The date of the transaction. Defaults to today.
        
    Returns:
        bool: True if the price is within range, False otherwise.
        
    Raises:
        TypeError: If entered_price is not a Decimal.
    """
    if not isinstance(entered_price, Decimal):
        raise TypeError("entered_price must be a Decimal instance to prevent precision bugs.")
        
    active_range = get_active_price_range(category_id, on_date)
    
    return active_range.min_price <= entered_price <= active_range.max_price


def set_daily_price_range(
    category_id: int, 
    min_price: Decimal, 
    max_price: Decimal, 
    effective_date: datetime.date, 
    set_by_account: Account
) -> DailyPriceRange:
    """
    Sets or updates the daily price range for a category on a specific effective date.
    
    Args:
        category_id (int): The category to update.
        min_price (Decimal): The minimum allowed price.
        max_price (Decimal): The maximum allowed price.
        effective_date (datetime.date): The date this range becomes effective.
        set_by_account (Account): The admin account setting the range.
        
    Returns:
        DailyPriceRange: The created or updated price range instance.
        
    Raises:
        PermissionError: If set_by_account is not an ADMIN.
        ValueError: If min_price >= max_price.
        TypeError: If min_price or max_price are not Decimals.
    """
    if getattr(set_by_account, 'role', None) != Account.Role.ADMIN:
        raise PermissionError("Only ADMIN accounts can set daily price ranges.")
        
    if not isinstance(min_price, Decimal) or not isinstance(max_price, Decimal):
        raise TypeError("min_price and max_price must be Decimal instances.")
        
    if min_price >= max_price:
        raise ValueError("min_price must be strictly less than max_price.")
        
    category = ScrapCategory.objects.get(id=category_id)
    
    range_record, created = DailyPriceRange.objects.update_or_create(
        category=category,
        effective_date=effective_date,
        defaults={
            'min_price': min_price,
            'max_price': max_price,
            'set_by': set_by_account
        }
    )
    
    action = "Created" if created else "Updated"
    logger.info(f"{action} daily price range for category {category_id} on {effective_date}: {min_price}-{max_price}")
    
    return range_record
