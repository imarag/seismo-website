from fastapi import APIRouter

from core.request_handler import RequestHandler
from models.signal_processing_models import (
    DetrendParams,
    FilterParams,
    TaperParams,
    TrimParams,
)
from services.signal_processing.detrend import detrend_stream, detrend_trace
from services.signal_processing.filter import filter_stream, filter_trace
from services.signal_processing.taper import taper_stream, taper_trace
from services.signal_processing.trim import trim_stream, trim_trace
from utils.transformations import convert_dict_to_trace, convert_list_to_stream

router = APIRouter()


@router.post("/taper")
async def taper(taper_params: TaperParams) -> dict | list[dict]:
    """Endpoint to taper seismic data."""
    options = taper_params.options.model_dump()
    trace_data = taper_params.trace_data
    if isinstance(trace_data, dict):
        trace = convert_dict_to_trace(trace_data)
        processed_data = taper_trace(trace, options)
    elif isinstance(trace_data, list):
        stream = convert_list_to_stream(trace_data)
        processed_data = taper_stream(stream, options)
    else:
        error_message = (
            "The input trace data must be a dictionary or a list of dictionary objects."
        )
        return RequestHandler.send_error(error_message, status_code=500)

    return processed_data


@router.post("/trim")
async def trim(trim_params: TrimParams) -> dict | list[dict]:
    """Endpoint to trim seismic data."""
    options = trim_params.options.model_dump()
    trace_data = trim_params.trace_data
    if isinstance(trace_data, dict):
        trace = convert_dict_to_trace(trace_data)
        processed_data = trim_trace(trace, options)
    elif isinstance(trace_data, list):
        stream = convert_list_to_stream(trace_data)
        processed_data = trim_stream(stream, options)
    else:
        error_message = (
            "The input trace data must be a dictionary or a list of dictionary objects."
        )
        return RequestHandler.send_error(error_message, status_code=500)

    return processed_data


@router.post("/detrend")
async def detrend(detrend_params: DetrendParams) -> dict | list[dict]:
    """Endpoint to detrend seismic data."""
    options = detrend_params.options.model_dump()
    trace_data = detrend_params.trace_data
    if isinstance(trace_data, dict):
        trace = convert_dict_to_trace(trace_data)
        processed_data = detrend_trace(trace, options)
    elif isinstance(trace_data, list):
        stream = convert_list_to_stream(trace_data)
        processed_data = detrend_stream(stream, options)
    else:
        error_message = (
            "The input trace data must be a dictionary or a list of dictionary objects."
        )
        return RequestHandler.send_error(error_message, status_code=500)

    return processed_data


@router.post("/filter")
async def filter(filter_params: FilterParams) -> dict | list[dict]:  # noqa: A001
    """Endpoint to filter seismic data."""
    options = filter_params.options.model_dump()
    trace_data = filter_params.trace_data
    if isinstance(trace_data, dict):
        trace = convert_dict_to_trace(trace_data)
        processed_data = filter_trace(trace, options)
    elif isinstance(trace_data, list):
        stream = convert_list_to_stream(trace_data)
        processed_data = filter_stream(stream, options)
    else:
        error_message = (
            "The input trace data must be a dictionary or a list of dictionary objects."
        )
        return RequestHandler.send_error(error_message, status_code=500)

    return processed_data
