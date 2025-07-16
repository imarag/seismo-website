import datetime
import sys
from pathlib import Path

sys.path.append(str(Path(__name__).absolute().parent))

from fastapi.testclient import TestClient

from config import settings
from main import app
from utils.helpers import get_trace_name, read_sample_mseed
from utils.transformations import convert_dict_to_trace, convert_trace_to_dict

sample_mseed_file_path = settings.sample_mseed_file_path
client = TestClient(app)


def test_get_trace_name() -> None:
    stream = read_sample_mseed()
    first_trace = stream.traces[0]
    trace_name = get_trace_name(first_trace)
    assert trace_name == "20150724_095834_KRL1"


def test_convert_dict_to_trace() -> None:
    dummy_trace_params = {
        "trace_id": "b7d9a812-5e21-4ec7-97a7-2a7d3cfeb123",
        "ydata": [0.0, 0.1, -0.1, 0.0, 0.05, -0.05],
        "xdata": [0, 0.01, 0.02, 0.03, 0.04, 0.05],
        "stats": {
            "sampling_rate": 100.0,
            "delta": 0.01,
            "calib": 1.0,
            "npts": 6,
            "network": "XY",
            "location": "01",
            "station": "TEST",
            "channel": "EHZ",
            "component": "Z",
            "starttime": "2025-07-13T12:00:00",
            "endtime": "2025-07-13T12:00:00.05",
        },
    }

    trace = convert_dict_to_trace(dummy_trace_params)
    assert trace.stats.npts == 6  # noqa: PLR2004
    assert trace.stats.component == "Z"
    assert trace.stats.network == "XY"
    assert trace.stats.calib == 1
    assert trace.stats.location == "01"
    assert trace.stats.station == "TEST"


def test_convert_trace_to_dict() -> None:
    stream = read_sample_mseed()
    first_trace = stream.traces[0]
    trace_dict = convert_trace_to_dict(first_trace)
    assert len(trace_dict["xdata"]) == 50600  # noqa: PLR2004
    assert trace_dict["stats"]["component"] == "E"
    assert trace_dict["stats"]["station"] == "KRL1"
    assert trace_dict["stats"]["start_date"] == datetime.date(2015, 7, 24)
    assert trace_dict["stats"]["start_time"] == datetime.time(9, 58, 34)
