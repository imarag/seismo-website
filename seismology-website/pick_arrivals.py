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

bp = Blueprint('pick-arrivals', __name__, url_prefix = '/pick-arrivals')


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



@bp.route("/apply-filter", methods=["GET"])
def apply_filter():
    mseed_file_path = os.path.join(current_app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file.mseed")
    filter_value = request.args.get('filter')
    error_message = ''
    mseed_data = read(mseed_file_path)
    try:
        if filter_value != 'initial':
            freqmin = filter_value.split('-')[0]
            freqmax = filter_value.split('-')[1]
            if freqmin and not freqmax:
                mseed_data.filter("highpass", freq=float(freqmin))
            elif not freqmin and freqmax:
                mseed_data.filter("lowpass", freq=float(freqmax))
            elif not freqmin and not freqmax:
                pass
            else:
                if float(freqmin) >= float(freqmax):
                    error_message = 'The left filter cannot be greater or equal to the right filter!'
                    response = jsonify({'error-message': error_message})
                    response.status_code = 400
                    return response
                mseed_data.filter("bandpass", freqmin=float(freqmin), freqmax=float(freqmax))
    except Exception as e:
        print(e)
    
    json_data = convert_mseed_to_json(mseed_data)

    return json_data
    


