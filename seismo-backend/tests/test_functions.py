import sys
from pathlib import Path

from fastapi.testclient import TestClient
from obspy.core import read

sys.path.append(str(Path(__name__).absolute().parent))

from config import Settings
from main import app
from utils.helpers import get_trace_name
from services.geodetics import compute_distance_km


settings = Settings()
sample_mseed_file_path = settings.sample_mseed_file_path
client = TestClient(app)

stream = read(sample_mseed_file_path)


def test_get_trace_name() -> None:
    first_trace = stream.traces[0]
    trace_name = get_trace_name(first_trace)
    assert trace_name == "20150724_095834_KRL1"
