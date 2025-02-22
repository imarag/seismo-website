import os
from obspy.core import read, UTCDateTime, Trace, Stream
import uuid
import numpy as np
from pathlib import Path
import json
from obspy.geodetics import gps2dist_azimuth
from utils import RequestHandler
from models import *
from tempfile import SpooledTemporaryFile

def compute_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the distance in kilometers between two geographic points."""
    result = gps2dist_azimuth(lat1, lon1, lat2, lon2)[0] / 1000
    result = round(result, 3)
    return result

def read_mseed_file_bytes(seismic_file_bytes: SpooledTemporaryFile) -> Stream:
    """Reads the given seismic file bytes and returns a Stream object."""
    stream = read(seismic_file_bytes)
    return stream


def write_json_to_file(data: list|dict, path: Path):
    """Helper function to write JSON data to a file."""
    with open(path, "w") as fw:
        json.dump(data, fw)

def write_txt_to_file(data: list|dict, path: Path):
    """Helper function to write text data to a file."""
    with open(path, "w") as fw:
        json_string = json.dumps(data)
        fw.write(json_string)

def write_mseed_to_file(data: list, path: Path):
    """Helper function to write miniseed data to a file."""
    stream = convert_traces_to_stream(data)
    stream.write(path)

def validate_seismic_file(stream: Stream) -> None:
    """Validate the input stream object"""
    traces = stream.traces 

    if len(traces) == 0:
        error_message = f"The stream provided is empty. There are no traces!"
        RequestHandler.send_error(error_message, 404)
        
    if not any([len(tr.data) for tr in traces]): # if all data in traces is empty (npts=0)
        error_message = "The traces have no data samples. The traces are empty!"
        RequestHandler.send_error(error_message, 404)
    
    for tr in traces:
        if tr.stats.npts > 500000:  # for performance issues
            error_message = "One or more of the traces inside the stream, contain an exceptionally large number of sampling points (npts > 300000). Consider trimming it before uploading it!"
            RequestHandler.send_error(error_message, 404)
        

def get_record_name(stream: Stream) -> str:
    """Generate a record name from the first trace in the stream"""
    first_trace = stream.traces[0]
    starttime = first_trace.stats["starttime"]
    station = first_trace.stats["station"]

    if not station: # add the code "STATION" in case of empty station code, for consistency
        station = "STATION"

    rec_name = starttime.date.isoformat() + "_" + starttime.time.isoformat() + "_" + station
    rec_name = rec_name.replace(":", "").replace("-", "")
    return rec_name


def convert_stream_to_traces(stream: Stream) -> list[dict]:
    """Extract the data from the mseed file into a list of traces (dictionaries)"""
    
    traces_data_list = []

    for index, tr in enumerate(stream.traces):
        tr_stats = dict(tr.stats)
        
        if not tr_stats["channel"].strip():
            tr_stats["channel"] = f"C{index+1}"

        traces_data_list.append(
            {
                "trace_id": str(uuid.uuid4()),
                "ydata": tr.data.tolist(),
                "xdata": tr.times().tolist(),
                "stats": {
                    "starttime": tr_stats["starttime"].datetime,
                    "endtime": tr_stats["endtime"].datetime,
                    "station": tr_stats["station"],
                    "npts": tr_stats["npts"],
                    "sampling_rate": tr_stats["sampling_rate"],
                    "channel": tr_stats["channel"],
                    "start_date": tr_stats["starttime"].datetime.date(),
                    "start_time": tr_stats["starttime"].datetime.time(),
                    "duration": tr_stats["endtime"] - tr_stats["starttime"],
                    "record_name": get_record_name(stream)
                }
            }
        )
    return traces_data_list


def convert_traces_to_stream(trace_list: list) -> Stream:
    """Construct a Stream object from the list of traces"""

    traces = []
    for tr in trace_list:
        header = tr["stats"]
        header["starttime"] = UTCDateTime(header["starttime"])
        header["endtime"] = UTCDateTime(header["endtime"])

        trace = Trace(data=np.array(tr["ydata"]), header=header)
        traces.append(trace)
    
    return Stream(traces=traces)


def trim_trace(trim_params: TrimParams) -> list[dict]:
    """Trim a single trace based on the given parameters."""
    return_data_list = []
    for tr_dict in trim_params.data:
        try:
            tr = Trace(data=np.array(tr_dict.values), header={"sampling_rate": trim_params.options.sampling_rate})
            starttime = tr.stats.starttime
            tr.trim(
                starttime=starttime + trim_params.options.trim_start, 
                endtime=starttime + trim_params.options.trim_end, 
            )
        except Exception as e:
            error_message = f"Cannot trim the waveforms: {str(e)}"
            RequestHandler.send_error(error_message, 500)
        return_data_list.append({"trace_id": tr_dict.trace_id, "values": tr.data.tolist()})
    return return_data_list
  
def taper_trace(taper_params: TaperParams) -> list[dict]:
    """taper a single trace based on the given parameters."""
    return_data_list = []
    for tr_dict in taper_params.data:
        try:
            tr = Trace(data=np.array(tr_dict.values), header={"sampling_rate": taper_params.options.sampling_rate})
            starttime = tr.stats.starttime
            tr.taper(
                None,
                type=taper_params.options.taper_type,
                side=taper_params.options.taper_side,
                max_length=taper_params.options.taper_length
            )
        except Exception as e:
            error_message = f"Cannot taper the waveforms: {str(e)}"
            RequestHandler.send_error(error_message, 500)
        return_data_list.append({"trace_id": tr_dict.trace_id, "values": tr.data.tolist()})
    return return_data_list

def detrend_trace(detrend_params: DetrendParams) -> list[dict]:
    """detrend a single trace based on the given parameters."""
    return_data_list = []
    for tr_dict in detrend_params.data:
        try:
            tr = Trace(data=np.array(tr_dict.values), header={"sampling_rate": detrend_params.options.sampling_rate})
            starttime = tr.stats.starttime
            tr.detrend(
                type=detrend_params.options.detrend_type,
            )
        except Exception as e:
            error_message = f"Cannot detrend the waveforms: {str(e)}"
            RequestHandler.send_error(error_message, 500)
        return_data_list.append({"trace_id": tr_dict.trace_id, "values": tr.data.tolist()})
    return return_data_list


def filter_trace(filter_params: FilterParams) -> list[dict]:
    """filter a single trace based on the given parameters."""
    return_data_list = []
    for tr_dict in filter_params.data:
        try:
            tr = Trace(data=np.array(tr_dict.values), header={"sampling_rate": filter_params.options.sampling_rate})
            starttime = tr.stats.starttime
            if filter_params.options.freq_min is None and filter_params.options.freq_max is not None:
                tr.filter("lowpass", freq=filter_params.options.freq_max)
            elif filter_params.options.freq_min is not None and filter_params.options.freq_max is None:
                tr.filter("highpass", freq=filter_params.options.freq_min)
            elif filter_params.options.freq_min is not None and filter_params.options.freq_max is not None:
                tr.filter(
                    "bandpass",
                    freqmin=filter_params.options.freq_min,
                    freqmax=filter_params.options.freq_max,
                )
            
        except Exception as e:
            error_message = f"Cannot filter the waveforms: {str(e)}"
            RequestHandler.send_error(error_message, 500)
        return_data_list.append({"trace_id": tr_dict.trace_id, "values": tr.data.tolist()})
    return return_data_list


def compute_fourier_spectra(fourier_params: FourierParams) -> list[dict]:
    """Compute the fourier spectra at a trace based on the given parameters."""
    return_data_list = []
    for tr_dict in fourier_params.traces_data:
        component = tr_dict.component
        data = tr_dict.values
        npts = len(data)
        sl = int(npts / 2)
        sampling_rate = fourier_params.sampling_rate
        fnyq = sampling_rate / 2
        dt = 1 / sampling_rate
        fas_freqs = np.linspace(0, fnyq, sl)
        fft_data = np.fft.fft(data[:npts])
        fft_data_abs = dt * np.abs(fft_data)[0:sl]
        return_data_list.append({"trace_id": tr_dict.trace_id, "component": component, "fas_freqs": fas_freqs[1:].tolist(), "fas_amps": fft_data_abs[1:].tolist()})
    
    return return_data_list
   
def compute_hvsr_spectra(hvsr_params: HVSRParams) -> list[float]:
    """Compute the hvsr spectra at a trace based on the given parameters."""
    horizontal_traces = []
    vertical_trace = None

    for fourier_dict in hvsr_params.fourier_data:
        component = fourier_dict.component

        if component == "vertical":
            vertical_trace = np.array(np.array(fourier_dict.values))
        else:
            horizontal_traces.append(np.array(fourier_dict.values))

    if len(horizontal_traces) not in [1, 2]: 
        error_message = "You have to provide a single or two horizontal components!"
        RequestHandler.send_error(error_message, 404)
        
    if vertical_trace is None: 
        error_message = "You have to provide a vertical component!"
        RequestHandler.send_error(error_message, 404)
    
    if len(horizontal_traces) == 1:
        horizontal_fourier = horizontal_traces[0]
        hvsr = horizontal_fourier / vertical_trace
    else:
        mean_horizontal_fourier = np.sqrt(
            (horizontal_traces[0] ** 2 + horizontal_traces[1] ** 2) / 2
        )

        hvsr = mean_horizontal_fourier / vertical_trace

    return_hvsr = np.nan_to_num(hvsr)
    return return_hvsr.tolist()
    
    
   






# @router.post("/compute-fourier")
# def compute_fourier2(fourier_params_body: FourierParams) -> dict[str, dict]:

#     mseed_data = convert_traces_to_stream(fourier_params_body.traces)
#     # initialize the output data dict
#     data_dict_output = {}
   

#     # get the first trace
#     first_trace = mseed_data.traces[0]

#     # get some information of the stream object
#     starttime = first_trace.stats.starttime

#     # i will save here the traces
#     fourier_data_dict = {}
   
#     # loop through the uploaded traces
#     for i in range(len(mseed_data)):
#         # get the trace name and add it to the fourier_data_dict
#         trace_label = f"trace-{i}"
#         fourier_data_dict[trace_label] = {"signal": None, "noise": None}

#         # get a copy of the trace for the singal
#         trace_signal = mseed_data.traces[i].copy()

#         # get the current trace channel
#         channel = trace_signal.stats.channel

#         try:
#             # trim the waveform between the user selectd window
#             signal_trace_trimmed = trim_trace(
#                 trace_signal, 
#                 starttime + fourier_params_body.signal_window_left_side,
#                 starttime + fourier_params_body.signal_window_left_side + fourier_params_body.window_length
#             )
#         except Exception as e:
#             error_message = str(e)
#             raise HTTPException(status_code=404, detail=error_message)
        
#         try:
#             # compute the fourier
#             fft_freq, fft_signal_data = compute_fourier_spectra(signal_trace_trimmed)
#         except Exception as e:
#             error_message = str(e)
#             raise HTTPException(status_code=404, detail=error_message)
        
#         # create a dictionary for the signal
#         fourier_data_dict[trace_label]["signal"] = {
#             "xdata": fft_freq.tolist(),
#             "ydata": fft_signal_data.tolist(),
#             "channel": channel,
#         }

#         # if the user also added the noise
#         if fourier_params_body.noise_window_right_side is not None:
#             # get a copy of the trace for the noise
#             noise_signal = mseed_data.traces[i].copy()

#             try:
#                 # trim the waveform between the user selectd window
#                 noise_trace_trimmed = trim_trace(
#                     noise_signal, 
#                     starttime + fourier_params_body.noise_window_right_side - fourier_params_body.window_length,
#                     starttime + fourier_params_body.noise_window_right_side
#                 )
#             except Exception as e:
#                 error_message = str(e)
#                 raise HTTPException(status_code=404, detail=error_message)

#             try:
#                 # compute the fourier
#                 fft_freq, fft_noise_data = compute_fourier_spectra(noise_trace_trimmed)
#             except Exception as e:
#                 error_message = str(e)
#                 raise HTTPException(status_code=404, detail=error_message)
    
#             fourier_data_dict[trace_label]["noise"] = {
#                 "xdata": fft_freq.tolist(),
#                 "ydata": fft_noise_data.tolist(),
#                 "channel": channel,
#             }

#     data_dict_output["fourier"] = fourier_data_dict

    
#     # just initialize the horizontal and vertical parameters
#     horizontal_traces = []
#     vertical_traces = None

#     # loop through the mseed data
#     for trace_label in fourier_data_dict:
#         # get the channel
#         channel = fourier_data_dict[trace_label]["signal"]["channel"]

#         # get the signal and noise dict
#         signal_dict = fourier_data_dict[trace_label]["signal"]
#         noise_dict = fourier_data_dict[trace_label]["noise"]

#         # if you find the vertical component (the one that the user specified) then set the data to the vertical_traces parameter
#         if channel == fourier_params_body.vertical_component:
#             vertical_traces = np.array(noise_dict["ydata"])
#         else:
#             horizontal_traces.append(np.array(signal_dict["ydata"]))

#         hvsr_freq = signal_dict["xdata"]
#     # calculate the average horizontal fourier and the hvsr depending on if we have one or two horizontals
#     if len(horizontal_traces) == 1:
#         horizontal_fourier = horizontal_traces[0]
#         hvsr = horizontal_fourier / vertical_traces
#     else:
#         mean_horizontal_fourier = np.sqrt(
#             (horizontal_traces[0] ** 2 + horizontal_traces[1] ** 2) / 2
#         )
#         hvsr = mean_horizontal_fourier / vertical_traces

#     # create a dictionary to save the hvsr data
#     hvsr_data_dict = {"xdata": list(hvsr_freq), "ydata": list(hvsr)}

#     data_dict_output["hvsr"] = hvsr_data_dict

#     return data_dict_output

