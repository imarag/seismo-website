import numpy as np
from obspy.core import Stream, Trace, UTCDateTime

from models.seismic_params_models import TraceParams, TraceStats


def convert_stream_to_list(stream: Stream) -> list[dict]:
    """Extract the data from the mseed file into a list of trace dicts"""
    return [convert_trace_to_dict(trace) for trace in stream.traces]


def convert_list_to_stream(trace_dict_list: list) -> Stream:
    """Construct a Stream object from the list of trace dicts"""
    trace_list = []
    for tr_dict in trace_dict_list:
        trace = convert_dict_to_trace(tr_dict)
        trace_list.append(trace)
    return Stream(traces=trace_list)


def convert_dict_to_trace(trace_dict: dict) -> Trace:
    """Construct a Trace object from the trace dict"""
    trace_header = TraceStats(**trace_dict["stats"]).model_dump()
    # get only the needed parameters. The rest are calculated automatically
    trace_stats = {
        "sampling_rate": trace_header["sampling_rate"],
        "calib": trace_header["calib"],
        "network": trace_header["network"],
        "location": trace_header["location"],
        "station": trace_header["station"],
        "starttime": UTCDateTime(trace_header["starttime"]),
        "channel": trace_header["channel"],
    }
    return Trace(data=np.array(trace_dict["ydata"]), header=trace_stats)


def convert_trace_to_dict(trace: Trace) -> dict:
    """Construct a trace dict from a Trace object"""
    trace_dict = dict(**trace.stats)
    trace_dict["component"] = trace.stats.component.strip()

    trace_params = TraceParams(
        ydata=list(trace.data),
        xdata=list(trace.times()),
        stats=TraceStats(**trace_dict),
    )
    return trace_params.model_dump()
