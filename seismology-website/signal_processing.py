from flask import Blueprint, current_app, render_template, abort, request, jsonify, session, send_file
import os
from obspy.core import read
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np

bp = Blueprint('BP_signal_processing', __name__, url_prefix = '/signal-processing')



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
                'channel': trace.stats["channel"]
            },
        }
        traces_data_dict[f'trace-{n}'] = trace_data
    return jsonify(traces_data_dict)




@bp.route('/show-template', methods=['GET'])
def show_template():
   return render_template('topics/signal-processing.html')

@bp.route('/download-mseed-file', methods=['GET'])
def download_mseed_file():
   # get the file path of the processed mseed
   mseed_processed_file_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], 'processed_' + str(session.get("user_id", "test")) + "_signal-processing.mseed")
   
   return send_file(mseed_processed_file_path, as_attachment=True, download_name="processed_mseed_file.mseed")



@bp.route('/upload-mseed-file', methods=['POST'])
def upload_mseed_file():

    files = request.files

    # check if file exists
    if 'file' not in files or len(files) < 1:
        error_message = 'No file uploaded!'
        abort(400, description=error_message)

    # Get the uploaded file from the request
    mseed_file = files['file']

    # Read the MSeed file using obspy
    try:
        stream = read(mseed_file)
    except Exception as e:
        error_message = str(e)
        abort(400, description=error_message)

    # if the stream has 0, 1 or more that 3 traces abort
    if len(stream) <= 1 or len(stream) > 3:
        error_message = f'The stream must contain two or three traces. Your stream contains {len(stream)} traces!'
        abort(400, description=error_message)

    # if at least one of the traces is empty abort
    for tr in stream:
        if len(tr.data) == 0:
            error_message = 'One or more of your traces in the stream object, is empty!'
            abort(400, description=error_message)

    # if the user hasn't defined nor the fs neither the delta, then error
    if stream[0].stats['sampling_rate'] == 1 and stream[0].stats['delta'] == 1:
        error_message = 'Neither sampling rate (fs[Hz]) nor sample distance (delta[sec]) are specified in the trace objects. Consider including them in the stream traces, for the correct x-axis time representation!'
        abort(400, description=error_message)

    # get the file path to save the mseed file on the server
    mseed_save_file_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], str(session.get("user_id", "test")) + "_signal-processing.mseed")

    # get the file path of the processed mseed
    mseed_processed_file_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], 'processed_' + str(session.get("user_id", "test")) + "_signal-processing.mseed")


    # write the uploaded file
    stream.write(mseed_save_file_path)

    # write the processed file
    stream.write(mseed_processed_file_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(stream)

    return json_data



@bp.route("/apply-processing-taper", methods=["GET"])
def process_signal_taper():

    # get the file path of the processed mseed
    mseed_processed_file_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], 'processed_' + str(session.get("user_id", "test")) + "_signal-processing.mseed")

    try:
        mseed_data = read(mseed_processed_file_path)
    except Exception as e:
        error_message = str(e)
        abort(400, description=error_message)

    # get the user selected options
    taper_length = request.args.get('taper-length-input')
    taper_side = request.args.get('taper-side-select')
    taper_type = request.args.get('taper-type-select')

    # check if taper length exists else put a default value of 0.3
    # else if not a numberic value or <0 or >50 abort
    if not taper_length:
        taper_length = 0.3
    else:
        try:
            float(taper_length)
        except Exception as e:
            error_message = 'You need to include a numeric value for the "taper length" option'
            abort(400, description=error_message)
        
        if float(taper_length) < 0 or float(taper_length) > 50:
            error_message = 'The "taper length" option must be between 0 percent and 50 percent!'
            abort(400, description=error_message)

    try:
        # taper the mseed file
        mseed_data.taper(float(taper_length), type=taper_type, side=taper_side)
    except Exception as e:
        error_message = str(e)
        abort(400, description=error_message)

    # write the detrended file to the processed mseed file
    mseed_data.write(mseed_processed_file_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(mseed_data)

    return json_data


@bp.route("/apply-processing-detrend", methods=["GET"])
def process_signal_detrend():
    
    # get the file path of the processed mseed
    mseed_processed_file_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], 'processed_' + str(session.get("user_id", "test")) + "_signal-processing.mseed")

    try:
        mseed_data = read(mseed_processed_file_path)
    except Exception as e:
        error_message = str(e)
        abort(400, description=error_message)

    # get the user selected detrend type
    detrend_type = request.args.get('detrend-type-select')

    # detrend the mseed file
    try:
        mseed_data.detrend(type=detrend_type)
    except Exception as e:
        error_message = str(e)
        abort(400, description=error_message)

    # write the detrended file to the processed mseed file
    mseed_data.write(mseed_processed_file_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(mseed_data)

    return json_data




@bp.route("/apply-processing-trim", methods=["GET"])
def process_signal_trim():
    
    # get the file path of the processed mseed
    mseed_processed_file_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], 'processed_' + str(session.get("user_id", "test")) + "_signal-processing.mseed")

    try:
        mseed_data = read(mseed_processed_file_path)
    except Exception as e:
        error_message = str(e)
        abort(400, description=error_message)
    
    starttime = mseed_data[0].stats.starttime
    total_seconds = mseed_data[0].stats.endtime - starttime

    # get the user selected options
    trim_left_side = request.args.get('trim-left-side-input')
    trim_right_side = request.args.get('trim-right-side-input')

    # because some elements are input number, the user can leave it empty
    if not trim_left_side:
        trim_left_side = 0
    else:
        try:
            float(trim_left_side)
        except Exception as e:
            error_message = 'You need to include a numeric value for the "trim_left_side" option'
            abort(400, description=error_message)
        
        if float(trim_left_side) < 0 or float(trim_left_side) > total_seconds:
            error_message = f'The "trim_left_side" option must be between 0 and total record duration ({total_seconds})!'
            abort(400, description=error_message)

    if not trim_right_side:
        trim_right_side = total_seconds
    else:
        try:
            float(trim_right_side)
        except Exception as e:
            error_message = 'You need to include a numeric value for the "trim_right_side" option'
            abort(400, description=error_message)
        
        if float(trim_right_side) <= 0 or float(trim_right_side) > total_seconds:
            error_message = f'The "trim_right_side" option must be between 0 and total record duration ({total_seconds})!'
            abort(400, description=error_message)

    # a constraint about the trim
    if float(trim_left_side) >= float(trim_right_side):
        error_message = 'The left side cannot be greater or equal to the right side!'
        abort(400, description=error_message)

    
    # trim the mseed file
    try:
        mseed_data.trim(starttime=starttime+float(trim_left_side), endtime=starttime+float(trim_right_side))
    except Exception as e:
        error_message = str(e)
        abort(400, description=error_message)
                                
    # write the detrended file to the processed mseed file
    mseed_data.write(mseed_processed_file_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(mseed_data)

    return json_data


@bp.route("/delete-applied-filter", methods=["GET"])
def delete_filter():

    # get the initial raw mseed file path
    mseed_save_file_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], str(session.get("user_id", "test")) + "_signal-processing.mseed")

    # get the file path of the processed mseed
    mseed_processed_file_path = os.path.join(current_app.config['DATA_FILES_FOLDER'], "processed_" + str(session.get("user_id", "test")) + "_signal-processing.mseed")

    # get the inirial uploaded mseed file to re-apply the current filters that the user has
    mseed_data = read(mseed_save_file_path)
    starttime = mseed_data[0].stats.starttime

    # get the concatenated string that has all the current filters to re-apply them to the initial uploaded mseed file   
    filter_string = request.args.get('filter')

    # get all the filters
    all_filters = filter_string.split()

    # try to apply again at the initial uploaded filter, all the current filters according to the text of every filter or pill label
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
    
    # re-write the processed file but with the new pills now  (WE DONT MODIFY THE INITIAL UPLOADED MSEED)
    mseed_data.write(mseed_processed_file_path)
    
    json_data = convert_mseed_to_json(mseed_data)
    return json_data
