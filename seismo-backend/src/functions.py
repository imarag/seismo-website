from obspy.core import read, UTCDateTime, Trace, Stream
from internals.config import Settings
import numpy as np
from pathlib import Path
import json
from src.utils import RequestHandler
from obspy.geodetics import gps2dist_azimuth
from internals.models import (
    TraceStats,
    TraceParams,
    TrimParams,
    TaperParams,
    DetrendParams,
    FilterParams,
    FourierParams,
    HVSRParams,
)

settings = Settings()
logger = settings.logger


def read_bytes_to_stream(seismic_file_bytes) -> Stream:
    """Reads the given seismic file bytes and returns a Stream object."""
    try:
        stream = read(seismic_file_bytes)
        return stream
    except Exception as e:
        error_message = f"Invalid seismic file. Please refer to the ObsPy 'read' function documentation for supported file types. Error: {str(e)}"
        RequestHandler.send_error(error_message, status_code=404)


def validate_stream(stream: Stream) -> None:
    """Validate the input stream object."""
    traces = stream.traces

    # Check if the stream is empty
    if len(traces) == 0:
        error_message = "The stream provided is empty. There are no traces!"
        RequestHandler.send_error(error_message, status_code=404)

    # Check if all traces have no data
    total_npts = [tr.stats.npts for tr in traces]
    if not any(total_npts):
        error_message = f"The traces have no data!"
        RequestHandler.send_error(error_message, status_code=404)

    # Check for large traces that might cause performance issues
    max_npts_allowed = settings.mseed_max_npts_allowed
    for tr in traces:
        if (
            tr.stats.npts > max_npts_allowed
        ):  # Threshold for performance issues (tune as necessary)
            error_message = f"A trace contains an exceptionally large number of sampling points (npts > {max_npts_allowed}). Consider trimming it before uploading!"
            RequestHandler.send_error(error_message, status_code=404)


def convert_stream_to_traces_list(stream: Stream) -> list[dict]:
    """Extract the data from the mseed file into a list of traces (dictionaries)"""
    traces_data_list = []
    for tr in stream.traces:
        trace_stats = tr.stats
        trace_params = TraceParams(
            ydata=tr.data.tolist(),
            xdata=tr.times().tolist(),
            stats=TraceStats(
                station=trace_stats.station,
                component=trace_stats.component,
                start_date=trace_stats.starttime.date,
                start_time=trace_stats.starttime.time,
                sampling_rate=trace_stats.sampling_rate,
                npts=trace_stats.npts,
            ),
        )
        traces_data_list.append(trace_params.model_dump())
    return traces_data_list


def compute_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> tuple:
    """Calculates the distance in kilometers and azimuth between two geographic points."""
    try:
        result = gps2dist_azimuth(lat1, lon1, lat2, lon2)
        return result
    except Exception as e:
        error_message = f"Distance calculation failed: {e}"
        RequestHandler.send_error(error_message, status_code=500)


def write_json_to_file(data: list | dict, path: Path) -> None:
    """Helper function to write JSON data to a file."""
    with open(path, "w") as fw:
        json.dump(data, fw)


def write_txt_to_file(data: list | dict, path: Path) -> None:
    """Helper function to write text data to a file."""
    with open(path, "w") as fw:
        json_string = json.dumps(data)
        fw.write(json_string)


def write_mseed_to_file(data: list, path: Path) -> None:
    """Helper function to write miniseed data to a file."""
    stream = convert_traces_to_stream(data)
    stream.write(path)


def get_record_name(stream: Stream) -> str:
    """Generate a record name from the first trace in the stream"""
    first_trace = stream.traces[0]
    starttime = first_trace.stats["starttime"]
    station = first_trace.stats["station"]

    if (
        not station
    ):  # add the code "STATION" in case of empty station code, for consistency
        station = "STATION"

    rec_name = (
        starttime.date.isoformat() + "_" + starttime.time.isoformat() + "_" + station
    )
    rec_name = rec_name.replace(":", "").replace("-", "")
    return rec_name


