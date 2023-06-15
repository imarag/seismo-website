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


bp = Blueprint('fourier', __name__, url_prefix = '/fourier')


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



@bp.route('/compute-fourier', methods=['GET'])
def compute_fourier():
    mseed_file_path = os.path.join(current_app.root_path, "static-data", f"user-{session['user-unique-id']}-mseed-file.mseed")
    mseed_data = read(mseed_file_path)
    first_trace = mseed_data[0]
    starttime = first_trace.stats.starttime
    total_duration = first_trace.stats.endtime - first_trace.stats.starttime
    station = first_trace.stats.station
    fs = first_trace.stats["sampling_rate"]
    fnyq = fs / 2
    dt = first_trace.stats["delta"]

    signal_window_left_side = request.args.get('signal-window-left-side')
    noise_window_right_side = request.args.get('noise-window-right-side')
    window_length = request.args.get('window-length')
    noise_selected = request.args.get('noise-selected')

    error_message = None

    if float(signal_window_left_side) + float(window_length) >= total_duration:
        error_message = 'The signal window must ends before the time series graph ends! Consider reducing the window side or moving the signal left side to the left'
    elif float(signal_window_left_side) < 0:
        error_message = 'The signal window must start after the time series graph begins! Consider moving the signal left side to the right, inside the graph area'
    elif noise_selected == 'true' and float(noise_window_right_side) > total_duration:
        error_message = 'The noise window must end before the time series graph ends! Consider moving the noise right side to the left'
    elif noise_selected == 'true' and float(noise_window_right_side) - float(window_length) < 0:
        error_message = 'The noise window must start after the time series graph begins! Consider reducing the window side or moving the noise right side to the right'

    if error_message:
        response = jsonify({'error-message': error_message})
        response.status_code = 400
        return response

    traces_data_dict = {}

    for i in range(len(mseed_data)):
        trace_label = f'trace-{i}'
        traces_data_dict[trace_label] = {}
        df_s = mseed_data[i].copy()
        channel = df_s.stats.channel

        df_s.trim(starttime = starttime + float(signal_window_left_side), endtime=starttime + float(signal_window_left_side) + float(window_length))
        npts = df_s.stats["npts"]
        sl = int(npts / 2)
        freq_x = np.linspace(0 , fnyq , sl)
        yf_s = np.fft.fft(df_s.data[:npts]) 
        y_write_s = dt * np.abs(yf_s)[0:sl]

        traces_data_dict[trace_label]['signal'] = {
            'ydata': y_write_s.tolist(),
            'xdata': freq_x.tolist(),
            'stats': {
                'starttime': starttime.isoformat(), 
                'sampling_rate':fs, 
                'station':station, 
                'channel': channel
            }
        }

        if noise_selected != 'false':
            df_p = mseed_data[i].copy()
            df_p.trim(starttime = starttime + float(noise_window_right_side) - float(window_length), endtime=starttime + float(noise_window_right_side))
            yf_p = np.fft.fft(df_p.data[:npts]) 
            y_write_p = dt * np.abs(yf_p)[0:sl]

            traces_data_dict[trace_label]['noise'] = {
                'ydata': y_write_p.tolist(),
                'xdata': freq_x.tolist(),
                'stats': {
                    'starttime': starttime.isoformat(), 
                    'sampling_rate':fs, 
                    'station':station, 
                    'channel': channel
                }
            }
        

    json_data = jsonify(traces_data_dict)
    
    return json_data
    



@bp.route('/download', methods=['POST'])
def download():
    # Get the JSON data from the request
    data = request.json

    df = pd.DataFrame()
    df['x'] = data[0]['x']
    for tr in data:
        df[tr['name']] = tr['y']
    
    # Create an Excel file from the DataFrame
    excel_file = io.BytesIO()
    with pd.ExcelWriter(excel_file) as writer:
        df.to_excel(writer, index=False)
    excel_file.seek(0)

    # Return the Excel file as a Blob
    return send_file(
        excel_file,
        as_attachment=True,
        download_name='graph_data.xlsx',
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )


