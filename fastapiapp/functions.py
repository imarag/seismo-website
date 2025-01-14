from fastapi import HTTPException
import os
from obspy.core import read, UTCDateTime, Trace, Stream
import uuid
import numpy as np
from models import *

def validate_seismic_file(stream: Stream) -> None:
    """Validate the input stream object"""

    traces = stream.traces 

    if len(traces) == 0:
        error_message = f"The stream provided is empty. There are no traces!"
        raise HTTPException(status_code=404, detail=error_message)
        
    if not any([len(tr.data) for tr in traces]): # if all data in traces is empty (npts=0)
        error_message = "The traces have no data samples. The traces are empty!"
        raise HTTPException(status_code=404, detail=error_message)
    
    for tr in traces:
        if tr.stats.npts > 500000:  # for performance issues
            error_message = "One or more of the traces inside the stream, contain an exceptionally large number of sampling points (npts > 300000). Consider trimming it before uploading it!"
            raise HTTPException(status_code=404, detail=error_message)
        

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


def convert_stream_to_traces(stream: Stream) -> StreamData:
    """Extract the data from the mseed file into a list of traces (dictionaries)"""
    
    traces_data_list = []

    for tr in stream.traces:
        tr_stats = dict(tr.stats)

        trace_stats = TraceStats(
            starttime = tr_stats["starttime"].datetime,
            endtime = tr_stats["endtime"].datetime,
            npts = tr_stats["npts"], 
            sampling_rate = tr_stats["sampling_rate"], 
            station = tr_stats["station"], 
            channel = tr_stats["channel"],
            start_date = tr_stats["starttime"].datetime.date(),
            start_time = tr_stats["starttime"].datetime.time(),
            duration = tr_stats["endtime"] - tr_stats["starttime"]
        )

        trace_data = TraceData(
            record_name = get_record_name(stream),
            ydata = tr.data.tolist(),
            xdata = tr.times().tolist(),
            id = str(uuid.uuid4()),
            stats = trace_stats
        )

        traces_data_list.append(trace_data)

    return StreamData(traces=traces_data_list)


def convert_traces_to_stream(trace_list: list) -> Stream:
    """Construct a Stream object from the list of traces"""

    traces = []
    for tr in trace_list:
        header = tr["stats"]
        header["starttime"] = UTCDateTime(header["starttime"])

        trace = Trace(data=np.array(tr["ydata"]), header=header)
        traces.append(trace)
    
    return Stream(traces=traces)


def trim_trace(trim_params: TrimParams) -> list[float]:
    """Trim a single trace based on the given parameters."""

    seismic_data = trim_params.seismic_data
    try:
        if isinstance(seismic_data, TrimParamsObject):
            tr = Trace(data=np.array(seismic_data.values), header={"sampling_rate": seismic_data.sampling_rate})
            starttime = tr.stats.starttime
            trimmed_tr = tr.copy().trim(
                starttime=starttime + seismic_data.left_trim, 
                endtime=starttime + seismic_data.right_trim, 
            )
            return trimmed_tr.data.tolist()
        
        elif isinstance(seismic_data, list):
            all_traces_data = []
            for tr_dict in seismic_data:
                tr = Trace(data=np.array(tr_dict.values), header={"sampling_rate": tr_dict.sampling_rate})
                starttime = tr.stats.starttime
                trimmed_tr = tr.copy().trim(
                    starttime=starttime + tr_dict.left_trim, 
                    endtime=starttime + tr_dict.right_trim, 
                )
                all_traces_data.append(trimmed_tr.data.tolist())
        return all_traces_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def taper_trace(taper_params: TaperParams) -> list[float]:
    """Taper a single trace based on the given parameters."""

    seismic_data = taper_params.seismic_data
    try:
        if isinstance(seismic_data, TaperParamsObject):
            tr = Trace(data=np.array(seismic_data.values), header={"sampling_rate": seismic_data.sampling_rate})
            tapered_tr = tr.copy().taper(
                type=seismic_data.taper_type,
                side=seismic_data.taper_side,
                max_length=seismic_data.taper_length
            )
            return tapered_tr.data.tolist()
        
        elif isinstance(seismic_data, list):
            all_traces_data = []
            for tr_dict in seismic_data:
                tr = Trace(data=np.array(tr_dict.values), header={"sampling_rate": tr_dict.sampling_rate})
                tapered_tr = tr.copy().taper(
                    type=tr_dict.taper_type,
                    side=tr_dict.taper_side,
                    max_length=tr_dict.taper_length
                )   
                all_traces_data.append(tapered_tr.data.tolist())
        return all_traces_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

