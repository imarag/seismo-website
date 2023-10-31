from flask import Blueprint, current_app, render_template, abort, request, jsonify, session, send_file
import os
import numpy as np
from obspy.core import read, UTCDateTime
from obspy.core.trace import Trace
from obspy.core.stream import Stream
from .functions import convert_mseed_to_json, raise_error, validate_seismic_file

bp = Blueprint('BP_pick_arrivals', __name__, url_prefix = '/pick-arrivals')


def create_path(name):
    path = os.path.join(
        current_app.config['DATA_FILES_FOLDER'], 
        str(session.get("user_id", "test")) + "_" + name
        )
    return path


@bp.route('/upload-seismic-file', methods=['POST'])
def upload():
    # get the files (in our case just one)
    files = request.files

    # check if file exists
    if 'file' not in files or len(files) < 1:
        error_message = "No file uploaded!"
        return raise_error(error_message)

    # Get the uploaded file from the request
    seismic_file = files['file']

    try:
        stream = read(seismic_file)
    except Exception as e:
        error_message = str(e)
        return raise_error(error_message)

    stream_validation_message = validate_seismic_file(stream)

    if stream_validation_message != 'ok':
        return raise_error(stream_validation_message)

    # get the file path to save the uploaded file as miniseed in the server
    mseed_file_save_path = create_path('pick-arrivals-tool-stream.mseed')  

    # write the uploaded file
    stream.write(mseed_file_save_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(stream)

    return json_data


@bp.route("/apply-filter", methods=["GET"])
def apply_filter():

    # get the filter value
    filter_value = request.args.get('filter')

    # get the mseed file path on the server
    mseed_file_path = create_path('pick-arrivals-tool-stream.mseed') 

    # read it
    mseed_data = read(mseed_file_path)
    
    # according to the filter value, apply a filter to it
    # if the filter is "initial" then don't do any filter, just return the raw values
    if filter_value != 'initial':

        freqmin = filter_value.split('-')[0].strip()
        freqmax = filter_value.split('-')[1].strip()

        if freqmin:
            try:
                # try to convert it to float
                freqmin = float(freqmin)
            except Exception as e:
                error_message = "Frequency values should be numeric (float or int)."
                return raise_error(error_message + " " + str(e))
            
            if np.isnan(freqmin):
                error_message = "Frequency values should be numeric (float or int)."
                return raise_error(error_message + " " + str(e))

            if freqmin < 0.01 or freqmin > 99:
                error_message="The acceptable left filter range is from 0.01 to 99 Hz!"
                return raise_error(error_message)

        if freqmax:
            try:
                # try to convert it to float
                freqmax = float(freqmax)
            except Exception as e:
                error_message = "Frequency values should be numeric (float or int)."
                return raise_error(error_message)
            
            if np.isnan(freqmax):
                error_message = "Frequency values should be numeric (float or int)."
                return raise_error(error_message)
            
            if freqmax < 0.02 or freqmax > 100:
                error_message="The acceptable right filter range is from 0.02 to 100 Hz!"
                return raise_error(error_message)
        
        # if freqmin is greater than the freqmax abort
        if freqmin and freqmax and freqmin >= freqmax:
            error_message = 'The left filter cannot be greater or equal to the right filter!'
            return raise_error(error_message)
            
        try:
            # if freqmin exists and not freqmax
            if freqmin and not freqmax:
                mseed_data.filter("highpass", freq=freqmin)

            # elif freqmin does not exist but freqmax exists
            elif not freqmin and freqmax:
                mseed_data.filter("lowpass", freq=freqmax)

            # if neither freqmin nor freqmax exists, do nothing (return the initial unfiltered values)
            elif not freqmin and not freqmax:
                pass

            # if both are defined (freqmin and freqmax)
            else:
                mseed_data.filter("bandpass", freqmin=freqmin, freqmax=freqmax)

        except Exception as e:
            error_message = str(e)
            return raise_error(error_message)

    json_data = convert_mseed_to_json(mseed_data)

    return json_data
    


@bp.route("/save-arrivals", methods=["GET"])
def save_arrivals():
    
    Parr = str(request.args.get('Parr')).strip()
    Sarr = str(request.args.get('Sarr')).strip()

    # check if the Parr and Sarr exist and create a dict_arrivals dict accordingly
    if Parr == "null" and Sarr == "null":
        error_message = "You need to select at least one wave arrival to use this option!"
        return raise_error(error_message)
    elif Parr != "null" and Sarr == "null":
        dict_arrivals = {"P": float(Parr)}
    elif Parr == "null" and Sarr != "null":
        dict_arrivals = {"S": float(Sarr)}
    else:
        dict_arrivals = {"P": float(Parr), "S": float(Sarr)}

    # get the mseed file path and the parent of the mseed file path
    # i am going to create a txt file and save it in than parent
    mseed_file_path = create_path('pick-arrivals-tool-stream.mseed') 
    mseed_file_parent = os.path.dirname(mseed_file_path)

    # read the mseed
    st = read(mseed_file_path)

    # get some seismic info
    station = st[0].stats.station
    starttime = st[0].stats.starttime

    # create the txt file path from the date and time and station and save it in the previous parent
    arrivals_file_name = str(starttime.date) + "_" + str(starttime.time) + "_" + station + ".txt"
    arrivals_file_name = arrivals_file_name.replace(":", "").replace("-", "")
    arrivals_file_path = os.path.join(mseed_file_parent, arrivals_file_name)
    
    # write the file to the parent
    with open(arrivals_file_path, "w") as fw:
        for pick_label in dict_arrivals:
            fw.write(pick_label + "arr ")
        fw.write("\n")

        for pick_label in dict_arrivals:
            fw.write(str(dict_arrivals[pick_label]) + " ")
        fw.write("\n")
    
    # return the file. The download name does not matter. I will use the dummy paragraph that i created
    # later in the javascript
    return send_file(
        arrivals_file_path, 
        mimetype=None, 
        as_attachment=True, 
        download_name=arrivals_file_name
    )
            