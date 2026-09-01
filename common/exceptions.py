import logging

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Wraps DRF's default exception handler to return a consistent
    error response shape across the entire API, and logs unhandled
    exceptions instead of letting them fail silently.
    """
    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            "success": False,
            "error": {
                "detail": response.data,
                "status_code": response.status_code,
            },
        }
        return response

    # Unhandled exception (not a DRF-recognized exception) —
    # log it and return a generic 500 instead of leaking a stack trace.
    logger.exception("Unhandled exception in view: %s", exc, exc_info=exc)

    return Response(
        {
            "success": False,
            "error": {
                "detail": "An unexpected error occurred.",
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            },
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )