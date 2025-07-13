from obspy.core import Stream, Trace

from core.request_handler import RequestHandler
from utils.transformations import convert_trace_to_dict


def trim_stream(stream: Stream, options: dict) -> list[dict]:
    return [trim_trace(trace, options) for trace in stream.traces]


def trim_trace(trace: Trace, options: dict) -> dict:
    """trim a single trace based on the given parameters."""
    trace_processed = trace.copy()
    try:
        starttime = trace_processed.stats.starttime
        trace_processed.trim(
            starttime=starttime + options["trim_start"],
            endtime=starttime + options["trim_end"],
        )
    except Exception as e:
        error_message = f"Cannot trim the trace: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_trace_to_dict(trace_processed)
