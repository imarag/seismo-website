from flask import Blueprint, current_app, render_template, abort, request, jsonify, session, send_file, url_for
import os
import re
from obspy.core import read, UTCDateTime
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np
import pandas as pd
import datetime
from .functions import raise_error

bp = Blueprint('BP_file_to_mseed', __name__, url_prefix = '/file-to-mseed')


def create_path(name):
    path = os.path.join(
        current_app.config['DATA_FILES_FOLDER'], 
        str(session.get("user_id", "test")) + "_" + name
        )
    return path


@bp.route('/upload-file', methods=['POST'])
def upload_file():

    uploaded_file = request.files.get('file')

    # check if there is a file uploaded
    if not uploaded_file:
        error_message = 'No file uploaded!'
        return raise_error(error_message)

    # get the request parameters
    format = request.form.get('format')
    has_headers = request.form.get('has-headers', None)
    skip_rows = request.form.get('skip-rows', None)
    delim = request.form.get('delimiter', None)

    # check the skip rows parameter
    if skip_rows:
        try:
            skip_rows = int(skip_rows)
        except:
            error_message = 'You need to provide an integer for the "skiprows" option!'
            return raise_error(error_message)
        else:
            skiprows_param = skip_rows
    else:
        skiprows_param = None

    # check the has_header
    if has_headers == 'false':
        header_param = None
    elif has_headers == 'true':
        header_param = 0

    if format == 'excel':
        try:
            df = pd.read_excel(
                uploaded_file,
                header = header_param
            )
        except Exception as e:
            error_message = str(e)
            return raise_error(error_message)
    elif format == 'csv':
        try:
            df = pd.read_csv(
                uploaded_file,
                header = header_param
            )
        except Exception as e:
            error_message = str(e)
            return raise_error(error_message)
    else:
        try:
            df = pd.read_csv(
                uploaded_file,
                header = header_param,
                skiprows = skiprows_param,
                sep = delim
            )
        except Exception as e:
            error_message = str(e)
            return raise_error(error_message)

    if df.empty:
        error_message = 'The uploaded file seems empty. Please, check the content of your input file and the input delimiter of your columns (in case of a .txt or .dat file) and try again!'
        return raise_error(error_message)
    
    if len(df.columns) <= 1:
        error_message = 'The uploaded file does not have enough columns to use at this tool. You need at least two columns with data (in case of one horizontal and one vertical component)!'
        return raise_error(error_message)

    if has_headers == 'false':
        new_columns = [f'col{i}' for i in range(1, len(df.columns)+1)]
        df.columns = new_columns

    # save the file
    file_path = create_path('file-to-mseed.csv')
    df.to_csv(file_path, index=False)

    column_names = list(df.columns) + ["select column"]

    # return as json
    return jsonify({"column-names": column_names})



@bp.route('/convert-file-to-mseed', methods=['GET'])
def convert_file_to_mseed():

    station = request.args.get('station')
    date = request.args.get('date')
    time = request.args.get('time')
    sampling_frequency_radio = request.args.get('fs-radio')
    parameterValue = request.args.get('parameter-value')
    is_two_components = request.args.get('is-two-components')

    vert_compo_column = request.args.get('vert-compo')
    hor_compo1_column = request.args.get('hor-compo1')
    hor_compo2_column = request.args.get('hor-compo2')

    if is_two_components == 'true' and (vert_compo_column == "select column" or hor_compo1_column == "select column"):
        error_message = 'You need to select a column of your file for each of the two components!'
        return raise_error(error_message)
    elif is_two_components == 'false' and (vert_compo_column == "select column" or hor_compo1_column == "select column" or hor_compo2_column == "select column"):
        error_message = 'You need to select a column of your file for each of the three components!'
        return raise_error(error_message)
    
    if is_two_components == 'true' and len(set([vert_compo_column, hor_compo1_column])) != 2:
        error_message = 'You cannot have the same column for two components!'
        return raise_error(error_message)
    elif is_two_components == 'false' and len(set([vert_compo_column, hor_compo1_column, hor_compo2_column])) != 3:
        error_message = 'You cannot have the same column for two components!'
        return raise_error(error_message)

    if is_two_components == 'true':
        selected_columns = [vert_compo_column, hor_compo1_column]
    else:
        selected_columns = [vert_compo_column, hor_compo1_column, hor_compo2_column]

        
    # initialize the parameter dictionary to put the paremeters
    params_dict = {}

    # check the station
    if station:
        if not re.search('^[A-Za-z0-9]{3,6}$', station.strip()):
            error_message = 'The station name should contain three to six letters from a-z or A-Z, and/or numbers from 0-9!'
            return raise_error(error_message)
        
        params_dict['station'] = station.strip().upper()
    else:
        params_dict['station'] = 'STA'


    if date and not time:
        datetime_param = str(date) + " " + "00:00:00"
    elif date and time:
        datetime_param = str(date) + " " + str(time)
    elif time and not date:
        datetime_param = "1970-01-01" + " " + str(time) 
    elif not time and not date:
        datetime_param = "1970-01-01" + " " + "00:00:00"

    try:
        params_dict['starttime'] = UTCDateTime(datetime_param)
    except Exception as e:
        error_message = str(e)
        return raise_error(error_message)
   
    if not parameterValue:
        error_message = 'You need to insert a valid value for the sampling parameters (fs or dt)!'
        return raise_error(error_message)
    else:
        try:
            float(parameterValue)
        except:
            error_message = 'You need to insert a number or the sampling parameters!'
            return raise_error(error_message)
    
    if sampling_frequency_radio == 'true':
        params_dict['sampling_rate'] = float(parameterValue)
    else:
        params_dict['delta'] = float(parameterValue)

    df = pd.read_csv(create_path('file-to-mseed.csv'))

    df = df.loc[:, selected_columns]

    if is_two_components == 'true':
        df.columns = ['Z', 'E']
    else:
        df.columns = ['Z', 'E', 'N']

    lt_traces = []
    for compo in df.columns:
        trace_data = pd.to_numeric(df[compo], errors='coerce')
        trace_data = trace_data.fillna(0).to_numpy()
        params_dict['channel'] = compo
        trace = Trace(
            data=trace_data, 
            header=params_dict
        )
        lt_traces.append(trace)

    
    st = Stream(lt_traces)
    mseed_file_save_path = create_path('file-to-mseed.mseed')
    st.write(
        mseed_file_save_path
    )

    return send_file(mseed_file_save_path, as_attachment=True,   download_name="mseed-stream.mseed")
