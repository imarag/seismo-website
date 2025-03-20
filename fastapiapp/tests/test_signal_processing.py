# from fastapi.testclient import TestClient
# from ..internals import config
# from obspy.core import read
# from ..internals.models import (
#     TrimParams, TaperParams, DetrendParams,  SeismicDataKeys,
#     FilterParams, FourierParams, HVSRParams, TrimOptions
# )
# from ..main import app

# client = TestClient(app)
# settings = config.Settings()

# def test_trim():
#     stream = read(settings.sample_mseed_file_path)
#     json_params = TrimParams(
#         data = [
#                 SeismicDataKeys(trace_id = tr.id, values = tr.data) 
#                 for tr in stream
#             ],
#         options = TrimOptions(
#             sampling_rate = 65,
#             trim_start = 0,
#             trim_end = 10
#         )
#     )
#     response = client.post("/signal-processing/trim", json=json_params.model_dump())
#     traces = response.json()
#     total_traces = len(traces)
#     assert total_traces == 3
#     trace_keys = ["xdata", "ydata", "stats", "trace_id"]
#     for key in trace_keys:
#         assert key in traces[0] 
#     stats_keys = ["station", "component", "start_date", "start_time", "sampling_rate", "npts", "endtime", "duration", "record_name"]:
#     for key in stats_keys:
#         assert key in traces[0]["stats"]
