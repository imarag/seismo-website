from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from functions import convert_stream_to_traces, convert_traces_to_stream, trim_trace, compute_fourier_spectra
from typing import Literal
import numpy as np 


router = APIRouter(
    prefix="/signal-processing",
    tags=["signal processing"],
)



class TrimWaveformBody(BaseModel):
    trim_left_side: float
    trim_right_side: float
    data: list

@router.post("/trim-waveform")
async def trim_waveform(trim_waveform_body: TrimWaveformBody):
    seismic_data = trim_waveform_body.data 
    trim_left_side = trim_waveform_body.trim_left_side
    trim_right_side = trim_waveform_body.trim_right_side
 
    stream = convert_traces_to_stream(seismic_data)
    starttime = stream.traces[0].stats.starttime
    stream.trim(starttime=starttime+trim_left_side, endtime=starttime+trim_left_side+trim_right_side)
    output_dict_data = convert_stream_to_traces(stream)

    return output_dict_data


class TaperWaveformBody(BaseModel):
    taper_type: str
    taper_length: float
    data: list
    taper_side: Literal["left", "both", "right"] = "left"

@router.post("/taper-waveform")
async def taper_waveform(taper_waveform_body: TaperWaveformBody):
    seismic_data = taper_waveform_body.data 
    taper_type = taper_waveform_body.taper_type
    taper_side = taper_waveform_body.taper_side
    taper_length = taper_waveform_body.taper_length
 
    stream = convert_traces_to_stream(seismic_data)
    
    stream.taper(taper_length, type=taper_type, side=taper_side)
    output_dict_data = convert_stream_to_traces(stream)

    return output_dict_data


class DetrendWaveformBody(BaseModel):
    detrend_type: str
    detrend_order: int
    data: list

@router.post("/detrend-waveform")
async def detrend_waveform(detrend_waveform_body: DetrendWaveformBody):
    seismic_data = detrend_waveform_body.data 
    detrend_type = detrend_waveform_body.detrend_type
    detrend_order = detrend_waveform_body.detrend_order
 
    stream = convert_traces_to_stream(seismic_data)
 
    stream.detrend(type=detrend_type)
    output_dict_data = convert_stream_to_traces(stream)

    return output_dict_data



class FilterParams(BaseModel):
    seismic_data: list[dict]
    freqmin: float | None = Field(default=None, gt=0.01, lt=100)
    freqmax: float | None = Field(default=None, gt=0.01, lt=100)

@router.post("/apply-filter")
def apply_filter(filter_params: FilterParams) -> list:

    seismic_data = filter_params.seismic_data
    freqmin = filter_params.freqmin
    freqmax = filter_params.freqmax

    # convert the request seismic data into stream object
    stream = convert_traces_to_stream(seismic_data)
 
    if freqmin is not None and freqmax is not None and freqmax <= freqmin:
        error_message = "The left filter value cannot be greater or equal to the right filter value!"
        raise HTTPException(status_code=404, detail=error_message)

    try:
        # if freqmin exists and not freqmax
        if freqmin is not None and freqmax is None:
            stream.filter("highpass", freq=freqmin)

        # elif freqmin does not exist but freqmax exists
        elif freqmin is None and freqmax is not None:
            stream.filter("lowpass", freq=freqmax)

        # if both are defined (freqmin and freqmax)
        elif freqmin is not None and freqmax is not None:
            stream.filter("bandpass", freqmin=freqmin, freqmax=freqmax)
    except Exception as e:
        error_message = str(e)
        raise HTTPException(status_code=404, detail=error_message)
    
    # convert stream into json data
    json_data = convert_stream_to_traces(stream)

    return json_data



class ComputeFourierParams(BaseModel):
    values: list
    signal_window_left_side: int | float
    window_length: int | float
    vertical_component: str | None = None
    noise_window_right_side: int | float | None = None
    compute_hvsr: bool = False

