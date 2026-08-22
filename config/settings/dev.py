"""
Development settings.
Run with: DJANGO_SETTINGS_MODULE=config.settings.dev
"""
from decouple import Csv, config

from .base import *  # noqa: F401, F403

DEBUG = True

ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1", cast=Csv())

# Relaxed CORS for local frontend dev (React web + React Native dev server)
CORS_ALLOW_ALL_ORIGINS = True

# Local media storage (no S3 needed in dev)
DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"

# Show emails/OTPs in console instead of sending them
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"