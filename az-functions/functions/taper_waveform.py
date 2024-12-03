import azure.functions as func
import logging
from utilities.StreamHandler import StreamHandler
from utilities.SignalProcessingHandler import SignalProcessingHandler
import json 

def taper_waveform(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Getting the tapering options')

    req_json = req.get_json()

    max_percentage = req_json["max_percentage"]
    side = req_json["side"]
    type = req_json["type"]
    max_length = req_json["max_length"]
    traces = req_json["traces"]

    # convert incoming traces to obspy stream object
    stream = StreamHandler.convert_traces_to_stream(traces)

    # initialize the signal processing handler to filter the stream
    signal_processing_handler = SignalProcessingHandler()

    tapered_stream = signal_processing_handler.taper_stream(
        stream, 
        max_percentage = max_percentage, 
        side = side,
        type = type,
        max_length = max_length
        )

    # if the return value of the filter method is str, it is a server error
    if isinstance(tapered_stream, str):
        return func.HttpResponse(tapered_stream, status_code=500)
    
    # convert the stream back to traces list
    tapered_traces_list = StreamHandler(tapered_stream).convert_stream_to_traces()

    # convert to json
    json_response = json.dumps(tapered_traces_list)

    return func.HttpResponse(
        json_response, 
        status_code=200, 
        headers={"Content-Type": "application/json"}
        )