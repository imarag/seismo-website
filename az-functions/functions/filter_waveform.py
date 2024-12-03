import azure.functions as func
import logging
from utilities.StreamHandler import StreamHandler
from utilities.SignalProcessingHandler import SignalProcessingHandler
import json 

def filter_waveform(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Getting the filtering min and max values')

    req_json = req.get_json()

    freqmin = req_json["freqmin"]
    freqmax = req_json["freqmax"]
    traces = req_json["traces"]

    # convert incoming traces to obspy stream object
    stream = StreamHandler.convert_traces_to_stream(traces)

    # initialize the signal processing handler to filter the stream
    signal_processing_handler = SignalProcessingHandler()

    # get a copy of the stream
    filtered_stream = stream.copy()

    # if the user passed none for both freqmin and freqmax set the filtered stream to the initial stream
    # else filter it
    if freqmin is None and freqmax is None:
        filtered_stream = stream.copy()
    else:
        filtered_stream = signal_processing_handler.filter_stream(
            stream, 
            freqmin=freqmin, 
            freqmax=freqmax
            )

        # if the return value of the filter method is str, it is a server error
        if isinstance(filtered_stream, str):
            return func.HttpResponse(filtered_stream, status_code=500)
    
    # convert the stream back to traces list
    filtered_traces_list = StreamHandler(filtered_stream).convert_stream_to_traces()

    # convert to json
    json_response = json.dumps(filtered_traces_list)

    return func.HttpResponse(
        json_response, 
        status_code=200, 
        headers={"Content-Type": "application/json"}
        )