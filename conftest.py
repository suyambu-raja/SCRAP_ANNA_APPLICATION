"""
Root conftest.py — shared pytest fixtures for the ScrapConnect test suite.

Design philosophy
-----------------
* Fixtures that touch the DB are declared with ``pytest.fixture`` and depend on
  the built-in ``db`` fixture so pytest-django wraps every test in a
  transaction that is rolled back after the test.  Test functions that use any
  of these fixtures do NOT need to add ``@pytest.mark.django_db`` themselves —
  the transitive dependency on ``db`` handles it automatically.

* Real creation paths (``accounts.services.create_account_with_profile``) are
  used wherever they exist so that fixtures exercise the same code paths as
  production.  Where a shortcut is taken (e.g. bypassing approval or KYC
  workflows) it is documented in the fixture's docstring.

* Phone numbers use the +91 (India) prefix and a fictional 10-digit suffix
  that is unique per fixture to avoid UNIQUE constraint violations when all
  fixtures are used together in the same test.
"""

import pytest
from decimal import Decimal
from django.utils import timezone

from accounts.models import Account, RegistrationStatus
from accounts.services import create_account_with_profile
from catalog.models import ScrapCategory, DailyPriceRange
from settlements.models import CommissionRate


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_USER_PROFILE_DATA = {
    "name": "Test User",
    "address": "123 Test Street, Chennai",
    "latitude": Decimal("13.082680"),
    "longitude": Decimal("80.270718"),
    "location_type": "CITY",
}

_COMPANY_PROFILE_DATA = {
    "company_name": "Test Recyclers Pvt Ltd",
    "registration_number": "TN-REG-TEST-001",
    "address": "456 Industrial Area, Chennai",
    "latitude": Decimal("13.050000"),
    "longitude": Decimal("80.250000"),
}

_MERCHANT_PROFILE_DATA = {
    "name": "Test Merchant",
    "tier": "SMALL",
    "has_storage": False,
    "recycle_company_verified": False,
    "latitude": Decimal("13.060000"),
    "longitude": Decimal("80.260000"),
}


# ---------------------------------------------------------------------------
# Account fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def db_user_account(db):
    """
    Creates and returns a fully-valid Account + UserProfile with role=USER.

    Uses ``accounts.services.create_account_with_profile()`` so the entire
    real creation path (atomic transaction, profile creation) is exercised.

    No shortcuts taken — a plain USER account has no approval workflow.
    """
    account = create_account_with_profile(
        phone_number="+919000000001",
        role=Account.Role.USER,
        profile_data=_USER_PROFILE_DATA.copy(),
    )
    return account


@pytest.fixture
def db_company_account(db):
    """
    Creates and returns a fully-valid Account + CompanyProfile with
    role=COMPANY and registration_status=APPROVED.

    Shortcut: ``registration_status`` is set to APPROVED directly on the
    profile after creation, bypassing the admin approval workflow
    (``accounts.services.approve_registration``).  This is intentional —
    most tests need an already-approved company, not the approval flow
    itself.  Tests that specifically exercise the approval workflow should
    create their own PENDING account.
    """
    account = create_account_with_profile(
        phone_number="+919000000002",
        role=Account.Role.COMPANY,
        profile_data=_COMPANY_PROFILE_DATA.copy(),
    )
    profile = account.company_profile
    profile.registration_status = RegistrationStatus.APPROVED
    profile.save(update_fields=["registration_status", "updated_at"])
    return account


