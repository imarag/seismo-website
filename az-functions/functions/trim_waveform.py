import azure.functions as func
import logging
from utilities.StreamHandler import StreamHandler
from utilities.SignalProcessingHandler import SignalProcessingHandler
import json 

def trim_waveform(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Getting the trimming options')

    req_json = req.get_json()

    left_value = req_json["left_value"]
    right_value = req_json["right_value"]
    traces = req_json["traces"]

    # convert incoming traces to obspy stream object
    stream = StreamHandler.convert_traces_to_stream(traces)

    # initialize the signal processing handler to filter the stream
    signal_processing_handler = SignalProcessingHandler()

    trimmed_stream = signal_processing_handler.trim_stream(
        stream, 
        left_value=left_value, 
        right_value=right_value
        )

    # if the return value of the filter method is str, it is a server error
    if isinstance(trimmed_stream, str):
        return func.HttpResponse(trimmed_stream, status_code=500)
    
    # convert the stream back to traces list
    trimmed_traces_list = StreamHandler(trimmed_stream).convert_stream_to_traces()

    # convert to json
    json_response = json.dumps(trimmed_traces_list)

    return func.HttpResponse(
        json_response, 
        status_code=200, 
        headers={"Content-Type": "application/json"}
        )