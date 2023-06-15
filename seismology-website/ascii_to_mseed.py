from flask import Flask, Blueprint, current_app, render_template, url_for, abort, request, jsonify, session, Response, session, send_from_directory, send_file, redirect
import os
from flask_session import Session
from obspy.core import read, UTCDateTime
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np
import pandas as pd
import uuid
import io

bp = Blueprint('ascii-to-mseed', __name__, url_prefix = '/ascii-to-mseed')


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

