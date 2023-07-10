from flask import Flask, make_response, Blueprint, current_app, render_template, url_for, abort, request, jsonify, session, Response, session, send_from_directory, send_file, redirect
import os
from flask_session import Session
from obspy.core import read, UTCDateTime
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np
import pandas as pd

bp = Blueprint('BP_pick_arrivals', __name__, url_prefix = '/pick-arrivals')

def generate_error_response(message):
    response = make_response(jsonify({'error_message':message}), 400)
    return response

def generate_mseed_save_file_path():
    # Create the folder path by combining the root path and folder name
    folder_path = os.path.join(current_app.root_path, 'data_files')
    # Create the folder if it doesn't exist
    os.makedirs(folder_path, exist_ok=True)
    # get the user id to save from the session
    user_id = session.get('user_id', None)
    # Save the DataFrame to a CSV file in the specified folder
    file_path = os.path.join(folder_path, str(user_id) + '_' + 'pick-arrivals' + '.mseed')
    return file_path


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
   return render_template('topics/pick-arrivals.html')


@bp.route('/upload-mseed-file', methods=['POST'])
def upload():

    files = request.files

    # check if file exists
    if 'file' not in files or len(files) < 1:
        return generate_error_response('No file uploaded!')

    # Get the uploaded file from the request
    mseed_file = files['file']

    # Read the MSeed file using obspy
    try:
        stream = read(mseed_file)
    except Exception as e:
        return generate_error_response(str(e))

    # if the stream has 0 or more that 3 traces abort
    if len(stream) <= 0 or len(stream) > 3:
        error_message = f'The stream must contain two or three records. Your stream contains {len(stream)} traces!'
        return generate_error_response(error_message)

    # if at least one of the traces is empty abort
    for tr in stream:
        if len(tr.data) == 0:
            error_message = 'One or more of your traces in the stream object, is empty.'
            return generate_error_response(error_message)

    # if the user hasn't defined nor the fs neither the delta, then error
    if stream[0].stats['sampling_rate'] == 1 and stream[0].stats['delta'] == 1:
        error_message = 'Neither sampling rate (fs[Hz]) nor sample distance (delta[sec]) are specified in the trace objects. Consider including them in the stream traces, for the correct x-axis time representation!'
        return generate_error_response(error_message)

    # inser the data file name to save in the data_files folder
    mseed_save_file_path = generate_mseed_save_file_path()

    # write the uploaded file
    stream.write(mseed_save_file_path)
    # convert the uploaded mseed file to json (i also provide the mseed file path so that
    # i can add it to the json object later).
    json_data = convert_mseed_to_json(stream)

    return json_data



@bp.route("/apply-filter", methods=["GET"])
def apply_filter():

    filter_value = request.args.get('filter')
    file_location_path = generate_mseed_save_file_path()
    mseed_data = read(file_location_path)
    
    if filter_value != 'initial':
        freqmin = filter_value.split('-')[0]
        freqmax = filter_value.split('-')[1]
        if freqmin and not freqmax:
            try:
                mseed_data.filter("highpass", freq=float(freqmin))
            except Exception as e:
                return generate_error_response(str(e))
        elif not freqmin and freqmax:
            try:
                mseed_data.filter("lowpass", freq=float(freqmax))
            except Exception as e:
                return generate_error_response(str(e))
        elif not freqmin and not freqmax:
            pass
        else:
            if float(freqmin) >= float(freqmax):
                return generate_error_response('The left filter cannot be greater or equal to the right filter!')
            
            try:
                mseed_data.filter("bandpass", freqmin=float(freqmin), freqmax=float(freqmax))
            except Exception as e:
                return generate_error_response(str(e))
    
    json_data = convert_mseed_to_json(mseed_data)

    return json_data
    


