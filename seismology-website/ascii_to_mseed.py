from flask import Flask, flash, make_response, Blueprint, current_app, render_template, url_for, abort, request, jsonify, session, Response, session, send_from_directory, send_file, redirect
import os
import re
from flask_session import Session
from obspy.core import read, UTCDateTime
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np
import pandas as pd
import uuid
import io
import datetime
from .db import get_db

bp = Blueprint('asciitomseed', __name__, url_prefix = '/ascii-to-mseed')

def save_file_to_data_file():
    # Define the folder name where you want to save the CSV file
    folder_name = 'data_files'
    # Get the root path of the Flask application
    root_path = current_app.root_path
    # Create the folder path by combining the root path and folder name
    folder_path = os.path.join(root_path, folder_name)
    # Create the folder if it doesn't exist
    os.makedirs(folder_path, exist_ok=True)
    # get the user id to save from the session
    user_id = session.get('user_id', None)
    
    # Generate the current date and time
    current_datetime = datetime.datetime.now()
    # Format the date and time as a string
    date_string = current_datetime.strftime('%Y-%m-%d-%H-%M-%S')
    # Save the DataFrame to a CSV file in the specified folder
    file_path = os.path.join(folder_path, date_string + '_' + str(user_id) + '_' + 'ascii-to-mseed' + '.csv')
    return file_path

    

def generate_error_response(message):
    response = make_response(jsonify({'error_message':message}), 400)
    return response


def convert_mseed_to_json(stream):
    traces_data_dict = {}
    first_trace = stream[0]
    starttime = first_trace.stats["starttime"].isoformat()
    fs = float(first_trace.stats["sampling_rate"])
    station = first_trace.stats["station"]
    for n, trace in enumerate(stream):
        ydata = trace.data.tolist()
        xdata = trace.times().tolist()

        trace_data = {
            'ydata': ydata,
            'xdata': xdata,
            'stats': {
                'starttime': starttime, 
                'sampling_rate':fs, 
                'station':station, 
                'channel': trace.stats["channel"]
            },
            }
        traces_data_dict[f'trace-{n}'] = trace_data
   
    return jsonify(traces_data_dict)


@bp.route('/show-template', methods=['GET', 'POST'])
def show_template():
    return render_template('topics/ascii-to-mseed.html')


@bp.route('/read-ascii-file', methods=['POST'])
def read_ascii_file():
    uploaded_ascii_file = request.files.get('file')
    delimiter = request.form.get('delimiter')
    rows_to_read = request.form.get('rows-to-read')
    skip_rows = request.form.get('skip-rows')
    had_headers = request.form.get('has-headers')
    columns_to_read = request.form.get('columns-to-read')
    

    if not uploaded_ascii_file:
        return generate_error_response('No file uploaded')
    
    # if empty or 0 then nrows=None else nrows=int(rows_to_read)
    if not rows_to_read:
        nrows_param = None
    else:
        if int(rows_to_read) == 0:
            nrows_param = None
        else:
            nrows_param = int(rows_to_read)

    if not columns_to_read:
        usecols_param = None
    else:
        regex_patt = "^[0-9] *, *[0-9] *,? *[0-9]?$"
        
        if not re.search(regex_patt, columns_to_read.strip(' ,')):
            return generate_error_response('The "columns to read" option must be in the form n1,n2 or n1,n2,n3 where n, the column number. For example: 1,3 or 1,2,4')
        
        usecols_param = columns_to_read.split(',')
        usecols_param = [int(el.strip()) for el in usecols_param]

    if not skip_rows:
        skiprows_param = None
    else:
        skiprows_param = int(skip_rows)

    if had_headers == 'false':
        header_param = None
    elif had_headers == 'true':
        header_param = 0

    try:
        df = pd.read_csv(
            uploaded_ascii_file,
            header = header_param,
            nrows = nrows_param,
            skiprows = skiprows_param,
            delimiter = delimiter,
            usecols = usecols_param
        )
    except Exception as e:
        return generate_error_response(str(e))

    if len(df.columns) not in [2, 3]:
        return generate_error_response('You can only upload two or three columns from your file. Each of these columns represents the record data for each component. The two columns are in case your record has just one horizontal and one vertical component. This error may be caused by an incorrect delimiter selection, check the separator of your columns. Also check the <columns to read> option. You should include two or three columns to upload (ej. 1,3 or 1,2,3 or 1,4) not more or less. Another possible reason that triggers this error, is if you try to read the whole file and the file has one or more than three columns.')
    
    if df.empty:
        return generate_error_response('Your file is empty or you skipped too many rows.')

    # Get the first 5 rows
    first_5_rows = df.head()

    # Convert the first 5 rows to HTML table
    table_html = first_5_rows.to_html().replace('class="dataframe"', 'class="table text-secondary"').replace('style="text-align: right;"', '')
    
    # inser the data file name to save in the data_files folder
    file_path = save_file_to_data_file()

    df.to_csv(file_path, index=False)

    return jsonify({'table-html': table_html, 'file-name-uploaded': file_path })


@bp.route('/convert-ascii-to-mseed', methods=['POST'])
def convert_ascii_to_mseed():

    station = request.form.get('station')
    datetime = request.form.get('datetime')
    parameterRadioOn = request.form.get('parameter-radio')
    parameterValue = request.form.get('parameter-value')
    ascii_file_name_uploaded = request.form.get('uploaded-ascii-file-input')
    compo1 = request.form.get('compo1')
    compo2 = request.form.get('compo2')
    compo3 = request.form.get('compo3')
    compos = [compo1, compo2, compo3]

    saved_ascii_file_name_no_ext = ascii_file_name_uploaded.rsplit(".", 1)[0]
    saved_ascii_file_extension = ascii_file_name_uploaded.rsplit(".", 1)[1]    
    params_dict = {}

    if not station:
        station_param = ''
    else:
        if not re.search('^[A-Z]{3,5}[0-9]?$', station.upper().strip()):
            return generate_error_response('The station name should contain three to five letters from a-z or A-Z, and optionally one number at the end.')
        station_param = station.upper()
    params_dict['station'] = station_param

    if not datetime:
        params_dict['starttime'] = ''
    else:
        params_dict['starttime'] = UTCDateTime(datetime)

    if not parameterValue:
        return generate_error_response('You need to insert a value for the parameter (fs/dt)')
    
    if parameterRadioOn == 'fs':
        params_dict['sampling_rate'] = float(parameterValue)
    else:
        params_dict['delta'] = float(parameterValue)

    for c in compos:
        if not c:
            return generate_error_response('You need to insert a name for the components')
        if not re.search('^[A-Z]{2,3}[0-9]?$', c.upper().strip()):
            return generate_error_response('The name of the components must contain one or two characters.')

    df = pd.read_csv(
        os.path.join(current_app.root_path, 'data_files', ascii_file_name_uploaded ))
 
    df.columns = compos
    lt_traces = []
    for compo in compos:
        trace_data = df[compo].astype(float).to_numpy()
        params_dict['channel'] = compo
        trace = Trace(
            data=trace_data, 
            header=params_dict
        )
        lt_traces.append(trace)
    st = Stream(lt_traces)

    mseed_file_save_path = os.path.join(current_app.root_path, 'data_files', saved_ascii_file_name_no_ext + '.mseed') 
    st.write(
        mseed_file_save_path
    )

    mime_type = 'application/vnd.fdsn.mseed'

    return send_file(mseed_file_save_path, as_attachment=True,  mimetype=mime_type, download_name='stream.mseed')

