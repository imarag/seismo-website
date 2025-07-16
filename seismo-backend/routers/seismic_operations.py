from fastapi import APIRouter
from pydantic_extra_types.coordinate import Latitude, Longitude

from config import settings
from services.geodetics import compute_distance_km

router = APIRouter()


@router.get("/calculate-distance")
def calculate_distance(
    lat1: Latitude, lon1: Longitude, lat2: Latitude, lon2: Longitude
) -> dict:
    """Calculates the distance and azimuth between two coordinates."""
    settings.logger.info(
        "Calculating distance (km) and azimuth between points (%s, %s) and (%s, %s).",
        lat1,
        lon1,
        lat2,
        lon2,
    )
    result = compute_distance_km(lat1, lon1, lat2, lon2)
    distance_km = round(result[0] / 1000, 3)
    azimuth_a_b = round(result[1], 3)
    azimuth_b_a = round(result[2], 3)
    return {
        "coords": {"lat1": lat1, "lat2": lat2, "lon1": lon1, "lon2": lon2},
        "distance_km": distance_km,
        "azimuth_a_b": azimuth_a_b,
        "azimuth_b_a": azimuth_b_a,
    }
