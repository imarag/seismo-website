from obspy.core import Stream, Trace

from core.request_handler import RequestHandler
from utils.transformations import convert_trace_to_dict


def filter_stream(stream: Stream, options: dict) -> list[dict]:
    return [filter_trace(trace, options) for trace in stream.traces]


def filter_trace(trace: Trace, options: dict) -> dict:
    """filter a single trace based on the given parameters."""
    trace_processed = trace.copy()
    try:
        if options["freq_min"] is None and options["freq_max"] is not None:
            trace_processed.filter("lowpass", freq=options["freq_max"])
        elif options["freq_min"] is not None and options["freq_max"] is None:
            trace_processed.filter("highpass", freq=options["freq_min"])
        elif options["freq_min"] is not None and options["freq_max"] is not None:
            trace_processed.filter(
                "bandpass", freqmin=options["freq_min"], freqmax=options["freq_max"]
            )
    except Exception as e:
        error_message = f"Cannot filter the trace: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_trace_to_dict(trace_processed)