@router.post("/compute-fourier")
def compute_fourier(
    fourier_params: ComputeFourierParams
    ) -> dict[str, dict]:

    seismic_data_dict = fourier_params.model_dump()

    # initialize the output data dict
    data_dict_output = {}
   
    # read it
    mseed_data = convert_traces_to_stream(seismic_data_dict["values"])

    # get the first trace
    first_trace = mseed_data.traces[0]

    # get some information of the stream object
    starttime = first_trace.stats.starttime

    # i will save here the traces
    fourier_data_dict = {}
   
    # loop through the uploaded traces
    for i in range(len(mseed_data)):
        # get the trace name and add it to the fourier_data_dict
        trace_label = f"trace-{i}"
        fourier_data_dict[trace_label] = {"signal": None, "noise": None}

        # get a copy of the trace for the singal
        trace_signal = mseed_data.traces[i].copy()

        # get the current trace channel
        channel = trace_signal.stats.channel

        try:
            # trim the waveform between the user selectd window
            signal_trace_trimmed = trim_trace(
                trace_signal, 
                starttime + fourier_params.signal_window_left_side,
                starttime + fourier_params.signal_window_left_side + fourier_params.window_length
            )
        except Exception as e:
            error_message = str(e)
            raise HTTPException(status_code=404, detail=error_message)
        
        try:
            # compute the fourier
            fft_freq, fft_signal_data = compute_fourier_spectra(signal_trace_trimmed)
        except Exception as e:
            error_message = str(e)
            raise HTTPException(status_code=404, detail=error_message)
        
        # create a dictionary for the signal
        fourier_data_dict[trace_label]["signal"] = {
            "xdata": fft_freq.tolist(),
            "ydata": fft_signal_data.tolist(),
            "channel": channel,
        }

        # if the user also added the noise
        if fourier_params.noise_window_right_side is not None:
            # get a copy of the trace for the noise
            noise_signal = mseed_data.traces[i].copy()

            try:
                # trim the waveform between the user selectd window
                noise_trace_trimmed = trim_trace(
                    noise_signal, 
                    starttime + fourier_params.noise_window_right_side - fourier_params.window_length,
                    starttime + fourier_params.noise_window_right_side
                )
            except Exception as e:
                error_message = str(e)
                raise HTTPException(status_code=404, detail=error_message)

            try:
                # compute the fourier
                fft_freq, fft_noise_data = compute_fourier_spectra(noise_trace_trimmed)
            except Exception as e:
                error_message = str(e)
                raise HTTPException(status_code=404, detail=error_message)
    
            fourier_data_dict[trace_label]["noise"] = {
                "xdata": fft_freq.tolist(),
                "ydata": fft_noise_data.tolist(),
                "channel": channel,
            }

    data_dict_output["fourier"] = fourier_data_dict

    
    # just initialize the horizontal and vertical parameters
    horizontal_traces = []
    vertical_traces = None

    # loop through the mseed data
    for trace_label in fourier_data_dict:
        # get the channel
        channel = fourier_data_dict[trace_label]["signal"]["channel"]

        # get the signal and noise dict
        signal_dict = fourier_data_dict[trace_label]["signal"]
        noise_dict = fourier_data_dict[trace_label]["noise"]

        # if you find the vertical component (the one that the user specified) then set the data to the vertical_traces parameter
        if channel == fourier_params.vertical_component:
            vertical_traces = np.array(noise_dict["ydata"])
        else:
            horizontal_traces.append(np.array(signal_dict["ydata"]))

        hvsr_freq = signal_dict["xdata"]
    # calculate the average horizontal fourier and the hvsr depending on if we have one or two horizontals
    if len(horizontal_traces) == 1:
        horizontal_fourier = horizontal_traces[0]
        hvsr = horizontal_fourier / vertical_traces
    else:
        mean_horizontal_fourier = np.sqrt(
            (horizontal_traces[0] ** 2 + horizontal_traces[1] ** 2) / 2
        )
        hvsr = mean_horizontal_fourier / vertical_traces

    # create a dictionary to save the hvsr data
    hvsr_data_dict = {"xdata": list(hvsr_freq), "ydata": list(hvsr)}

    data_dict_output["hvsr"] = hvsr_data_dict

    return data_dict_output