def detrend_trace(detrend_params: DetrendParams) -> list[float]:
    """Detrend a single trace based on the given parameters."""

    seismic_data = detrend_params.seismic_data
    try:
        if isinstance(seismic_data, DetrendParamsObject):
            tr = Trace(data=np.array(seismic_data.values), header={"sampling_rate": seismic_data.sampling_rate})
            detrended_tr = tr.copy().detrend(
                type=seismic_data.detrend_type,
            )
            return detrended_tr.data.tolist()
        
        elif isinstance(seismic_data, list):
            all_traces_data = []
            for tr_dict in seismic_data:
                tr = Trace(data=np.array(tr_dict.values), header={"sampling_rate": tr_dict.sampling_rate})
                detrended_tr = tr.copy().detrend(
                    type=tr_dict.detrend_type,
                )   
                all_traces_data.append(detrended_tr.data.tolist())
        return all_traces_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_filter_type(freqmin: float | None, freqmax: float | None) -> str:
    if freqmin is None and freqmax is not None:
        return "lowpass"
    elif freqmin is not None and freqmax is None:
        return "highpass"
    else:
        return "bandpass"

def filter_trace(filter_params: FilterParams) -> list[float]:
    """Filter a single trace based on the given parameters."""
    
    seismic_data = filter_params.seismic_data
    try:
        if isinstance(seismic_data, FilterParamsObject):
            tr = Trace(data=np.array(seismic_data.values), header={"sampling_rate": seismic_data.sampling_rate})
            filtered_tr = tr.copy().filter(
                get_filter_type(seismic_data.left_filter, seismic_data.right_filter),
                freqmin=seismic_data.left_filter,
                freqmax=seismic_data.right_filter,
            )
            return filtered_tr.data.tolist()
        
        elif isinstance(seismic_data, list):
            all_traces_data = []
            for tr_dict in seismic_data:
                tr = Trace(data=np.array(tr_dict.values), header={"sampling_rate": tr_dict.sampling_rate})
                filtered_tr = tr.copy().filter(
                    get_filter_type(tr_dict.left_filter, tr_dict.right_filter),
                    freqmin=tr_dict.left_filter,
                    freqmax=tr_dict.right_filter,
                )
                all_traces_data.append(filtered_tr.data.tolist())
        return all_traces_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))










    




# def trim_trace(tr: Trace, left: int | float, right: int | float) -> Trace:
#     tr_copy = tr.copy()
#     tr_copy.trim(starttime=left, endtime=right)
#     return tr_copy

def compute_fourier_spectra(tr: Trace) -> tuple[np.ndarray, np.ndarray]:
    
    # get the npts after the trim
    npts = tr.stats["npts"]

    # calculate the number of frequncies on the frequency spectra
    sl = int(npts / 2)

    # get the sampling frequency
    fs = tr.stats.sampling_rate

    # get the nyquist frequency
    fnyq = fs / 2

    # get the sampling distance
    dt = tr.stats.delta

    # calculate the frequnecy array to plot the fourier
    freq = np.linspace(0, fnyq, sl)

    # compute the fft of the signal
    tr_fft = np.fft.fft(tr.data[:npts])

    # compute the absolute value
    tr_fft_abs = dt * np.abs(tr_fft)[0:sl]

    return (freq, tr_fft_abs)
   

def delete_file(file_path: str):
    """Delete a file from the server."""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted file: {file_path}")
    except Exception as e:
        print(f"Error deleting file: {e}")