from flask import Blueprint, current_app, render_template, abort, request, jsonify, session, send_file, url_for
import os
import re
from obspy.core import read, UTCDateTime
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np
import pandas as pd
import datetime
from .functions import get_record_name, raise_error, validate_seismic_file


bp = Blueprint('BP_edit_seismic_file', __name__, url_prefix = '/edit-seismic-file')


def create_path(name):
    path = os.path.join(
        current_app.config['DATA_FILES_FOLDER'], 
        str(session.get("user_id", "test")) + "_" + name
        )
    return path

def convert_mseed_to_json(stream):
    traces_data_dict = {}
    first_trace = stream[0]
    starttime = first_trace.stats["starttime"]
    fs = float(first_trace.stats["sampling_rate"])
    station = first_trace.stats["station"]
    if not station:
        station = 'STATION'
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
                'channel': trace.stats["channel"],
                'npts': trace.stats["npts"],
                'sampling_rate': trace.stats["sampling_rate"],
                'station': trace.stats["station"],
                'date': trace.stats["starttime"].date.isoformat(),
                'time': trace.stats["starttime"].time.isoformat()
            },
            }
        traces_data_dict[f'trace-{n}'] = trace_data
    return jsonify(traces_data_dict)



@bp.route('/upload-seismic-file', methods=['POST'])
def upload():
    # get the files
    files = request.files

    # check if file exists
    if 'file' not in files or len(files) < 1:
        error_message = 'No file uploaded!'
        return raise_error(error_message)

    # Get the uploaded file from the request
    seismic_file = files['file']

    # try to read the seimsic file
    try:
        stream = read(seismic_file)
    except Exception as e:
        error_message = str(e)
        return raise_error(error_message)
    
    # condition to only upload files up to 6 records because of decreased performance
    if len(stream) > 6:
        error_message = f'When uploading a seismic file, please be aware that for optimal user experience, it is recommended to limit the number of traces to 6 or fewer. Uploading a seismic file with more than 6 records may result in decreased performance and could impact your overall experience on the platform. The uploaded file contains in total {len(stream)} traces.'
        return raise_error(error_message)
    
    # if the seismic file is empty then error
    if len(stream) == 0:
        error_message = 'The uploaded seismic file is empty. There are no records in the file!'
        return raise_error(error_message)

    # get the file path to save the uploaded file as miniseed in the server
    seismic_file_save_path = create_path('edit-seismic-file-tool-stream.mseed')  

    # write the uploaded file as mseed
    stream.write(seismic_file_save_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(stream)
    
    return json_data


@bp.route('/update-header', methods=['GET'])
def update_header():
    # get the fetch request query parameters
    station = request.args.get('station')
    date = request.args.get('date')
    time = request.args.get('time')
    sampling_rate = request.args.get('sampling_rate')
    npts = request.args.get('npts')
    components = request.args.get('components')

    # read the uploaded seismic file
    seismic_file = create_path('edit-seismic-file-tool-stream.mseed')  
    
    # try to read the seimsic file
    try:
        st = read(seismic_file)
    except Exception as e:
        error_message = str(e)
        return raise_error(error_message)

    # if the station exists, then strip for blanks left and right and replace all spaces 
    # between the characters to empty string
    station = station.strip()
    if station:
        station = "".join(station.split())
        if len(station) > 8 or len(station) < 2:
            error_message = 'The station name must contain 2 up to 8 characters or numbers!'
            return raise_error(error_message)
        
    date = date.strip()
    time = time.strip()

    if not date:
        date = "1970-01-01"
    if not time:
        time = "00:00:00"

    try:
        starttime = UTCDateTime(date + " " + time)
    except Exception as e:
        error_message = 'This is not a valid date or time. The date input must be in the form: e.g., 2015-07-24 and the time format: e.g., 09:58:49'
        return raise_error(error_message)

    # convert sampling rate to float and npts to int
    sampling_rate = float(sampling_rate)
    npts = int(npts)

    components = components.strip()
    # if the user didnt fill the components field, put some default values
    if not components:
        compos = [f'ch{i}' for i in range(len(st))]
    else:
        components = "".join(components.split())
        compos = components.split(",")
        compos = [cp.upper() for cp in compos]

        if len(compos) != len(st):
            error_message = 'The number of the components inserted at the "components" field, does not match the number of traces present in the seismic file. Please ensure that you input the same number of components as there are traces, separated by commas.'
            return raise_error(error_message)

        for cp in compos:
            if not re.search("^[A-Z0-9]{1,4}$", cp):
                error_message = 'These are not valid components. Each component must contain 1 up to 4 characters (A-Z) or numbers (0-9)! Then, separate each component using comas e.g., E,N,Z or X,Y or N,V,T or E1,E2,Z'
                return raise_error(error_message)

    for i in range(len(st)):
        tr = st[i]
        tr.stats['station'] = station
        tr.stats['starttime'] = starttime
        tr.stats['channel'] = compos[i]

    updated_stream  = create_path('edit-seismic-file-tool-stream.mseed')
    st.write(updated_stream)
    return jsonify({"update":"succesful"})
    




@bp.route('/download-file', methods=['GET'])
def download_file():
    # get the updated stream
    updated_stream = create_path('edit-seismic-file-tool-stream.mseed')
   
    # return it
    return send_file(
        updated_stream,
        as_attachment=True,
        download_name=get_record_name(updated_stream) + '.mseed'
    )


@bp.route('/download-data', methods=['GET'])
def download_data():
    seismic_file = create_path('edit-seismic-file-tool-stream.mseed')  
    # try to read the seimsic file
    try:
        stream = read(seismic_file)
    except Exception as e:
        error_message = str(e)
        return raise_error(error_message)
    
    # create an empty dataframe to put the data
    df = pd.DataFrame()

    # loop through the stream and put the data in columns with names the trace channels
    for i, tr in enumerate(stream, start=1):
        # get the channel
        channel = tr.stats.channel
        # if there is not channel then name it ch and the index i
        if not channel:
            channel = f'ch{i}'
        # get the data
        data_values = tr.data
        # add the data as a column to the dataframe
        df[channel] = data_values
    
    # create a csv path to save the pandas dataframe as csv file
    csv_path = create_path('edit-seismic-file-tool-csv.csv')
    
    # save the csv file
    df.to_csv(csv_path, index=None)

    # return the saved file
    return send_file(
        csv_path,
        as_attachment=True,
        download_name=get_record_name(seismic_file) + '.csv'
    )
