import azure.functions as func
from functions.compute_distance import compute_distance
from functions.upload_seismic_file import upload_seismic_file
from functions.filter_waveform import filter_waveform
from functions.detrend_waveform import detrend_waveform
from functions.taper_waveform import taper_waveform
from functions.trim_waveform import trim_waveform
from functions.save_arrivals import save_arrivals
from functions.compute_fourier import compute_fourier
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="ComputeDistanceTrigger", methods=["GET", "POST"])
def compute_distance_function(req: func.HttpRequest) -> func.HttpResponse:
    return compute_distance(req)
    
@app.route(route="UploadSeisimcFileTrigger", methods=["GET", "POST"])
def upload_seismic_file_function(req: func.HttpRequest) -> func.HttpResponse:
    return upload_seismic_file(req)
    
@app.route(route="FilterWaveformTrigger", methods=["GET", "POST"])
def filter_waveform_function(req: func.HttpRequest) -> func.HttpResponse:
    return filter_waveform(req)

@app.route(route="TaperWaveformTrigger", methods=["GET", "POST"])
def taper_waveform_function(req: func.HttpRequest) -> func.HttpResponse:
    return taper_waveform(req)

@app.route(route="DetrendWaveformTrigger", methods=["GET", "POST"])
def detrend_waveform_function(req: func.HttpRequest) -> func.HttpResponse:
    return detrend_waveform(req)
    
@app.route(route="TrimWaveformTrigger", methods=["GET", "POST"])
def trim_waveform_function(req: func.HttpRequest) -> func.HttpResponse:
    return trim_waveform(req)

@app.route(route="ComputeFourierTrigger", methods=["GET", "POST"])
def compute_fourier_function(req: func.HttpRequest) -> func.HttpResponse:
    return compute_fourier(req)

@app.route(route="SaveArrivalsTrigger", methods=["GET", "POST"])
def save_arrivals_function(req: func.HttpRequest) -> func.HttpResponse:
    return save_arrivals(req)
    


@app.route(route="TestTrigger", methods=["GET", "POST"])
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    
    mydict = {"a": 1, "b": 2}
    jsondict = json.dumps(mydict)

    return func.HttpResponse(
        jsondict,
        status_code=200,
        headers={"Content-Disposition": 'attachment; filename="cool.json"'},
        mimetype="application/json"
    )


    