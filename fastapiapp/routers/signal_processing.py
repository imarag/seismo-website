from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from functions import convert_stream_to_traces, convert_traces_to_stream, trim_trace, taper_trace, detrend_trace, filter_trace, compute_fourier_spectra
from typing import Literal
import numpy as np 
from internals.config import logger
from models import TrimParams
from pydantic import BaseModel, Field
from pydantic import BaseModel, ValidationError, model_validator
from typing_extensions import Self
from models import TrimParams, TaperParams, DetrendParams, FilterParams

router = APIRouter(
    prefix="/signal-processing",
    tags=["signal processing"],
)

@router.post("/trim")
async def trim(trim_params: TrimParams):
    """Endpoint to trim seismic data."""
    return trim_trace(trim_params)

@router.post("/taper")
async def taper(taper_params: TaperParams):
    """Endpoint to taper seismic data."""
    return taper_trace(taper_params)

@router.post("/detrend")
async def detrend(detrend_params: DetrendParams):
    """Endpoint to detrend seismic data."""
    return detrend_trace(detrend_params)

@router.post("/filter")
async def filter(filter_params: FilterParams):
    """Endpoint to filter seismic data."""
    return filter_trace(filter_params)




# class TrimParams(BaseModel):
#     trim_left_side: float
#     trim_right_side: float
#     data: dict | list

#     @model_validator(mode="after")
#     def verify_trim_limits(self) -> Self:
#         if self.trim_left_side >= self.trim_right_side:
#             raise ValueError("The left trim limit cannot be greater or equal to the right trim limit")
#         return self
    
# @router.post("/trim-waveform")
# async def trim_waveform(trim_params_body: TrimParams):
#     traces_list = trim_params_body.traces 
#     trim_left_side = trim_params_body.trim_left_side
#     trim_right_side = trim_params_body.trim_right_side
    
#     logger.info("converting json data into a stream object")
#     stream = convert_traces_to_stream(traces_list)
#     starttime = stream.traces[0].stats.starttime

#     logger.info("trimming the stream")
#     try:
#         stream.trim(starttime=starttime+trim_left_side, endtime=starttime+trim_right_side)
#     except Exception as e:
#         logger.error(f"Cannot trim the traces: {str(e)}")
#         raise HTTPException(status_code=404, detail="Cannot trim the traces!")
    
#     logger.info("converting trimmed data into a list of traces")
#     output_traces_list = convert_stream_to_traces(stream)

#     return output_traces_list


# class TaperParams(BaseModel):
#     taper_type: str
#     taper_length: float
#     traces: list
#     taper_side: Literal["left", "both", "right"] = "left"

# @router.post("/taper-waveform")
# async def taper_waveform(taper_params_body: TaperParams):
#     seismic_data = taper_params_body.traces 
#     taper_type = taper_params_body.taper_type
#     taper_side = taper_params_body.taper_side
#     taper_length = taper_params_body.taper_length
    
#     logger.info("converting json data into a stream object")
#     stream = convert_traces_to_stream(seismic_data)
    
#     logger.info("apply the tappering method to the stream object")
#     try:
#         stream.taper(taper_length, type=taper_type, side=taper_side)
#     except Exception as e:
#         logger.error(f"Cannot taper the traces: {str(e)}")
#         raise HTTPException(status_code=404, detail="Cannot taper the traces!")
    
#     logger.info("converting tapered data into a list of traces")
#     output_traces_list = convert_stream_to_traces(stream)

#     return output_traces_list


# class DetrendParams(BaseModel):
#     detrend_type: Literal["simple", "linear", "constant"] = "simple"
#     traces: list

# @router.post("/detrend-waveform")
# async def detrend_waveform(detrend_params_body: DetrendParams):
#     seismic_data = detrend_params_body.traces 
#     detrend_type = detrend_params_body.detrend_type
    
#     logger.info("converting traces into a stream object")
#     stream = convert_traces_to_stream(seismic_data)

#     logger.info("applying the detrending method to the stream object")
#     try:
#         stream.detrend(type=detrend_type)
#     except Exception as e:
#         logger.error(f"Cannot detrend the traces: {str(e)}")
#         raise HTTPException(status_code=404, detail="Cannot detrend the traces!")
    
#     logger.info("converting detrended data into a list of traces")
#     output_traces_list = convert_stream_to_traces(stream)

#     return output_traces_list



# class FilterParams(BaseModel):
#     traces: list[dict]
#     freqmin: float | None = Field(default=None, gt=0.01, lt=1000)
#     freqmax: float | None = Field(default=None, gt=0.01, lt=1000)

#     @model_validator(mode="after")
#     def verify_trim_limits(self) -> Self:
#         if self.freqmin is not None and self.freqmax is not None:
#             if self.freqmin >= self.freqmax:
#                 raise ValueError("The left filter value cannot be greater or equal to the right filter value")            
#         return self

# @router.post("/apply-filter")
# def apply_filter(filter_params_body: FilterParams) -> list:

#     seismic_data = filter_params_body.traces
#     freqmin = filter_params_body.freqmin
#     freqmax = filter_params_body.freqmax

#     logger.info("converting traces into a stream object")
#     stream = convert_traces_to_stream(seismic_data)

#     try:
#         if freqmin is not None and freqmax is None:
#             stream.filter("highpass", freq=freqmin)