@pytest.fixture
def db_merchant_account(db):
    """
    Creates and returns a fully-valid Account + MerchantProfile with
    role=MERCHANT, registration_status=APPROVED, and is_verified=True on
    the Account.

    Shortcuts taken (both documented here to make test assumptions explicit):

    1. ``registration_status`` is forced to APPROVED on the profile directly,
       bypassing the admin approval workflow.
    2. ``is_verified`` is forced to True on the Account directly, bypassing
       the KYC verification flow (``kyc`` app).

    Tests that specifically exercise the approval or KYC flows should create
    their own account without these shortcuts.
    """
    account = create_account_with_profile(
        phone_number="+919000000003",
        role=Account.Role.MERCHANT,
        profile_data=_MERCHANT_PROFILE_DATA.copy(),
    )
    # Shortcut 1: approve registration without going through admin workflow
    profile = account.merchant_profile
    profile.registration_status = RegistrationStatus.APPROVED
    profile.save(update_fields=["registration_status", "updated_at"])

    # Shortcut 2: mark as KYC-verified without going through kyc app
    account.is_verified = True
    account.save(update_fields=["is_verified"])

    return account


@pytest.fixture
def db_verified_merchant_account(db_merchant_account):
    """
    Alias for ``db_merchant_account``.

    Both fixtures return an approved, KYC-verified merchant account.
    Use whichever name is clearest in context.  Keeping a named alias avoids
    the reader having to re-check whether ``db_merchant_account`` is already
    verified.
    """
    return db_merchant_account


@pytest.fixture
def db_admin_account(db):
    """
    Creates and returns an Account with role=ADMIN via
    ``Account.objects.create_superuser()``.

    Admin accounts are not created through ``create_account_with_profile``
    because that function explicitly rejects the ADMIN role.  The manager
    method sets ``is_staff=True``, ``is_superuser=True``, and ``role=ADMIN``
    as required.

    No profile record is created for admin accounts (AdminProfile is optional
    and not required by any of the shared fixtures below).
    """
    account = Account.objects.create_superuser(
        phone_number="+919000000099",
        password="admin-test-password",
    )
    return account


# ---------------------------------------------------------------------------
# Catalog fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def db_category(db):
    """
    Creates and returns a simple, active ScrapCategory (name="Iron", unit="kg").

    No parent category is set — this is a top-level category suitable as a
    dependency for price range and bidding fixtures.
    """
    return ScrapCategory.objects.create(
        name="Iron",
        unit="kg",
        is_active=True,
    )


@pytest.fixture
def db_price_range(db, db_category, db_admin_account):
    """
    Creates and returns a DailyPriceRange for ``db_category``.

    Values:
        min_price = 10.00
        max_price = 50.00
        effective_date = today (in IST / Django's TIME_ZONE)
        set_by = db_admin_account

    Depends on ``db_category`` and ``db_admin_account`` fixtures.
    """
    return DailyPriceRange.objects.create(
        category=db_category,
        min_price=Decimal("10.00"),
        max_price=Decimal("50.00"),
        effective_date=timezone.localdate(),
        set_by=db_admin_account,
    )


# ---------------------------------------------------------------------------
# Settlement fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def db_commission_rates(db, db_admin_account):
    """
    Creates all four CommissionRate rows expected by settlements.services.

    Rates (matching the spec):
        USER_PICKUP         → 2 %
        COMPANY_PICKUP      → 3 %
        MERCHANT_TO_MERCHANT → 3 %
        MARKETPLACE         → 2 %

    Most service-layer tests that touch billing logic will need these rows to
    exist — ``settlements.services`` functions raise ``CommissionRate.DoesNotExist``
    (or equivalent) when a rate for a given transaction type is missing.

    ``updated_by`` is set to ``db_admin_account`` to satisfy the FK
    ``limit_choices_to={"role": "ADMIN"}`` constraint on the model.
    """
    TransactionType = CommissionRate.TransactionType
    rates_spec = [
        (TransactionType.USER_PICKUP, Decimal("2.00")),
        (TransactionType.COMPANY_PICKUP, Decimal("3.00")),
        (TransactionType.MERCHANT_TO_MERCHANT, Decimal("3.00")),
        (TransactionType.MARKETPLACE, Decimal("2.00")),
    ]
    rates = []
    for tx_type, rate in rates_spec:
        obj, _ = CommissionRate.objects.get_or_create(
            transaction_type=tx_type,
            defaults={"rate_percent": rate, "updated_by": db_admin_account},
        )
        rates.append(obj)
    return rates
