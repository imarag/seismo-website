from obspy.core import Stream, Trace

from core.request_handler import RequestHandler
from utils.transformations import convert_trace_to_dict


def taper_stream(stream: Stream, options: dict) -> list[dict]:
    return [taper_trace(trace, options) for trace in stream.traces]


def taper_trace(trace: Trace, options: dict) -> dict:
    """taper a single trace based on the given parameters."""
    trace_processed = trace.copy()
    try:
        trace_processed.taper(
            None,
            type=options["taper_type"],
            side=options["taper_side"],
            max_length=options["taper_length"],
        )
    except Exception as e:
        error_message = f"Cannot taper the trace: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_trace_to_dict(trace_processed)
