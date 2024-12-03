from flask import Blueprint, current_app, request, jsonify, session, send_file
import os
import folium
from obspy.geodetics import gps2dist_azimuth
from .functions import raise_error

bp = Blueprint(
    "BP_distance_between_points", __name__, url_prefix="/distance-between-points"
)


@bp.route("/calculate-distance")
def calculate_distance():
    # get the input coordinates
    point1_lat = request.args.get("point1-lat")
    point1_lon = request.args.get("point1-lon")
    point2_lat = request.args.get("point2-lat")
    point2_lon = request.args.get("point2-lon")

    # check the input values
    if not point1_lat or not point1_lon or not point2_lat or not point2_lon:
        error_message = "You need to include the coordinates of both points as degrees from -90 to 90 (latitude) and -180 to 180 (longitude)!"
        return raise_error(error_message)

    try:
        [float(point1_lat), float(point1_lon), float(point2_lat), float(point2_lon)]
    except:
        error_message = "You need to provide numbers for the coordinates!"
        return raise_error(error_message)

    if (
        float(point1_lon) > 180
        or float(point1_lon) < -180
        or float(point2_lon) > 180
        or float(point2_lon) < -180
    ):
        error_message = "The longitude value can be between -180 and 180 degrees!"
        return raise_error(error_message)

    if (
        float(point1_lat) > 90
        or float(point1_lat) < -90
        or float(point2_lat) > 90
        or float(point2_lat) < -90
    ):
        error_message = "The latitude value can be between -90 and 90 degrees!"
        return raise_error(error_message)

    try:
        # calculate the distance
        result = (
            gps2dist_azimuth(
                float(point1_lat),
                float(point1_lon),
                float(point2_lat),
                float(point2_lon),
            )[0]
            / 1000
        )
        result = round(result, 3)
    except Exception as e:
        error_message = str(e)
        return raise_error(error_message)

    return jsonify({"result": result})
