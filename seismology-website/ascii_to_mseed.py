from flask import Blueprint, current_app, render_template, abort, request, jsonify, session, send_file, url_for
import os
import re
from obspy.core import read, UTCDateTime
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np
import pandas as pd
import datetime
from .db import get_db

bp = Blueprint('BP_ascii_to_mseed', __name__, url_prefix = '/ascii-to-mseed')


def check_parameter_input(param):
    if not param:
        ret_value = None
    else:
        if not isinstance(int(param), int):
            error_message = 'You need to provide an integer at this option!'
            abort(400, description=error_message)
        else:
            ret_value = int(param)
    return ret_value


@bp.route('/show-template', methods=['GET'])
def show_template():
    return render_template('topics/ascii-to-mseed.html')

@bp.route('/read-ascii-file', methods=['POST'])
def read_ascii_file():

    # get the request parameters
    uploaded_ascii_file = request.files.get('file')
    has_headers = request.form.get('has-headers')
    columns_to_read = request.form.get('columns-to-read')
    delimiter = request.form.get('delimiter')
    rows_to_read = request.form.get('rows-to-read')
    skip_rows = request.form.get('skip-rows')

    # check if there is a file uploaded
    if not uploaded_ascii_file:
        error_message = 'No file uploaded!'
        abort(400, description=error_message)

    # check the two parameters
    nrows_param = check_parameter_input(rows_to_read)
    skiprows_param = check_parameter_input(skip_rows)

    # check the columns_to_read
    if not columns_to_read:
        usecols_param = None
    else:
        regex_patt = '^[1-9] *, *[1-9] *,? *[1-9]?$'
        
        if not re.search(regex_patt, columns_to_read.strip(' ,')):
            error_message = 'The "columns to read" option must be in the form n1,n2 or n1,n2,n3 where n, the column number from 1 to 9. For example: 1,3 or 1,2,4'
            abort(400, description=error_message)
        
        usecols_param = columns_to_read.strip(' ,').split(',')
        usecols_param = [int(el.strip()) for el in usecols_param]

        # because the user will use 1 for the first column , 2 for the second column, etc... and because the python starts from 0
        # i subtract 1 so that when the user wants for example the first column and he passes 1, then in the python code a 0 will be inserted
        usecols_param = [col_int - 1 for col_int in usecols_param]

    # check the has_header
    if has_headers == 'false':
        header_param = None
    elif has_headers == 'true':
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
        error_message = str(e)
        abort(400, description=error_message)

    

    if len(df.columns) not in [2, 3]:
        error_message = 'You can only upload two or three columns from your file. The two columns are in case your record has just one horizontal and one vertical component. This error may be caused by an incorrect delimiter selection, check the separator of your columns. Another possible reason that triggers this error is the <columns to read> option. If your file has more than three columns, you should upload two or three of them (ej. 1,3 or 1,3,4). Lastly, if you file has just one column or none, you can\'t use it. You need two or three data columns!'
        abort(400, description=error_message)
    
    if df.empty:
        error_message = 'Your file is empty or you skipped too many rows or your file is empty!.'
        abort(400, description=error_message)

    try:
        for c in df.columns:
            df[c].astype(float)
    except:
        error_message = 'Your file has headers and your did not check the <has headers> option!'
        abort(400, description=error_message)

    # Get the first 5 rows
    first_5_rows = df.head()

    # Convert the first 5 rows to HTML table
    table_html = first_5_rows.to_html().replace('class="dataframe"', 'class="table text-secondary"').replace('style="text-align: right;"', '')

    # inser the data file name to save in the data_files folder
    file_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], str(session.get("user_id", "test")) + "_ascii-to-mseed.csv")

    # save the generated pandas to csv at the file path specified
    df.to_csv(file_path, index=False, header=None)

    # return as json, the html table and the file path
    return jsonify({'table-html': table_html, 'file-name-uploaded': file_path, "number_of_traces": len(df.columns) })



@bp.route('/convert-ascii-to-mseed', methods=['GET'])
def convert_ascii_to_mseed():

    station = request.args.get('station')
    date = request.args.get('date')
    time = request.args.get('time')
    sampling_frequency_radio = request.args.get('fs-radio')
    parameterValue = request.args.get('parameter-value')
    total_traces = int(request.args.get("total-traces"))
    
    compo1 = request.args.get('compo1')
    compo2 = request.args.get('compo2')
    compo3 = request.args.get('compo3')

    # check the components
    if total_traces == 2:
        compos = [compo1, compo2]
        if len(set(compos)) !=2 or 'Z' not in compos:
            error_message = 'You have uploaded 2 columns so you need to select one vertical (Z) and one horizontal (E or N) component!'
            abort(400, description=error_message)
    
    else:
        compos = [compo1, compo2, compo3]
        if len(set(compos)) !=3 or 'Z' not in compos:
            error_message = 'You have uploaded 3 columns so you need to select one vertical (Z) and two horizontal (E and N) components!'
            abort(400, description=error_message)

    # initialize the parameter dictionary to put the paremeters
    params_dict = {}

    # check the station
    if station:
        if not re.search('^[A-Za-z0-9]{4}$', station.strip()):
            error_message = 'The station name should contain three to five letters from a-z or A-Z, and/or numbers from 0-9!'
            abort(400, description=error_message)
        
        params_dict['station'] = station.strip().upper()
    else:
        params_dict['station'] = ''

    
    
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
        abort(400, error_message)
   

    if not parameterValue:
        error_message = 'You need to insert a valid value for the select parameter (fs or dt)!'
        abort(400, description=error_message)
    else:
        try:
            float(parameterValue)
        except:
            error_message = 'You need to insert a number at the parameter selected!'
            abort(400, description=error_message)
    
    if sampling_frequency_radio == 'true':
        params_dict['sampling_rate'] = float(parameterValue)
    else:
        params_dict['delta'] = float(parameterValue)

    df = pd.read_csv(
        os.path.join(current_app.config['DATA_FILES_FOLDER'], str(session.get("user_id", "test")) + "_ascii-to-mseed.csv"),
        header=None
    )
    print(df)
    print()
    df.columns = compos
    print(df)
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
    mseed_file_save_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], str(session.get("user_id", "test")) + "_ascii-to-mseed.mseed")
    st.write(
        mseed_file_save_path
    )


    return send_file(mseed_file_save_path, as_attachment=True,   download_name="mseed-stream.mseed")