#         elif freqmin is None and freqmax is not None:
#             stream.filter("lowpass", freq=freqmax)

#         elif freqmin is not None and freqmax is not None:
#             stream.filter("bandpass", freqmin=freqmin, freqmax=freqmax)
#     except Exception as e:
#         error_message = str(e)
#         raise HTTPException(status_code=404, detail=error_message)
    
#     logger.info("converting filtered data into a list of traces")
#     output_traces_list = convert_stream_to_traces(stream)

#     return output_traces_list



# class FourierParams(BaseModel):
#     traces: list
#     signal_window_left_side: int | float
#     window_length: int | float
#     vertical_component: str | None = None
#     noise_window_right_side: int | float | None = None
#     compute_hvsr: bool = False

# @router.post("/compute-fourier")
# def compute_fourier(fourier_params_body: FourierParams) -> dict[str, dict]:

#     # initialize the output data dict
#     data_dict_output = {}
   
#     # read it
#     mseed_data = convert_traces_to_stream(fourier_params_body.traces)

#     # get the first trace
#     first_trace = mseed_data.traces[0]

#     # get some information of the stream object
#     starttime = first_trace.stats.starttime

#     # i will save here the traces
#     fourier_data_dict = {}
   
#     # loop through the uploaded traces
#     for i in range(len(mseed_data)):
#         # get the trace name and add it to the fourier_data_dict
#         trace_label = f"trace-{i}"
#         fourier_data_dict[trace_label] = {"signal": None, "noise": None}

#         # get a copy of the trace for the singal
#         trace_signal = mseed_data.traces[i].copy()

#         # get the current trace channel
#         channel = trace_signal.stats.channel

#         try:
#             # trim the waveform between the user selectd window
#             signal_trace_trimmed = trim_trace(
#                 trace_signal, 
#                 starttime + fourier_params_body.signal_window_left_side,
#                 starttime + fourier_params_body.signal_window_left_side + fourier_params_body.window_length
#             )
#         except Exception as e:
#             error_message = str(e)
#             raise HTTPException(status_code=404, detail=error_message)
        
#         try:
#             # compute the fourier
#             fft_freq, fft_signal_data = compute_fourier_spectra(signal_trace_trimmed)
#         except Exception as e:
#             error_message = str(e)
#             raise HTTPException(status_code=404, detail=error_message)
        
#         # create a dictionary for the signal
#         fourier_data_dict[trace_label]["signal"] = {
#             "xdata": fft_freq.tolist(),
#             "ydata": fft_signal_data.tolist(),
#             "channel": channel,
#         }

#         # if the user also added the noise
#         if fourier_params_body.noise_window_right_side is not None:
#             # get a copy of the trace for the noise
#             noise_signal = mseed_data.traces[i].copy()

#             try:
#                 # trim the waveform between the user selectd window
#                 noise_trace_trimmed = trim_trace(
#                     noise_signal, 
#                     starttime + fourier_params_body.noise_window_right_side - fourier_params_body.window_length,
#                     starttime + fourier_params_body.noise_window_right_side
#                 )
#             except Exception as e:
#                 error_message = str(e)
#                 raise HTTPException(status_code=404, detail=error_message)

#             try:
#                 # compute the fourier
#                 fft_freq, fft_noise_data = compute_fourier_spectra(noise_trace_trimmed)
#             except Exception as e:
#                 error_message = str(e)
#                 raise HTTPException(status_code=404, detail=error_message)
    
#             fourier_data_dict[trace_label]["noise"] = {
#                 "xdata": fft_freq.tolist(),
#                 "ydata": fft_noise_data.tolist(),
#                 "channel": channel,
#             }

#     data_dict_output["fourier"] = fourier_data_dict

    
#     # just initialize the horizontal and vertical parameters
#     horizontal_traces = []
#     vertical_traces = None

#     # loop through the mseed data
#     for trace_label in fourier_data_dict:
#         # get the channel
#         channel = fourier_data_dict[trace_label]["signal"]["channel"]

#         # get the signal and noise dict
#         signal_dict = fourier_data_dict[trace_label]["signal"]
#         noise_dict = fourier_data_dict[trace_label]["noise"]

#         # if you find the vertical component (the one that the user specified) then set the data to the vertical_traces parameter
#         if channel == fourier_params_body.vertical_component:
#             vertical_traces = np.array(noise_dict["ydata"])
#         else:
#             horizontal_traces.append(np.array(signal_dict["ydata"]))

#         hvsr_freq = signal_dict["xdata"]
#     # calculate the average horizontal fourier and the hvsr depending on if we have one or two horizontals
#     if len(horizontal_traces) == 1:
#         horizontal_fourier = horizontal_traces[0]
#         hvsr = horizontal_fourier / vertical_traces
#     else:
#         mean_horizontal_fourier = np.sqrt(
#             (horizontal_traces[0] ** 2 + horizontal_traces[1] ** 2) / 2
#         )
#         hvsr = mean_horizontal_fourier / vertical_traces

#     # create a dictionary to save the hvsr data
#     hvsr_data_dict = {"xdata": list(hvsr_freq), "ydata": list(hvsr)}

#     data_dict_output["hvsr"] = hvsr_data_dict

#     return data_dict_output

