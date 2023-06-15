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

bp = Blueprint('signal-processing', __name__, url_prefix = '/signal-processing')


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
    
    processed_mseed_file_path = os.path.join(current_app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file-processed.mseed")
    stream.write(processed_mseed_file_path)
    
    # define the path of the written uploaded file
    raw_mseed_file_path = os.path.join(current_app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file.mseed")
    # write the uploaded file
    stream.write(raw_mseed_file_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(stream)
    return json_data




        



bp.route("/apply-processing-taper", methods=["GET"])
def process_signal_taper():

    processed_mseed_file_path = os.path.join(current_app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file-processed.mseed")
    
    mseed_data = read(processed_mseed_file_path)
    starttime = mseed_data[0].stats.starttime
    total_seconds = mseed_data[0].stats.endtime - starttime

    taper_length = request.args.get('taper-length-input')
    taper_side = request.args.get('taper-side-select')
    taper_type = request.args.get('taper-type-select')

    if not taper_length:
        taper_length = 0.3

    mseed_data.taper(float(taper_length), type=taper_type, side=taper_side)
    mseed_data.write(processed_mseed_file_path)
    json_data = convert_mseed_to_json(mseed_data)
    return json_data

bp.route("/apply-processing-detrend", methods=["GET"])
def process_signal_detrend():
    
    processed_mseed_file_path = os.path.join(current_app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file-processed.mseed")
    
    mseed_data = read(processed_mseed_file_path)
    starttime = mseed_data[0].stats.starttime
    total_seconds = mseed_data[0].stats.endtime - starttime
    
    
    detrend_type = request.args.get('detrend-type-select')
    mseed_data.detrend(type=detrend_type)
    mseed_data.write(processed_mseed_file_path)
    json_data = convert_mseed_to_json(mseed_data)
    return json_data



bp.route("/apply-processing-trim", methods=["GET"])
def process_signal_trim():
    
    processed_mseed_file_path = os.path.join(current_app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file-processed.mseed")
    
    mseed_data = read(processed_mseed_file_path)
    starttime = mseed_data[0].stats.starttime
    total_seconds = mseed_data[0].stats.endtime - starttime
    trim_left_side = request.args.get('trim-left-side-input')
    trim_right_side = request.args.get('trim-right-side-input')

    if not trim_left_side:
        trim_left_side = 0
    if not trim_right_side:
        trim_right_side = total_seconds

    if float(trim_left_side) >= float(trim_right_side):
        error_message = 'The left side cannot be greater or equal to the right side!'
        generate_error_response(error_message)
    
    mseed_data.trim(starttime=starttime+float(trim_left_side), endtime=starttime+float(trim_right_side))
    mseed_data.write(processed_mseed_file_path)
    json_data = convert_mseed_to_json(mseed_data)
    return json_data

bp.route("/delete-applied-filter", methods=["GET"])
def delete_filter():
    raw_mseed_file_path = os.path.join(current_app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file.mseed")
    
    mseed_data = read(raw_mseed_file_path)
    starttime = mseed_data[0].stats.starttime
    total_seconds = mseed_data[0].stats.endtime - starttime
    
    filter_string = request.args.get('filter')

    all_filters = filter_string.split()
    for filt in all_filters:
        if 'detrend' in filt:
            detrend_type = filt.split('-')[1].strip()
            mseed_data.detrend(type=detrend_type)
        elif 'taper' in filt:
            taper_type = filt.split('-')[1].strip()
            taper_side = filt.split('-')[2].strip()
            taper_length = float(filt.split('-')[3].strip())
            mseed_data.taper(float(taper_length), type=taper_type, side=taper_side)
        elif 'trim' in filt:
            trim_left_side = float(filt.split('-')[1].strip())
            trim_right_side = float(filt.split('-')[2].strip())
            mseed_data.trim(starttime=starttime+float(trim_left_side), endtime=starttime+float(trim_right_side))
    
    processed_mseed_file_path = os.path.join(current_app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file-processed.mseed")
    mseed_data.write(processed_mseed_file_path)
    
    json_data = convert_mseed_to_json(mseed_data)
    return json_data
