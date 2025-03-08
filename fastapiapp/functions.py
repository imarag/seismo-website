from obspy.core import read, UTCDateTime, Trace, Stream
from internals.config import logger
import numpy as np
from pathlib import Path
import json
from fastapi import HTTPException
from obspy.geodetics import gps2dist_azimuth
from models import *

def read_bytes_to_mseed(seismic_file_bytes: Any) -> Stream:
    """Reads the given seismic file bytes and returns a Stream object."""
    try:
        stream = read(seismic_file_bytes)
        return stream
    except Exception as e:
        error_message = f"Invalid seismic file. Please refer to the ObsPy 'read' function documentation for supported file types. Error: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)
    

def validate_stream(stream: Stream) -> None:
    """Validate the input stream object."""
    traces = stream.traces

    # Check if the stream is empty
    if len(traces) == 0:
        error_message = "The stream provided is empty. There are no traces!"
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)
    
    # Check if all traces have no data
    total_npts = [tr.stats.npts for tr in traces]
    if not any(total_npts):
        error_message = f"The traces have no data!"
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)
    
    # Check for large traces that might cause performance issues
    for tr in traces:
        if tr.stats.npts > 500000:  # Threshold for performance issues (tune as necessary)
            error_message = f"Trace contains an exceptionally large number of sampling points (npts > 500000). Consider trimming it before uploading!"
            logger.error(error_message)
            raise HTTPException(status_code=404, detail=error_message)
        

def convert_stream_to_traces_list(stream: Stream) -> list[dict]:
    """Extract the data from the mseed file into a list of traces (dictionaries)"""
    traces_data_list = []
    for tr in stream.traces:
        trace_stats = tr.stats
        trace_params = TraceParams(
            ydata = tr.data.tolist(),
            xdata = tr.times().tolist(),
            stats = TraceStats(**trace_stats, component = trace_stats.component)
        )
        traces_data_list.append(trace_params.model_dump())
    return traces_data_list


def compute_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates the distance in kilometers between two geographic points."""
    try:
        result = gps2dist_azimuth(lat1, lon1, lat2, lon2)[0] / 1000
        result = round(result, 3)
        return result
    except Exception as e:
        error_message = f"Distance calculation failed: {e}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)

def write_json_to_file(data: list|dict, path: Path) -> None:
    """Helper function to write JSON data to a file."""
    try:
        with open(path, "w") as fw:
            json.dump(data, fw)
    except Exception as e:
        error_message = f"Cannot write the json file: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)

def write_txt_to_file(data: list|dict, path: Path) -> None:
    """Helper function to write text data to a file."""
    try:
        with open(path, "w") as fw:
            json_string = json.dumps(data)
            fw.write(json_string)
    except Exception as e:
        error_message = f"Cannot write the txt file: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)

def write_mseed_to_file(data: list, path: Path) -> None:
    """Helper function to write miniseed data to a file."""
    try:
        stream = convert_traces_to_stream(data)
        stream.write(path)
    except Exception as e:
        error_message = f"Cannot write the mseed file: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)

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



def convert_traces_to_stream(trace_list: list) -> Stream:
    """Construct a Stream object from the list of traces"""
    traces = []
    for tr_dict in trace_list:
        trace_header = tr_dict.stats
        trace_header["starttime"] = UTCDateTime(trace_header["starttime"])
        trace_header["endtime"] = UTCDateTime(trace_header["endtime"])
        trace = Trace(data=np.array(tr_dict["ydata"]), header=trace_header)
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
            logger.error(error_message)
            raise HTTPException(status_code=500, detail=error_message)
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
            logger.error(error_message)
            raise HTTPException(status_code=500, detail=error_message)
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
            logger.error(error_message)
            raise HTTPException(status_code=500, detail=error_message)
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
            logger.error(error_message)
            raise HTTPException(status_code=500, detail=error_message)
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
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)
        
    if vertical_trace is None: 
        error_message = "You have to provide a vertical component!"
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)
    
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
    