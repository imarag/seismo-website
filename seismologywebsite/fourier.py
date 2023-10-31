from flask import Blueprint, current_app, render_template, abort, request, jsonify, session, send_file, make_response
import os
from obspy.core import read
from obspy.core.trace import Trace
from obspy.core.stream import Stream
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from .functions import convert_mseed_to_json, get_record_name, raise_error, validate_seismic_file

bp = Blueprint('BP_fourier_spectra', __name__, url_prefix = '/fourier-spectra')


def create_path(name):
    path = os.path.join(
        current_app.config['DATA_FILES_FOLDER'], 
        str(session.get("user_id", "test")) + "_" + name
        )
    return path


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

    stream_validation_message = validate_seismic_file(stream)

    if stream_validation_message != 'ok':
        return raise_error(stream_validation_message)

    # get the file path to save the uploaded file as miniseed in the server
    mseed_file_save_path = create_path('fourier-spectra-tool-stream.mseed')  

    # write the uploaded file as mseed
    stream.write(mseed_file_save_path)

    # convert the uploaded mseed file to json
    json_data = convert_mseed_to_json(stream)
    
    return json_data



@bp.route('/compute-fourier', methods=['GET'])
def compute_fourier():

    # initialize a total dicitonary to return
    return_dict = {}

    # get the saved mseed file path
    mseed_file_path = create_path('fourier-spectra-tool-stream.mseed') 

    # create a path to save the fourier data
    fourier_data_csv_path = create_path('fourier-spectra-tool-fourier-data.csv') 

    # create a path to save the fourier data graph
    fourier_data_graph_path = create_path('fourier-spectra-tool-fourier-data-graph.png') 

    # create a path to save the hvsr data
    hvsr_data_csv_path = create_path('fourier-spectra-tool-hvsr-data.csv') 

    # create a path to save the hvsr data graph
    hvsr_data_graph_path = create_path('fourier-spectra-tool-hvsr-data-graph.png') 
    
    # read it
    mseed_data = read(mseed_file_path)

    # get the first trace
    first_trace = mseed_data[0]

    # get some information of the stream object
    starttime = first_trace.stats.starttime
    total_duration = first_trace.stats.endtime - first_trace.stats.starttime
    fs = first_trace.stats["sampling_rate"]
    dt = first_trace.stats["delta"]

    # calculate the nyquist frequency
    fnyq = fs / 2
    
    # get the user selected window parameters
    signal_window_left_side = request.args.get('signal-window-left-side')
    noise_window_right_side = request.args.get('noise-window-right-side')
    window_length = request.args.get('window-length')
    noise_selected = request.args.get('noise-selected')
    calculate_hvsr_data = request.args.get('calculate-hvsr-data')
    vertical_component = request.args.get('vertical-component')

    # initialize an empty error message
    error_message = None
    if float(signal_window_left_side) + float(window_length) >= total_duration:
        error_message = 'The signal window must ends before the end time of the time series! Consider reducing the window length or moving the left side of the signal window, to the left!'
    elif float(signal_window_left_side) < 0:
        error_message = 'The signal window must start after the start time of the time series! Consider moving the left side of the signal window to the right, so that it is inside the graph area!'
    elif noise_selected == 'true' and float(noise_window_right_side) > total_duration:
        error_message = 'The noise window must end before the end time of the time series! Consider moving the right side of the noise window to the left!'
    elif noise_selected == 'true' and float(noise_window_right_side) - float(window_length) < 0:
        error_message = 'The noise window must start after the start time of the time series! Consider reducing the noise length or moving the right side of the noise window, to the right!'
    elif float(window_length) == 0:
        error_message = 'The window length must be greater than zero!'

    if error_message:
        return raise_error(error_message)

    # i will save here the traces
    fourier_data_dict = {}

    # loop through the uploaded traces
    for i in range(len(mseed_data)):

        # get the trace name and add it to the fourier_data_dict
        trace_label = f'trace-{i}'
        fourier_data_dict[trace_label] = {'signal': None, 'noise': None}

        # get a copy of the trace for the singal
        df_s = mseed_data[i].copy()

        # get the current trace channel
        channel = df_s.stats.channel

        try:
            # trim the waveform between the user selectd window
            df_s.trim(starttime = starttime + float(signal_window_left_side), endtime=starttime + float(signal_window_left_side) + float(window_length))
        except Exception as e:
            error_message = str(e)
            raise_error(error_message)
        
        # get the npts after the trim
        npts = df_s.stats["npts"]

        # calculate the number of frequncies on the frequency spectra
        sl = int(npts / 2)

        # calculate the frequnecy array to plot the fourier
        freq_x = np.linspace(0 , fnyq , sl)

        try:
            # compute the fft of the signal
            yf_s = np.fft.fft(df_s.data[:npts]) 
            y_write_s = dt * np.abs(yf_s)[0:sl]
        except Exception as e:
            error_message = str(e)
            raise_error(error_message)

        # create a dictionary for the signal
        fourier_data_dict[trace_label]['signal'] = {
            'xdata': freq_x.tolist(),
            'ydata': y_write_s.tolist(),
            'channel': channel
        }

        # if the user also added the noise
        if noise_selected != 'false':
            # get a copy of the trace for the noise
            df_p = mseed_data[i].copy()

            try:
                # trim it
                df_p.trim(starttime = starttime + float(noise_window_right_side) - float(window_length), endtime=starttime + float(noise_window_right_side))
            except Exception as e:
                error_message = str(e)
                raise_error(error_message)
            
            try:
                # calculate the fourier and create the object for the noise
                yf_p = np.fft.fft(df_p.data[:npts]) 
                y_write_p = dt * np.abs(yf_p)[0:sl]
            except Exception as e:
                error_message = str(e)
                raise_error(error_message)

            fourier_data_dict[trace_label]['noise'] = {
                'xdata': freq_x.tolist(),
                'ydata': y_write_p.tolist(),
                'channel': channel
            }

    
    
    # initialize an empty dataframe
    df_fourier_data = pd.DataFrame()
    
    # add the columns below to the initialized dataframe
    df_fourier_data["freq"] = fourier_data_dict["trace-0"]["signal"]["xdata"]
    for tr in fourier_data_dict:
        channel = fourier_data_dict[tr]['signal']["channel"]
        for s_n in fourier_data_dict[tr]:
            if not fourier_data_dict[tr][s_n]:
                continue
            col_label = f"{channel}-{s_n}"
            df_fourier_data[col_label] = fourier_data_dict[tr][s_n]["ydata"]

    df_fourier_data.to_csv(fourier_data_csv_path, index=None)

    # create the graph here
    figfourier, axfourier = plt.subplots(len(fourier_data_dict), 1, figsize=(12,6))
    colors = ['#5E62FF', '#B9BBFF', '#0a0a0a', '#969595', '#b50421', '#fc8b9e']
    xdata = fourier_data_dict["trace-0"]["signal"]["xdata"]

    color_i = 0
    for n, tr in enumerate(fourier_data_dict):
        channel = fourier_data_dict[tr]['signal']["channel"]
        for s_n in fourier_data_dict[tr]:
            if not fourier_data_dict[tr][s_n]:
                continue
   
            ydata = fourier_data_dict[tr][s_n]["ydata"]
            label_name = f"{channel}-{s_n}"
            axfourier[n].plot(xdata, ydata, color=colors[color_i], lw=1, label=label_name)
            color_i += 1

        axfourier[n].legend(loc='upper left', fontsize=11, facecolor='w', title=get_record_name(mseed_file_path), title_fontsize=11)
        axfourier[n].set_xscale('log')
        axfourier[n].set_yscale('log')
        axfourier[n].set_xlabel("frequency [Hz]", fontsize=14)
        axfourier[n].grid(color='grey', ls='-', which='both', alpha=0.1)
        axfourier[n].tick_params(axis='both', which='both', labelsize=14)

    plt.tight_layout()
    figfourier.savefig(fourier_data_graph_path)

    # here i check if the user checked to calculate also the hvsr curves
    if str(calculate_hvsr_data) == 'true':

        # get only the hvsr columns calculated from the signal and not the noise
        signal_cols = [c for c in df_fourier_data.columns if 'signal' in c]

        # save the xdata somewhere
        xdata_hvsr = df_fourier_data['freq'].to_numpy()

        # get only those columns with the signal
        df_fourier_data = df_fourier_data[signal_cols]

        # just initialize the horizontal and vertical parameters
        horizontal_traces = []
        vertical_traces = None

        # loop through the mseed data
        for i, c in enumerate(df_fourier_data.columns):

            # get the channel
            channel = c.split("-")[0].lower()

            # if you find the vertical component (the one that the user specified) then set the data to the vertical_traces parameter
            if channel == vertical_component.lower():
                vertical_traces = df_fourier_data[c].to_numpy()
            else:
                horizontal_traces.append(df_fourier_data[c].to_numpy())

        # calculate the average horizontal fourier and the hvsr depending on if we have one or two horizontals
        if len(horizontal_traces) == 1:
            horizontal_fourier = horizontal_traces[0]
            hvsr = horizontal_fourier / vertical_traces
        else:
            mean_horizontal_fourier = np.sqrt((horizontal_traces[0]**2 + horizontal_traces[1]**2) / 2)
            hvsr = mean_horizontal_fourier / vertical_traces

        # create a dictionary to save the hvsr data
        hvsr_data_dict = {'xdata': list(xdata_hvsr), 'ydata': list(hvsr)}

        df_hvsr_data = pd.DataFrame({"xdata": list(xdata_hvsr), "ydata": list(hvsr)})
        df_hvsr_data.to_csv(hvsr_data_csv_path, index=None)

        fighvsr, axhvsr = plt.subplots(1, 1, figsize=(12,6))
        axhvsr.plot(xdata_hvsr, hvsr, color='blue', lw=1, label=f"HVSR")
        axhvsr.legend(title='20230405_040510_SEIS')
        axhvsr.set_xscale('log')
        axhvsr.set_yscale('log')
        axhvsr.set_xlabel("frequency [Hz]", fontsize=20)
        axhvsr.legend(loc='upper left', fontsize=15, facecolor='w', title=get_record_name(mseed_file_path), title_fontsize=15)
        axhvsr.grid(color='grey', ls='-', which='both', alpha=0.1)
        axhvsr.tick_params(axis='both', which='both', labelsize=17)
        plt.tight_layout()
        fighvsr.savefig(hvsr_data_graph_path)

        return_dict["hvsrdata"] = hvsr_data_dict
        

    # return a json response
    return_dict["fourierdata"] = fourier_data_dict
    

    json_data = jsonify(return_dict)
    return json_data
    




