from obspy.geodetics.base import gps2dist_azimuth

from core.request_handler import RequestHandler


def compute_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> tuple:
    """Calculates the distance in km and azimuth between two geographic points."""
    try:
        return gps2dist_azimuth(lat1, lon1, lat2, lon2)
    except Exception as e:
        error_message = f"Distance calculation failed: {e}"
        RequestHandler.send_error(error_message, status_code=500)
