from flask import Flask, make_response, Blueprint, current_app, render_template, url_for, abort, request, jsonify, session, Response, session, send_from_directory, send_file, redirect
import os
from flask_session import Session
from obspy.core import read, UTCDateTime
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np
import pandas as pd

bp = Blueprint('BP_pick_arrivals', __name__, url_prefix = '/pick-arrivals')

def generate_mseed_save_file_path():
    # Create the folder path by combining the root path and folder name
    folder_path = os.path.join(current_app.root_path, 'data_files')
    # Create the folder if it doesn't exist
    os.makedirs(folder_path, exist_ok=True)
    # get the user id to save from the session
    user_id = session.get('user_id', 'test')
    # Save the DataFrame to a CSV file in the specified folder
    file_path = os.path.join(folder_path, str(user_id) + '_' + 'pick-arrivals' + '.mseed')
    return file_path


def convert_mseed_to_json(stream):
    traces_data_dict = {}
    first_trace = stream[0]
    starttime = first_trace.stats["starttime"]
    fs = float(first_trace.stats["sampling_rate"])
    station = first_trace.stats["station"]
    rec_name = str(starttime.date) + "_" + str(starttime.time) + "_" + station
    rec_name = rec_name.replace(":", "").replace("-", "")
    starttime = starttime.isoformat()
    
    for n, trace in enumerate(stream):
        ydata = trace.data.tolist()
        xdata = trace.times().tolist()

        trace_data = {
            'record-name': rec_name,
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


@bp.route('/show-template', methods=['GET'])
def show_template():
   return render_template('topics/pick-arrivals.html')


@bp.route('/upload-mseed-file', methods=['POST'])
def upload():

    files = request.files

    # check if file exists
    if 'file' not in files or len(files) < 1:
        error_message="No file uploaded!"
        abort(400, description=error_message)

    # Get the uploaded file from the request
    mseed_file = files['file']

    # Read the MSeed file using obspy
    try:
        stream = read(mseed_file)
    except Exception as e:
        error_message=str(e)
        abort(400, description=error_message)

    # if the stream has 0, 1 or more that 3 traces abort
    if len(stream) <= 1 or len(stream) > 3:
        error_message = f'The stream must contain two or three traces. Your stream contains {len(stream)} traces!'
        abort(400, description=error_message)

    # if at least one of the traces is empty abort
    for tr in stream:
        if len(tr.data) == 0:
            error_message = 'One or more of your traces in the stream object, is empty.'
            abort(400, description=error_message)

    # if the user hasn't defined nor the fs neither the delta, then error
    if stream[0].stats['sampling_rate'] == 1 and stream[0].stats['delta'] == 1:
        error_message = 'Neither sampling rate (fs[Hz]) nor sample distance (delta[sec]) are specified in the trace objects. Consider including them in the stream traces, for the correct x-axis time representation!'
        abort(400, description=error_message)

    # get the file path to save the mseed file on the server
    mseed_save_file_path = generate_mseed_save_file_path()

    # write the uploaded file
    stream.write(mseed_save_file_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(stream)

    return json_data


@bp.route("/apply-filter", methods=["GET"])
def apply_filter():

    # get the filter value
    filter_value = request.args.get('filter')

    # get the uploaded mseed file to apply the filter to it
    file_location_path = generate_mseed_save_file_path()
    
    # read it
    mseed_data = read(file_location_path)
    
    # according to the filter value, apply a filter to it
    # if the filter is "initial" then don't do any filter, just return the raw values
    if filter_value != 'initial':
        freqmin = filter_value.split('-')[0]
        freqmax = filter_value.split('-')[1]
        if freqmin and not freqmax:
            if float(freqmin) < 0.01 or float(freqmin) > 100:
                error_message="The acceptable filter range is from 0.01 to 100 Hz!"
                abort(400, description=error_message)
            
            try:
                mseed_data.filter("highpass", freq=float(freqmin))
            except Exception as e:
                error_message = str(e)
                abort(400, description=error_message)

        elif not freqmin and freqmax:
            if float(freqmax) < 0.01 or float(freqmax) > 100:
                error_message = "The acceptable filter range is from 0.01 to 100 Hz!"
                abort(400, description=error_message)
            
            try:
                mseed_data.filter("lowpass", freq=float(freqmax))
            except Exception as e:
                error_message = str(e)
                abort(400, description=error_message)

        elif not freqmin and not freqmax:
            pass
        else:
            if float(freqmin) >= float(freqmax):
                error_message = 'The left filter cannot be greater or equal to the right filter!'
                abort(400, description=error_message)

            elif float(freqmin) < 0.01 or float(freqmin) > 100 or float(freqmax) < 0.01 or float(freqmax) > 100:
                error_message = "The acceptable filter range is from 0.01 to 100 Hz!"
                abort(400, description=error_message)
            
            try:
                mseed_data.filter("bandpass", freqmin=float(freqmin), freqmax=float(freqmax))
            except Exception as e:
                error_message = str(e)
                abort(400, description=error_message)
    
    json_data = convert_mseed_to_json(mseed_data)

    return json_data
    


@bp.route("/save-arrivals", methods=["GET"])
def save_arrivals():
    
    Parr = request.args.get('Parr')
    Sarr = request.args.get('Sarr')

    if Parr == "null" and Sarr == "null":
        error_message = "You need to select at least one arrival to save them!"
        abort(400, description=error_message)
    elif Parr != "null" and Sarr == "null":
        dict_arrivals = {"P": float(Parr)}
    elif Parr == "null" and Sarr != "null":
        dict_arrivals = {"S": float(Sarr)}
    else:
        dict_arrivals = {"P": float(Parr), "S": float(Sarr)}


    mseed_file_path = generate_mseed_save_file_path()
    mseed_file_parent = os.path.dirname(mseed_file_path)

    df = read(mseed_file_path)

    station = df[0].stats.station
    starttime = df[0].stats.starttime

    arrivals_file_name = str(starttime.date) + "_" + str(starttime.time) + "_" + station + ".txt"
    arrivals_file_name = arrivals_file_name.replace(":", "").replace("-", "")
    arrivals_file_path = os.path.join(mseed_file_parent, arrivals_file_name)
    
    with open(arrivals_file_path, "w") as fw:
        for pick_label in dict_arrivals:
            fw.write(pick_label + " ")
        fw.write("\n")

        for pick_label in dict_arrivals:
            fw.write(str(dict_arrivals[pick_label]) + " ")
        fw.write("\n")
    
    return send_file(arrivals_file_path, mimetype=None, as_attachment=True, download_name=arrivals_file_name)
            