@bp.route('/download', methods=['GET'])
def download():
    # get the label that tells you if the user wants to downloa the data or the values
    what_output = request.args.get('what_output')

    # the "what_to_download" is either graph or data
    # the "method_selected" is fourier or hvsr
    what_to_download, method_selected = what_output.split("-")

    mseed_file_path = create_path('fourier-spectra-tool-stream.mseed') 


    if method_selected == "fourier" and what_to_download == "data":
        file_to_download = create_path('fourier-spectra-tool-fourier-data.csv') 
        name = get_record_name(mseed_file_path) + '_fourier_data' + '.csv'
    elif method_selected == "fourier" and what_to_download == "graph":
        file_to_download = create_path('fourier-spectra-tool-fourier-data-graph.png') 
        name = get_record_name(mseed_file_path) + '_fourier_graph' + '.png'
    elif method_selected == "hvsr" and what_to_download == "data":
        file_to_download = create_path('fourier-spectra-tool-hvsr-data.csv') 
        name = get_record_name(mseed_file_path) + '_hvsr_data' + '.csv'
    elif method_selected == "hvsr" and what_to_download == "graph":
        file_to_download = create_path('fourier-spectra-tool-hvsr-data-graph.png') 
        name = get_record_name(mseed_file_path) + '_hvsr_graph' + '.png'

    
    return send_file(
            file_to_download,
            as_attachment=True,
            download_name=name
        )

 