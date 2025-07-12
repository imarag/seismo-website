from obspy.core import Stream

from config import Settings
from core.request_handler import RequestHandler

settings = Settings()


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
        error_message = "The traces have no data!"
        RequestHandler.send_error(error_message, status_code=404)

    # Check for large traces that might cause performance issues
    max_npts_allowed = settings.mseed_max_npts_allowed
    for tr in traces:
        if (
            tr.stats.npts > max_npts_allowed
        ):  # Threshold for performance issues (tune as necessary)
            error_message = (
                "A trace contains an exceptionally large number of sampling "
                f"points (npts > {max_npts_allowed}). Consider trimming it!"
            )
            RequestHandler.send_error(error_message, status_code=404)
