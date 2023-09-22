from flask import Blueprint, current_app, request, jsonify, session, send_file
import os
import folium
from obspy.geodetics import gps2dist_azimuth
from .functions import raise_error

bp = Blueprint('BP_distance_between_points', __name__, url_prefix = '/distance-between-points')


def create_path(name):
    path = os.path.join(
        current_app.config['DATA_FILES_FOLDER'], 
        str(session.get("user_id", "test")) + "_" + name
        )
    return path

@bp.route('/calculate-distance')
def calculate_distance():
    point1_lat = request.args.get('point1-lat-input')
    point1_lon = request.args.get('point1-lon-input')
    point2_lat = request.args.get('point2-lat-input')
    point2_lon = request.args.get('point2-lon-input')

    if not point1_lat or not point1_lon or not point2_lat or not point2_lon:
        error_message = 'You need to include the coordinates of both points as degrees from -90 to 90 (latitude) and -180 to 180 (longitude)!'
        return raise_error(error_message)
    
    try:
        [float(point1_lat),float(point1_lon),float(point2_lat),float(point2_lon)]
    except:
        error_message = 'You need to provide numbers as the points coordinates!'
        return raise_error(error_message)

    if float(point1_lon) > 180 or float(point1_lon) < -180 or float(point2_lon) > 180 or float(point2_lon) < -180:
        error_message = 'The longitude value can be between -180 and 180 degrees!'
        return raise_error(error_message)
    
    if float(point1_lat) > 90 or float(point1_lat) < -90 or float(point2_lat) > 90 or float(point2_lat) < -90:
        error_message = 'The latitude value can be between -90 and 90 degrees!'
        return raise_error(error_message)
    
    try:
        result = gps2dist_azimuth(
            float(point1_lat),
            float(point1_lon),
            float(point2_lat),
            float(point2_lon)
        )[0]/1000
        result = round(result, 3)
    except Exception as e:
        error_message = str(e)
        return raise_error(error_message)
    
    point_label = f'P1({float(point1_lat):.3f},{float(point1_lon):.3f}) - P2({float(point2_lat):.3f},{float(point2_lon):.3f})' 

    return jsonify({'result': result, 'points': point_label})

@bp.route('/calculate-distance-map')
def calculate_distance_map():

    point1_lat = request.args.get('point1-lat-input')
    point1_lon = request.args.get('point1-lon-input')
    point2_lat = request.args.get('point2-lat-input')
    point2_lon = request.args.get('point2-lon-input')

    if not point1_lat or not point1_lon or not point2_lat or not point2_lon:
        error_message = 'You need to include the coordinates of both points!'
        return raise_error(error_message)
    
    try:
        [float(point1_lat),float(point1_lon),float(point2_lat),float(point2_lon)]
    except:
        error_message = 'You need to provide numbers as the points coordinates!'
        return raise_error(error_message)

    if float(point1_lon) > 180 or float(point1_lon) < -180 or float(point2_lon) > 180 or float(point2_lon) < -180:
        error_message = 'The longitude value can be between -180 and 180 degrees!'
        return raise_error(error_message)
    
    if float(point1_lat) > 90 or float(point1_lat) < -90 or float(point2_lat) > 90 or float(point2_lat) < -90:
        error_message = 'The latitude value can be between -90 and 90 degrees!'
        return raise_error(error_message)
    
    lats = [float(point1_lat), float(point2_lat)]
    lons = [float(point1_lon), float(point2_lon)]

    center_lat = min(lats) + ((max(lats) - min(lats)) / 2)
    center_lon = min(lons) + ((max(lons) - min(lons)) / 2)

    m = folium.Map(location=(center_lat, center_lon), zoom_start=3)

    folium.Marker(
        location=[point1_lat, point1_lon],
        tooltip="Point1"
    ).add_to(m)

    folium.Marker(
        location=[point2_lat, point2_lon],
        tooltip="Point2",
    ).add_to(m)

    save_map_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], str(session.get("user_id", "test")) + "_points-map.html")
    m.save(save_map_path)

    return send_file(
        save_map_path,
    )


