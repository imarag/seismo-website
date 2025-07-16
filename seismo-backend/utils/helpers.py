from datetime import date, time

from obspy.core import Stream, Trace, read

from config import settings


def read_sample_mseed() -> Stream:
    return read(settings.sample_mseed_file_path)


def format_datetime_to_record_name(date: date, time: time, station: str = "") -> str:
    """Convert date and time objects plus optional station into a record name string."""
    station_suffix = f"_{station.strip()}" if station.strip() else ""
    record_name = f"{date.isoformat()}_{time.isoformat()}{station_suffix}"
    return record_name.replace(":", "").replace("-", "")


def get_trace_name(trace: Trace) -> str:
    """Extract metadata from trace and generate record name."""
    starttime = trace.stats["starttime"]
    station = trace.stats["station"]
    return format_datetime_to_record_name(starttime.date, starttime.time, station)
