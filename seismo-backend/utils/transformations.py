import numpy as np
from obspy.core import Stream, Trace, UTCDateTime

from models.seismic_params_models import TraceParams, TraceStats


def convert_stream_to_list(stream: Stream) -> list[dict]:
    """Extract the data from the mseed file into a list of dicts (trace dicts)"""
    trace_dict_list = []
    for trace in stream.traces:
        tr_dict = convert_trace_to_dict(trace)
        trace_dict_list.append(tr_dict)
    return trace_dict_list


def convert_list_to_stream(trace_dict_list: list) -> Stream:
    """Construct a Stream object from the list of dicts (trace dicts)"""
    trace_list = []
    for tr_dict in trace_dict_list:
        trace = convert_dict_to_trace(tr_dict)
        trace_list.append(trace)
    return Stream(traces=trace_list)


def convert_dict_to_trace(trace_dict: dict) -> Trace:
    """Construct a Trace object from the trace dict"""
    trace_header = trace_dict["stats"].copy()

    start_date = trace_header.get("start_date", "1970-01-01")
    start_time = trace_header.get("start_time", "00:00:00")
    trace_header["starttime"] = UTCDateTime(f"{start_date} {start_time}")

    # Remove these (automatically calculated)
    trace_header.pop("npts", None)
    trace_header.pop("delta", None)
    trace_header.pop("endtime", None)

    # get the component that the user provided in the frontend
    # and set it as the last character of the channel
    trace_header["channel"] = trace_header["channel"][0:-1] + trace_header["component"]
    trace_header["sampling_rate"] = float(trace_header["sampling_rate"])
    return Trace(data=np.array(trace_dict["ydata"]), header=trace_header)


def convert_trace_to_dict(trace: Trace) -> dict:
    """Construct a trace dict from a Trace object"""
    trace_params = TraceParams(
        ydata=trace.data.tolist(),
        xdata=trace.times().tolist(),
        stats=TraceStats(**trace.stats),
    )
    return trace_params.model_dump()