def convert_traces_to_stream(trace_list: list) -> Stream:
    """Construct a Stream object from the list of traces"""
    traces = []
    for tr_dict in trace_list:
        trace_header = tr_dict["stats"]
        logger.info(trace_header)
        trace_header["starttime"] = UTCDateTime(
            trace_header["start_date"] + " " + trace_header["start_time"]
        )
        trace = Trace(data=np.array(tr_dict["ydata"]), header=trace_header)
        traces.append(trace)
    return Stream(traces=traces)


def trim_trace(trim_params: TrimParams) -> list[dict]:
    """Trim a single trace based on the given parameters."""
    try:
        trim_params_dict = trim_params.model_dump()
        st_processed = convert_traces_to_stream(trim_params_dict["traces"])
        starttime = st_processed.traces[0].stats.starttime
        st_processed.trim(
            starttime=starttime + trim_params_dict["options"]["trim_start"],
            endtime=starttime + trim_params_dict["options"]["trim_end"],
        )
    except Exception as e:
        error_message = f"Cannot trim the waveforms: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_stream_to_traces_list(st_processed)


def taper_trace(taper_params: TaperParams) -> list[dict]:
    """taper a single trace based on the given parameters."""
    try:
        taper_params_dict = taper_params.model_dump()
        st_processed = convert_traces_to_stream(taper_params_dict["traces"])
        st_processed.taper(
            None,
            type=taper_params_dict["options"]["taper_type"],
            side=taper_params_dict["options"]["taper_side"],
            max_length=taper_params_dict["options"]["taper_length"],
        )
    except Exception as e:
        error_message = f"Cannot taper the waveforms: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_stream_to_traces_list(st_processed)


def detrend_trace(detrend_params: DetrendParams) -> list[dict]:
    """detrend a single trace based on the given parameters."""
    try:
        detrend_params_dict = detrend_params.model_dump()
        st_processed = convert_traces_to_stream(detrend_params_dict["traces"])
        st_processed.detrend(
            type=detrend_params_dict["options"]["detrend_type"],
        )
    except Exception as e:
        error_message = f"Cannot detrend the waveforms: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_stream_to_traces_list(st_processed)


def filter_trace(filter_params: FilterParams) -> list[dict]:
    """filter a single trace based on the given parameters."""
    try:
        filter_params_dict = filter_params.model_dump()
        st_processed = convert_traces_to_stream(filter_params_dict["traces"])
        if (
            filter_params_dict["options"]["freq_min"] is None
            and filter_params_dict["options"]["freq_max"] is not None
        ):
            st_processed.filter(
                "lowpass", freq=filter_params_dict["options"]["freq_max"]
            )
        elif (
            filter_params_dict["options"]["freq_min"] is not None
            and filter_params_dict["options"]["freq_max"] is None
        ):
            st_processed.filter(
                "highpass", freq=filter_params_dict["options"]["freq_min"]
            )
        elif (
            filter_params_dict["options"]["freq_min"] is not None
            and filter_params_dict["options"]["freq_max"] is not None
        ):
            st_processed.filter(
                "bandpass",
                freqmin=filter_params_dict["options"]["freq_min"],
                freqmax=filter_params_dict["options"]["freq_max"],
            )
    except Exception as e:
        error_message = f"Cannot filter the waveforms: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_stream_to_traces_list(st_processed)


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
        return_data_list.append(
            {
                "trace_id": tr_dict.trace_id,
                "component": component,
                "fas_freqs": fas_freqs[1:].tolist(),
                "fas_amps": fft_data_abs[1:].tolist(),
            }
        )

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
        RequestHandler.send_error(error_message, status_code=404)

    if vertical_trace is None:
        error_message = "You have to provide a vertical component!"
        RequestHandler.send_error(error_message, status_code=404)

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
