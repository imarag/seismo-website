import azure.functions as func
import logging
from utilities.StreamHandler import StreamHandler
from utilities.SignalProcessingHandler import SignalProcessingHandler
import json 

def detrend_waveform(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Getting the detrending options')

    req_json = req.get_json()

    type = req_json["type"]
    traces = req_json["traces"]

    # convert incoming traces to obspy stream object
    stream = StreamHandler.convert_traces_to_stream(traces)

    # initialize the signal processing handler to filter the stream
    signal_processing_handler = SignalProcessingHandler()

    # get a copy of the stream
    detrended_stream = signal_processing_handler.detrend_stream(
        stream,
        type = type
        )

    # if the return value of the filter method is str, it is a server error
    if isinstance(detrended_stream, str):
        return func.HttpResponse(detrended_stream, status_code=500)
    
    # convert the stream back to traces list
    detrended_traces_list = StreamHandler(detrended_stream).convert_stream_to_traces()

    # convert to json
    json_response = json.dumps(detrended_traces_list)

    return func.HttpResponse(
        json_response, 
        status_code=200, 
        headers={"Content-Type": "application/json"}
        )