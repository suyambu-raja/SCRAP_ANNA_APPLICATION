"""
maps/services.py — Google Routes API integration.

Unlike other vendor integrations in this project (Cashfree, KYC, Voice Call),
where the vendor is still undecided and the code is a placeholder pattern, this
module is real, production-ready integration code verified against Google's
Routes API v2 documentation. The only guard is the API key check: the HTTP
request shape, field mask, and response parsing are all current and correct.

Architecture constraint (PRD §11.2):
    Functions in this module MUST only be called after a merchant has already
    accepted a lead/offer (i.e., from a "show me the route to my job" action).
    They MUST NEVER be called during merchant matching, broadcast, or
    eligibility checking — that would invoke a paid external API call for
    every candidate merchant on every incoming pickup request.
"""

import logging
from decimal import Decimal

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

# ------------------------------------------------------------------
# Google Routes API v2
# ------------------------------------------------------------------
_ROUTES_API_URL = "https://routes.googleapis.com/directions/v2:computeRoutes"
_REQUEST_TIMEOUT_SECONDS = 10


def get_route_and_eta(
    origin_lat: Decimal,
    origin_lng: Decimal,
    dest_lat: Decimal,
    dest_lng: Decimal,
) -> dict:
    """
    Fetch driving distance and ETA between two coordinates using the Google
    Routes API v2 (POST /directions/v2:computeRoutes).

    This is real, current Google Routes API integration — not a placeholder.
    The request shape, headers, and field mask are verified against official
    Google Maps Platform documentation. It is gated only by whether a real
    GOOGLE_MAPS_API_KEY has been configured in settings.

    IMPORTANT — call-site constraint (PRD §11.2):
        Only call this function after a merchant has accepted a job, to show
        them the route to the pickup location. Never call it during matching,
        broadcast, or eligibility evaluation.

    Args:
        origin_lat:  Latitude of the starting point (e.g. merchant location).
        origin_lng:  Longitude of the starting point.
        dest_lat:    Latitude of the destination (e.g. pickup address).
        dest_lng:    Longitude of the destination.

    Returns:
        A dict with the following keys:
            - ``distance_km``      (float): Road distance, rounded to 1 d.p.
            - ``duration_minutes`` (int):   Driving time, rounded to nearest minute.
            - ``raw_response``     (dict):  Full parsed JSON from the API, for
                                            debugging or future field extraction.

    Raises:
        ValueError: If GOOGLE_MAPS_API_KEY is not configured, if the API
                    returns no routes for the given coordinates, or if the
                    HTTP request itself fails.
    """
    # ------------------------------------------------------------------
    # Guard: key must be configured before we attempt any network call.
    # ------------------------------------------------------------------
    api_key: str = getattr(settings, "GOOGLE_MAPS_API_KEY", "")
    if not api_key:
        raise ValueError(
            "Google Maps integration is not yet configured. "
            "Set GOOGLE_MAPS_API_KEY in your .env file to enable route lookups."
        )

    # ------------------------------------------------------------------
    # Build request
    # ------------------------------------------------------------------
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        # Request only the fields we need — keeps response small and avoids
        # being billed for fields we don't use.
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
    }

    payload = {
        "origin": {
            "location": {
                "latLng": {
                    "latitude": float(origin_lat),
                    "longitude": float(origin_lng),
                }
            }
        },
        "destination": {
            "location": {
                "latLng": {
                    "latitude": float(dest_lat),
                    "longitude": float(dest_lng),
                }
            }
        },
        "travelMode": "DRIVE",
    }

    # ------------------------------------------------------------------
    # Execute request
    # ------------------------------------------------------------------
    try:
        response = requests.post(
            _ROUTES_API_URL,
            json=payload,
            headers=headers,
            timeout=_REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        logger.error(
            "Google Routes API request failed for origin=(%s, %s) dest=(%s, %s): %s",
            origin_lat,
            origin_lng,
            dest_lat,
            dest_lng,
            exc,
        )
        raise ValueError(
            f"Route lookup failed due to a network or API error: {exc}"
        ) from exc

    # ------------------------------------------------------------------
    # Parse response
    # ------------------------------------------------------------------
    data: dict = response.json()
    routes: list = data.get("routes", [])

    if not routes:
        logger.warning(
            "Google Routes API returned no routes for origin=(%s, %s) dest=(%s, %s). "
            "Response: %s",
            origin_lat,
            origin_lng,
            dest_lat,
            dest_lng,
            data,
        )
        raise ValueError(
            f"No route could be found between ({origin_lat}, {origin_lng}) "
            f"and ({dest_lat}, {dest_lng}). The coordinates may be unreachable "
            f"by road."
        )

    first_route: dict = routes[0]

    # duration is returned as a string like "1234s" — strip the trailing "s".
    duration_str: str = first_route.get("duration", "0s")
    duration_seconds: int = int(duration_str.rstrip("s"))
    duration_minutes: int = round(duration_seconds / 60)

    distance_meters: int = first_route.get("distanceMeters", 0)
    distance_km: float = round(distance_meters / 1000, 1)

    logger.info(
        "Route fetched: origin=(%s, %s) dest=(%s, %s) → %.1f km, %d min",
        origin_lat,
        origin_lng,
        dest_lat,
        dest_lng,
        distance_km,
        duration_minutes,
    )

    return {
        "distance_km": distance_km,
        "duration_minutes": duration_minutes,
        "raw_response": data,
    }
