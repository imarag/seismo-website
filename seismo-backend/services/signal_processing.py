import numpy as np

from core.request_handler import RequestHandler
from models.signal_processing_models import (
    DetrendParams,
    FilterParams,
    FourierParams,
    HVSRParams,
    TaperParams,
    TrimParams,
)
from utils.transformations import convert_list_to_stream, convert_stream_to_list


def trim_trace(trim_params: TrimParams) -> list[dict]:
    """Trim a single trace based on the given parameters."""
    try:
        trim_params_dict = trim_params.model_dump()
        st_processed = convert_list_to_stream(trim_params_dict["traces"])
        starttime = st_processed.traces[0].stats.starttime
        st_processed.trim(
            starttime=starttime + trim_params_dict["options"]["trim_start"],
            endtime=starttime + trim_params_dict["options"]["trim_end"],
        )
    except Exception as e:
        error_message = f"Cannot trim the waveforms: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_stream_to_list(st_processed)


def taper_trace(taper_params: TaperParams) -> list[dict]:
    """taper a single trace based on the given parameters."""
    try:
        taper_params_dict = taper_params.model_dump()
        st_processed = convert_list_to_stream(taper_params_dict["traces"])
        st_processed.taper(
            None,
            type=taper_params_dict["options"]["taper_type"],
            side=taper_params_dict["options"]["taper_side"],
            max_length=taper_params_dict["options"]["taper_length"],
        )
    except Exception as e:
        error_message = f"Cannot taper the waveforms: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_stream_to_list(st_processed)


def detrend_trace(detrend_params: DetrendParams) -> list[dict]:
    """detrend a single trace based on the given parameters."""
    try:
        detrend_params_dict = detrend_params.model_dump()
        st_processed = convert_list_to_stream(detrend_params_dict["traces"])
        st_processed.detrend(type=detrend_params_dict["options"]["detrend_type"])
    except Exception as e:
        error_message = f"Cannot detrend the waveforms: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_stream_to_list(st_processed)


def filter_trace(filter_params: FilterParams) -> list[dict]:
    """filter a single trace based on the given parameters."""
    try:
        filter_params_dict = filter_params.model_dump()
        st_processed = convert_list_to_stream(filter_params_dict["traces"])
        if (
            filter_params_dict["options"]["freq_min"] is None
            and filter_params_dict["options"]["freq_max"] is not None
        ):
            st_processed.filter(
                "lowpass", freq=filter_params_dict["options"]["freq_max"]
            )
        elif (
            filter_params_dict["options"]["freq_min"] is not None
            and filter_params_dict["options"]["freq_max"] is None
        ):
            st_processed.filter(
                "highpass", freq=filter_params_dict["options"]["freq_min"]
            )
        elif (
            filter_params_dict["options"]["freq_min"] is not None
            and filter_params_dict["options"]["freq_max"] is not None
        ):
            st_processed.filter(
                "bandpass",
                freqmin=filter_params_dict["options"]["freq_min"],
                freqmax=filter_params_dict["options"]["freq_max"],
            )
    except Exception as e:
        error_message = f"Cannot filter the waveforms: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)
    return convert_stream_to_list(st_processed)


def compute_fourier_spectra(fourier_params: FourierParams) -> list[dict]:
    """Compute the fourier spectra at a trace based on the given parameters."""
    return_data_list = []
    for tr_dict in fourier_params.traces_data:
        component = tr_dict.component
        data = tr_dict.values
        npts = len(data)
        sl = int(npts / 2)
        sampling_rate = fourier_params.sampling_rate
        fnyq = sampling_rate / 2
        dt = 1 / sampling_rate
        fas_freqs = np.linspace(0, fnyq, sl)
        fft_data = np.fft.fft(data[:npts])
        fft_data_abs = dt * np.abs(fft_data)[0:sl]
        return_data_list.append(
            {
                "trace_id": tr_dict.trace_id,
                "component": component,
                "fas_freqs": fas_freqs[1:].tolist(),
                "fas_amps": fft_data_abs[1:].tolist(),
            }
        )

    return return_data_list


def compute_hvsr_spectra(hvsr_params: HVSRParams) -> list[float]:
    """Compute the hvsr spectra at a trace based on the given parameters."""
    horizontal_traces = []
    vertical_trace = None

    for fourier_dict in hvsr_params.fourier_data:
        component = fourier_dict.component

        if component == "vertical":
            vertical_trace = np.array(np.array(fourier_dict.values))
        else:
            horizontal_traces.append(np.array(fourier_dict.values))

    if len(horizontal_traces) not in [1, 2]:
        error_message = "You have to provide a single or two horizontal components!"
        RequestHandler.send_error(error_message, status_code=404)

    if vertical_trace is None:
        error_message = "You have to provide a vertical component!"
        RequestHandler.send_error(error_message, status_code=404)

    if len(horizontal_traces) == 1:
        horizontal_fourier = horizontal_traces[0]
        hvsr = horizontal_fourier / vertical_trace
    else:
        mean_horizontal_fourier = np.sqrt(
            (horizontal_traces[0] ** 2 + horizontal_traces[1] ** 2) / 2
        )

        hvsr = mean_horizontal_fourier / vertical_trace

    return_hvsr = np.nan_to_num(hvsr)
    return return_hvsr.tolist()
