from obspy.core import Trace

from config import Settings

settings = Settings()


def get_trace_name(trace: Trace) -> str:
    """Generate a record name from the trace object"""
    starttime = trace.stats["starttime"]
    station = trace.stats["station"]

    if (
        not station
    ):  # add the code "STATION" in case of empty station code, for consistency
        station = "STATION"

    rec_name = (
        starttime.date.isoformat() + "_" + starttime.time.isoformat() + "_" + station
    )
    return rec_name.replace(":", "").replace("-", "")
