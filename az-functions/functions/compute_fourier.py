import azure.functions as func
import logging
from utilities.StreamHandler import StreamHandler
from utilities.SignalProcessingHandler import SignalProcessingHandler
import json 

def compute_fourier(req: func.HttpRequest) -> func.HttpResponse:

    req_json = req.get_json()

    traces = req_json["traces"]
    signal_left_side = req_json["signal_left_side"]
    window_length = req_json["window_length"]
    noise_right_side = req_json["noise_right_side"]

    # convert incoming traces to obspy stream object
    stream = StreamHandler.convert_traces_to_stream(traces)

    # initialize the signal processing handler to filter the stream
    signal_processing_handler = SignalProcessingHandler()

    fourier_data = []

    for tr in stream.traces:
        tr_trimmed_signal = signal_processing_handler.trim_trace(
                tr, 
                signal_left_side,
                signal_left_side + window_length
            )

        if isinstance(tr_trimmed_signal, str):
            error_message = "Cannot trim the waveform"
            return func.HttpResponse(error_message, status_code=404)

        fft_signal_freq, fft_signal_data = signal_processing_handler.compute_fourier(tr_trimmed_signal)

        trace_dict = {
            "signal": {"frequency": fft_signal_freq, "fas": fft_signal_data},
            "noise": {"frequency": [], "fas": []},
        }

        if noise_right_side is not None:
            tr_trimmed_noise = signal_processing_handler.trim_trace(
                tr, 
                noise_right_side - window_length,
                noise_right_side
            )

            if isinstance(tr_trimmed_noise, str):
                error_message = "Cannot trim the waveform"
                return func.HttpResponse(error_message, status_code=404)
            
            fft_noise_freq, fft_noise_data = signal_processing_handler.compute_fourier(tr_trimmed_noise)

            trace_dict["noise"] = {"frequency": fft_noise_freq, "fas": fft_noise_data},
        
        fourier_data.append(trace_dict)

    return func.HttpResponse(
        json.dumps(fourier_data), 
        status_code=200, 
        headers={"Content-Type": "application/json"}
        )