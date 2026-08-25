import logging
from decimal import Decimal, ROUND_HALF_UP
from typing import Optional
from django.db import transaction
from django.db.models import Avg, QuerySet

from accounts.models import Account, MerchantProfile
from trust.models import ReviewRecord, MerchantPenalty

logger = logging.getLogger(__name__)

def recalculate_trust_score(merchant_account: Account) -> Decimal:
    """
    Recalculates and updates the trust_score for a merchant based on their reviews.
    
    PLACEHOLDER NOTE: This is a simple, naive scoring approach (plain average of ratings) 
    intended as a placeholder business decision, not a finalized algorithm. 
    Penalty severity is NOT currently factored into this score. This should be treated 
    as a potential future enhancement requiring business logic refinement.
    
    Args:
        merchant_account (Account): The merchant whose score to recalculate.
        
    Returns:
        Decimal: The updated trust score (or current if unchanged).
    """
    try:
        profile = merchant_account.merchant_profile
    except MerchantProfile.DoesNotExist:
        # If no profile, nothing to update. Just return 0.
        return Decimal('0.00')
        
    avg_result = ReviewRecord.objects.filter(merchant=merchant_account).aggregate(Avg('rating'))
    rating_avg = avg_result.get('rating__avg')
    
    # If there are no reviews yet, leave trust_score at its current value.
    if rating_avg is None:
        return profile.trust_score
        
    new_score = Decimal(str(rating_avg)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    profile.trust_score = new_score
    profile.save(update_fields=['trust_score'])
    
    logger.info(f"Recalculated trust score for merchant {merchant_account.phone_number}: {new_score}")
    return new_score


def create_review(merchant_account: Account, rated_by_account: Account, rating: int, comment: Optional[str] = None) -> ReviewRecord:
    """
    Creates a new private review for a merchant.
    
    Args:
        merchant_account (Account): The merchant being reviewed.
        rated_by_account (Account): The account giving the review.
        rating (int): A rating value between 1 and 5.
        comment (str, optional): An optional comment.
        
    Returns:
        ReviewRecord: The newly created review record.
        
    Raises:
        PermissionError: If merchant_account is not a MERCHANT.
        ValueError: If rating is not an integer between 1 and 5.
    """
    # Enforce asymmetric design: reviews can ONLY be written about merchants.
    if getattr(merchant_account, 'role', None) != Account.Role.MERCHANT:
        raise PermissionError("Reviews can only be written about MERCHANT accounts.")
        
    if not isinstance(rating, int) or not (1 <= rating <= 5):
        raise ValueError("Rating must be an integer between 1 and 5.")
        
    # Explicitly set is_private=True even though it's the model default
    review = ReviewRecord.objects.create(
        merchant=merchant_account,
        rated_by=rated_by_account,
        rating=rating,
        comment=comment,
        is_private=True
    )
    
    logger.info(f"Created review {review.id} for merchant {merchant_account.phone_number} by {rated_by_account.phone_number}")
    
    # Keep trust score current
    recalculate_trust_score(merchant_account)
    
    return review


def get_reviews_for_merchant(merchant_account: Account, requesting_account: Account) -> QuerySet:
    """
    Retrieves all private reviews for a merchant.
    
    Args:
        merchant_account (Account): The merchant whose reviews are being requested.
        requesting_account (Account): The account requesting the reviews.
        
    Returns:
        QuerySet: A queryset of ReviewRecord objects.
        
    Raises:
        PermissionError: If the requester is neither the merchant themselves nor an Admin.
    """
    is_self = requesting_account.id == merchant_account.id
    is_admin = getattr(requesting_account, 'role', None) == Account.Role.ADMIN
    
    if not (is_self or is_admin):
        raise PermissionError("You do not have permission to view this merchant's reviews.")
        
    return ReviewRecord.objects.filter(merchant=merchant_account)


def record_merchant_penalty(merchant_account: Account, offense_type: str) -> MerchantPenalty:
    """
    Records a penalty against a merchant based on an escalating ladder of offenses.
    
    Side-effect Note: If the penalty escalates to a BAN (3rd strike), the merchant's 
    underlying Account is deactivated (is_active = False) across the platform.
    
    Args:
        merchant_account (Account): The merchant being penalized.
        offense_type (str): The specific type of offense (e.g. "cancellation_after_arrival").
        
    Returns:
        MerchantPenalty: The newly created penalty record.
        
    Raises:
        PermissionError: If merchant_account is not a MERCHANT.
    """
    if getattr(merchant_account, 'role', None) != Account.Role.MERCHANT:
        raise PermissionError("Penalties can only be recorded against MERCHANT accounts.")
        
    with transaction.atomic():
        # Count existing offenses of the same type for this merchant
        existing_count = MerchantPenalty.objects.filter(
            merchant=merchant_account,
            offense_type=offense_type
        ).count()
        
        current_strike = existing_count + 1
        
        if current_strike == 1:
            ladder_stage = MerchantPenalty.LadderStage.WARNING
        elif current_strike == 2:
            ladder_stage = MerchantPenalty.LadderStage.SUSPENSION
        else:
            # 3rd strike or more
            ladder_stage = MerchantPenalty.LadderStage.BAN
            
        penalty = MerchantPenalty.objects.create(
            merchant=merchant_account,
            offense_type=offense_type,
            offense_count=current_strike,
            ladder_stage=ladder_stage
        )
        
        # Apply the permanent ban if reached
        if ladder_stage == MerchantPenalty.LadderStage.BAN:
            merchant_account.is_active = False
            merchant_account.save(update_fields=['is_active'])
            logger.warning(f"Merchant {merchant_account.phone_number} permanently banned due to 3rd strike on '{offense_type}'.")
        else:
            logger.info(f"Recorded {ladder_stage} for merchant {merchant_account.phone_number} (offense type: {offense_type}, count: {current_strike}).")
            
        return penalty


def get_penalty_history(merchant_account: Account, requesting_account: Account) -> QuerySet:
    """
    Retrieves the penalty history for a merchant, ordered by most recent first.
    
    Args:
        merchant_account (Account): The merchant whose history is being requested.
        requesting_account (Account): The account requesting the history.
        
    Returns:
        QuerySet: A queryset of MerchantPenalty objects.
        
    Raises:
        PermissionError: If the requester is neither the merchant themselves nor an Admin.
    """
    is_self = requesting_account.id == merchant_account.id
    is_admin = getattr(requesting_account, 'role', None) == Account.Role.ADMIN
    
    if not (is_self or is_admin):
        raise PermissionError("You do not have permission to view this merchant's penalty history.")
        
    return MerchantPenalty.objects.filter(merchant=merchant_account).order_by('-created_at')


def is_merchant_banned(merchant_account: Account) -> bool:
    """
    Checks if a merchant has any permanent ban recorded.
    
    Args:
        merchant_account (Account): The merchant to check.
        
    Returns:
        bool: True if the merchant has a BAN penalty, False otherwise.
    """
    return MerchantPenalty.objects.filter(
        merchant=merchant_account, 
        ladder_stage=MerchantPenalty.LadderStage.BAN
    ).exists()
