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


def check_parameter_input(param):
    if not param:
        return None
    else:
        try:
            ret_value = int(param)
        except:
            error_message = 'You need to provide an integer for "Rows to read" and/or "Skiprows"!'
            return raise_error(error_message)
        else:
            return ret_value


@bp.route('/read-file', methods=['POST'])
def read_file():

    uploaded_file = request.files.get('file')

    # check if there is a file uploaded
    if not uploaded_file:
        error_message = 'No file uploaded!'
        return raise_error(error_message)

    # get the request parameters
    format = request.form.get('format')
    has_headers = request.form.get('has-headers')
    columns_to_read = request.form.get('columns-to-read')
    rows_to_read = request.form.get('rows-to-read')
    skip_rows = request.form.get('skip-rows')

    # check the two parameters
    nrows_param = check_parameter_input(rows_to_read)
    skiprows_param = check_parameter_input(skip_rows)

    # check the columns_to_read
    if not columns_to_read:
        usecols_param = None
    else:
        if format == 'excel':
            error_message = 'The "columns to read" option must be in the form n1,n2 or n1,n2,n3 where n, the excel column letter. For example: A,B or A,C,D'
            regex_patt = '^[A-Za-z](,[A-Za-z])*,?$'
        else:
            error_message = 'The "columns to read" option must be in the form n1,n2 or n1,n2,n3 where n, the column number from 1 to 9. For example: 1,3 or 1,2,4 or 2, 3, 1'
            regex_patt = '^[0-9](,[0-9])*,?$'
        
        if not re.search(regex_patt, columns_to_read.strip(' ,')):
            return raise_error(error_message)
        
        usecols_param = "".join(columns_to_read.strip(' ,').split()).split(',')
        if format == 'excel':
            usecols_param = [el.strip().upper() for el in usecols_param]
        else:
            usecols_param = [int(el.strip()) for el in usecols_param]
            # because the user will use 1 for the first column , 2 for the second column, etc... and because the python starts from 0
            # i subtract 1 so that when the user wants for example the first column and he passes 1, then in the python code a 0 will be inserted
            usecols_param = [col_int - 1 for col_int in usecols_param]


    # check the has_header
    if has_headers == 'false':
        header_param = None
    elif has_headers == 'true':
        header_param = 0

    if format == 'excel':
        try:
            df = pd.read_excel(
                uploaded_file,
                header = header_param,
                nrows = nrows_param,
                skiprows = skiprows_param,
                usecols = usecols_param
            )
        except Exception as e:
            error_message = str(e)
            return raise_error(error_message)
    elif format == 'csv':
        try:
            df = pd.read_csv(
                uploaded_file,
                header = header_param,
                nrows = nrows_param,
                skiprows = skiprows_param,
                usecols = usecols_param,
                sep = ','
            )
        except Exception as e:
            error_message = str(e)
            return raise_error(error_message)
    else:
        try:
            df = pd.read_csv(
                uploaded_file,
                header = header_param,
                nrows = nrows_param,
                skiprows = skiprows_param,
                usecols = usecols_param,
                sep = request.form.get('delimiter')
            )
        except Exception as e:
            error_message = str(e)
            return raise_error(error_message)


    if len(df.columns) not in [2, 3]:
        error_message = 'You are limited to uploading either two or three columns from your file. The two columns are in cases where your record comprises just one horizontal and one vertical component. If encountering this error, first check the delimiter selection, in case you upload a TXT file. If not, check the <columns to read> option. If your file contains more than three columns you need to select specific two or three column to upload. Finally, if your file contains only one column or none, it is not going to work. You must upload two or three data columns in order to work effectively.'
        return raise_error(error_message)
    
    if df.empty:
        error_message = 'The uploaded file is empty. You might skipped too many rows, read none row or your file is empty indeed!.'
        return raise_error(error_message)

    # Get the first 5 rows
    first_5_rows = df.head()

    # Convert the first 5 rows to HTML table
    table_html = first_5_rows.to_html().replace('class="', 'class="table text-secondary ')
    
    # save the file
    file_path = create_path('file-to-mseed.csv')
    df.to_csv(file_path, index=False, header=None)

    # return as json, the html table and the file path
    return jsonify({'table-html': table_html, 'file-name-uploaded': file_path, "number_of_traces": len(df.columns) })



@bp.route('/convert-file-to-mseed', methods=['GET'])
def convert_file_to_mseed():

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
            return raise_error(error_message)
    
    else:
        compos = [compo1, compo2, compo3]
        if len(set(compos)) !=3 or 'Z' not in compos:
            error_message = 'You have uploaded 3 columns so you need to select one vertical (Z) and two horizontal (E and N) components!'
            return raise_error(error_message)

    # initialize the parameter dictionary to put the paremeters
    params_dict = {}

    # check the station
    if station:
        if not re.search('^[A-Za-z0-9]{3,6}$', station.strip()):
            error_message = 'The station name should contain three to six letters from a-z or A-Z, and/or numbers from 0-9!'
            return raise_error(error_message)
        
        params_dict['station'] = station.strip().upper()
    else:
        params_dict['station'] = 'STAT'

    
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
        error_message = 'You need to insert a valid value for the select parameter (fs or dt)!'
        return raise_error(error_message)
    else:
        try:
            float(parameterValue)
        except:
            error_message = 'You need to insert a number at the parameter selected!'
            return raise_error(error_message)
    
    if sampling_frequency_radio == 'true':
        params_dict['sampling_rate'] = float(parameterValue)
    else:
        params_dict['delta'] = float(parameterValue)

    df = pd.read_csv(
        create_path('file-to-mseed.csv'),
        header=None
    )

    df.columns = compos

    lt_traces = []
    for compo in compos:
        trace_data = pd.to_numeric(df[compo], errors='coerce').to_numpy()
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
