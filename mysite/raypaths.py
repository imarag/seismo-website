from flask import Blueprint, current_app, render_template, abort, request, jsonify, session, send_file, make_response
import os
from obspy.core import read
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from .functions import convert_mseed_to_json, get_record_name, raise_error, validate_seismic_file

bp = Blueprint('BP_raypaths', __name__, url_prefix = '/raypaths')

def create_path(name):
    path = os.path.join(
        current_app.config['DATA_FILES_FOLDER'], 
        str(session.get("user_id", "test")) + "_" + name
        )
    return path

@bp.route('/upload-file', methods=['POST'])
def upload():
    # get the files
    files = request.files

    # check if file exists
    if 'file' not in files or len(files) < 1:
        error_message = 'No file uploaded!'
        return raise_error(error_message)

    # Get the uploaded file from the request
    input_file = files['file']

    file_save_path = create_path("input-file.xlsx")

    df = pd.read_excel(input_file)
    df.to_excel(file_save_path, index=None)

    return jsonify({"columnNames": list(df.columns)})

@bp.route('/plot-data', methods=['GET'])
def plot_data():
    latstation_col = request.args.get("latstation")
    lonstation_col = request.args.get("lonstation")
    latearth_col = request.args.get("latearth")
    lonearth_col = request.args.get("lonearth")

    file_save_path = create_path("input-file.xlsx")
    df = pd.read_excel(file_save_path)
    print(df.columns)
    df = df[[latstation_col, lonstation_col, latearth_col, lonearth_col]]

    df = df.rename(columns = {
        latstation_col: 'station_lat', 
        lonstation_col: 'station_lon', 
        latearth_col: 'earthquake_lat', 
        lonearth_col: 'earthquake_lon'
        })
    
    dict_format = df.to_dict(orient="list")
    return jsonify(dict_format)

