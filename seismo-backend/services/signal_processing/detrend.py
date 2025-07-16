from obspy.core import Stream, Trace

from core.request_handler import RequestHandler
from utils.transformations import convert_trace_to_dict


def detrend_stream(stream: Stream, options: dict) -> list[dict]:
    return [detrend_trace(trace, options) for trace in stream.traces]


def detrend_trace(trace: Trace, options: dict) -> dict:
    """detrend a single trace based on the given parameters."""
    trace_processed = trace.copy()
    try:
        trace_processed.detrend(type=options["detrend_type"])
    except Exception as e:
        error_message = f"Cannot detrend the trace: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_trace_to_dict(trace_processed)
