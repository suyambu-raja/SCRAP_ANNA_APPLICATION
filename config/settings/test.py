"""
Test settings.
Inherits everything from dev.py (DEBUG=True, console email, local storage, etc.)
and makes only two changes needed for a fast, isolated test run:

1. PASSWORD_HASHERS — swaps BCrypt/PBKDF2 for MD5 so hashing in tests
   is ~100x faster. Never use this outside of testing.
2. CELERY_TASK_ALWAYS_EAGER — runs Celery tasks synchronously in the same
   process, so tests that trigger tasks don't need a running worker/broker.

The test database itself is created and destroyed by pytest-django; there is
no need to configure a separate DB here.
"""

from .dev import *  # noqa: F401, F403

# ------------------------------------------------------------------
# Speed: use a fast (but insecure) hasher for tests only
# ------------------------------------------------------------------
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# ------------------------------------------------------------------
# Celery: run tasks synchronously so tests don't need a broker
# ------------------------------------------------------------------
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True
