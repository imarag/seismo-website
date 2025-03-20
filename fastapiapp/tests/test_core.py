from fastapi.testclient import TestClient
import sys
from pathlib import Path

current_path = Path(__file__).resolve().parent.parent
sys.path.append(str(current_path))
from internal import config
from ..main import app

client = TestClient(app)
settings = config.Settings()

def test_calculate_distance():
    params = {"lat1": 45, "lon1": 23, "lat2": 41, "lon2":44}
    response = client.get("/core/calculate-distance", params=params)
    assert response.status_code == 200
    assert response.json() == {
        "distance_km": 1763.518,
        "azimuth_a_b": 97.18,
        "azimuth_b_a": 291.597
    }

def test_calculate_distance_remove_lon2():
    params = {"lat1": 45, "lon1": 23, "lat2": 41}
    response = client.get("/core/calculate-distance", params=params)
    assert response.status_code == 400
    assert response.json() == {
        "error_message": [
            "Field required"
        ]
    }

def test_calculate_distance_empty_params():
    params = {}
    response = client.get("/core/calculate-distance", params=params)
    assert response.status_code == 400
    assert response.json() == {
        "error_message": [
            "Field required",
            "Field required",
            "Field required",
            "Field required"
        ]
    }


def test_save_empty_arrivals():
    params = {}
    response = client.get("/core/save-arrivals", params=params)
    assert response.status_code == 400
    assert response.json() == {
        "error_message": [
            "Value error, At least one wave arrival must be selected (P arrival or S arrival) to use this option!"
        ]
    }

def test_save_arrivals_Parr_greater_Sarr():
    params = {"Parr": 67, "Sarr": 23}
    response = client.get("/core/save-arrivals", params=params)
    assert response.status_code == 400
    assert response.json() == {
        "error_message": [
            "Value error, The S wave arrival cannot be less or equal to the P wave arrival!"
        ]
    }

def test_upload_seismic_file():
    files = {"file": open(settings.sample_mseed_file_path, 'rb')}
    response = client.post("/core/upload-seismic-file", files=files)
    traces = response.json()
    total_traces = len(traces)
    assert total_traces == 3
    trace_keys = ["xdata", "ydata", "stats", "trace_id"]
    for key in trace_keys:
        assert key in traces[0] 
    stats_keys = ["station", "component", "start_date", "start_time", "sampling_rate", "npts", "endtime", "duration", "record_name"]
    for key in stats_keys:
        assert key in traces[0]["stats"]


def test_download_file_not_file_supported():
    params = {"data": [], "file_type": "txtt"}
    response = client.post("/core/download-file", json=params)
    assert response.status_code == 404
    assert response.json() == {"error_message":["Unsupported file type!"]}
    