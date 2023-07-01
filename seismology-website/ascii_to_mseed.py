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

bp = Blueprint('asciitomseed', __name__, url_prefix = '/ascii-to-mseed')



def generate_error_response(message):
    response = jsonify({'error-message': message})
    response.status_code = 400
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
        error_message = 'No file uploaded'
        response = make_response(jsonify({'error_message':error_message}), 400)
        return response
    
    if had_headers == 'false':
        header_param = None
    elif had_headers == 'true':
        header_param = 0

    if not rows_to_read:
        nrows_param = None
    elif int(rows_to_read) == 0:
        nrows_param = None
    else:
        nrows_param = int(rows_to_read)

    if not skip_rows:
        skiprows_param = None
    else:
        skiprows_param = int(skip_rows)
   
    if not columns_to_read:
        usecols_param = None
    else:
        regex_patt = "^[0-9] *, *[0-9] *,? *[0-9]?$"
        if not re.search(regex_patt, columns_to_read.strip(' ,')):
            error_message = 'The option to select specific column in your file, must be in the form [0,1,3]'
            response = make_response(jsonify({'error_message':error_message}), 400)
            return response
        usecols_param = columns_to_read.split(',')
        usecols_param = [int(el.strip() )for el in usecols_param]

    
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
        response = make_response(jsonify({'error_message':error_message}), 400)
        return response
        

    if len(df.columns) not in [2, 3]:
        error_message = 'You can only upload two or three columns from your file. Each of these columns represents the record data for each component (you can also upload just two columns in case your have just one horizontal and one vertical component). This error may be caused by an incorrect delimiter selection, check the separator of your columns. Also check the <columns to read> option. You should include two or three columns to upload (ej. 1,3 or 1,2,3 or 1,4). Another possible reason that triggers this error, is if you try to read the whole file and the file has one or more than three columns.'
        response = make_response(jsonify({'error_message':error_message}), 400)
        return response
    
    if df.empty:
        error_message = 'Your file is empty or you skipped too many rows.'
        response = make_response(jsonify({'error_message':error_message}), 400)
        return response

    # Get the first 5 rows
    first_5_rows = df.head()

    # Convert the first 5 rows to HTML table
    table_html = first_5_rows.to_html().replace('class="dataframe"', 'class="table text-secondary"').replace('style="text-align: right;"', '')

    ############################3
        # na swsw to ascii sto server gia na to xrhsimopoihsw meta na kanw to convert to mseed
        # na dw ti onoma tha tou dwsw gia na einai unique. Na exei username, date, tool used that created it na kanw kai kamia analush sto telos
    ############################3
    # save the uploaded ascii file to the server to use it later in the seismic parameters
    df.to_csv('')

    return table_html



@bp.route('/upload-mseed-file', methods=['GET', 'POST'])
def upload():
    global unique_session_id
   
    # check if file exists
    if 'file' not in request.files or len(request.files) < 1:
        generate_error_response('No file uploaded!')

    # Get the uploaded file from the request
    mseed_file = request.files['file']

    # Read the MSeed file using obspy
    try:
        stream = read(mseed_file)
    except Exception as e:
        generate_error_response(str(e))

    # if the stream has 0 or more that 3 traces abort
    if len(stream) <= 0 or len(stream) > 3:
        error_message = f'The stream must contain up to three traces. Your stream contains {len(stream)} traces!'
        generate_error_response(error_message)

    # if at least one of the traces is empty abort
    for tr in stream:
        if len(tr.data) == 0:
            error_message = 'One or more of your traces in the stream object, is empty.'
            generate_error_response(error_message)

    # if the user hasn't defined nor the fs neither the delta, then error
    if stream[0].stats['sampling_rate'] == 1 and stream[0].stats['delta'] == 1:
        error_message = 'Neither sampling rate (fs[Hz]) nor sample distance (delta[sec]) are specified in the trace objects. Consider including them in the stream traces, for the correct x-axis time representation!'
        generate_error_response(error_message)

    unique_session_id = uuid.uuid4()

    session['user-unique-id'] = unique_session_id
  
    # define the path of the written uploaded file
    raw_mseed_file_path = os.path.join(current_app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file.mseed")
    # write the uploaded file
    stream.write(raw_mseed_file_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(stream)
    return json_data





@bp.route('/upload-ascii-file', methods=['POST'])
def upload_file():
    uploaded_file = request.files.get('file')
    
    if not uploaded_file:
        return 'No file uploaded'

    station = request.form.get('station')
    parameterRadioOn = request.form.get('parameter-radio')
    parameterValue = request.form.get('parameter-value')
    compo1 = request.form.get('compo1')
    compo2 = request.form.get('compo2')
    compo3 = request.form.get('compo3')
    datetime = request.form.get('datetime')
    

    compos = [c for c in [compo1, compo2, compo3] if c]

    filename, file_extension = os.path.splitext(uploaded_file.filename)
    file_extension = file_extension.lower()
    
    if file_extension == '.xlsx' or file_extension == '.xls':
        df = pd.read_excel(uploaded_file)
    elif file_extension == '.csv':
        df = pd.read_csv(uploaded_file)
    else:
        return 'Unsupported file type'
    df.columns = compos
    lt_compos = []
    for col in df.columns:
        trace_data = df[col].astype(int).to_numpy().astype(np.int32)
        trace = Trace(
            data=trace_data, 
            header={
                'station': station, 
                parameterRadioOn: float(parameterValue), 
                'npts': len(trace_data), 
                'channel': col,
                'starttime': UTCDateTime(datetime)
                })
        lt_compos.append(trace)
    
    st = Stream(lt_compos)

    st.write('stream.mseed', format='MSEED')

    mime_type = 'application/vnd.fdsn.mseed'

    return send_file(st, as_attachment=True,  mimetype=mime_type, download_name='stream.mseed')

