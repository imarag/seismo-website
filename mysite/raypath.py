from flask import Blueprint, current_app, render_template, abort, request, jsonify, session, send_file, make_response
import os
from obspy.core import read
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from .functions import convert_mseed_to_json, get_record_name, raise_error, validate_seismic_file
import matplotlib.pyplot as plt
import cartopy.crs as ccrs

bp = Blueprint('BP_raypath', __name__, url_prefix = '/raypath')


def create_path(name):
    path = os.path.join(
        current_app.config['DATA_FILES_FOLDER'], 
        str(session.get("user_id", "test")) + "_" + name
        )
    return path

@bp.route('/create-map', methods=['POST'])
def create_map():
    data_file = request.files["file"]
    df = pd.read_excel(data_file)
    df_sta = df.copy().drop_duplicates(subset=["station lat", "station lon"])
    df_seismo = df.copy().drop_duplicates(subset=["earthquake lat", "earthquake lon"])
    fig,ax = plt.subplots(figsize=(10,10),subplot_kw={'projection':ccrs.PlateCarree()})


    ax.scatter(df_sta["station lon"],df_sta["station lat"],  c="red", marker="*")
    ax.scatter( df_seismo["earthquake lon"], df_seismo["earthquake lat"],c="blue", marker="^")
    for i in range(len(df)):
        row = df.iloc[i]
        ax.plot([row['station lon'],row['earthquake lon']] , [row['station lat'],row['earthquake lat']] ,ls='-',color='mediumaquamarine', alpha=0.8, zorder=1, lw=0.6)
    ax.coastlines()
    map_save_path = create_path('map.png')
    data_save_path = create_path('map-data.xlsx')
    fig.savefig(map_save_path)
    df.to_excel(data_save_path, index=None)
    return send_file(map_save_path)


@bp.route('/update-styles', methods=["POST"])
def update_marker_style():
    line_style = request.form["line-style"]
    line_width = float(request.form["line-width"])
    line_color = request.form["line-color"]
    station_marker_style = request.form["station-marker-style"]
    station_marker_size = float(request.form["station-marker-size"])
    station_marker_color = request.form["station-marker-color"]
    earth_marker_style = request.form["earth-marker-style"]
    earth_marker_size = float(request.form["earth-marker-size"])
    earth_marker_color = request.form["earth-marker-color"]
    
    fig,ax = plt.subplots(figsize=(10,10),subplot_kw={'projection':ccrs.PlateCarree()})

    ax.coastlines()

    data_save_path = create_path('map-data.xlsx')
    df = pd.read_excel(data_save_path)
    df_sta = df.drop_duplicates(subset=["station lat", "station lon"])
    df_seismo = df.drop_duplicates(subset=["earthquake lat", "earthquake lon"])

    ax.scatter(
        df_sta["station lon"],
        df_sta["station lat"], 
        s=station_marker_size,
        c=station_marker_color,
        marker=station_marker_style
        )
    
    ax.scatter(
        df_seismo["earthquake lon"],
        df_seismo["earthquake lat"], 
        s=earth_marker_size,
        c=earth_marker_color,
        marker=earth_marker_style
        )
    
    for i in range(len(df)):
        row = df.iloc[i]
        ax.plot(
            [row['station lon'], row['earthquake lon']], 
            [row['station lat'], row['earthquake lat']],
            lw=line_width,
            ls=line_style,
            color=line_color
            )


    map_save_path = create_path('map.png')
    fig.savefig(map_save_path)
    return send_file(map_save_path)
