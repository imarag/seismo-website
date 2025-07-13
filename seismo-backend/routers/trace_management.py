from fastapi import APIRouter, Request

from models.seismic_params_models import TraceParams
from utils.helpers import get_sample_mseed
from utils.transformations import (
    convert_dict_to_trace,
    convert_stream_to_list,
    convert_trace_to_dict,
)

router = APIRouter()


@router.post("/update-trace")
async def update_trace(request: Request) -> dict:
    trace_dict = await request.json()
    trace_object = convert_dict_to_trace(trace_dict)
    return convert_trace_to_dict(trace_object)


@router.get("/get-default-trace-params")
async def get_default_trace_params() -> TraceParams:
    return TraceParams()


@router.get("/get-sample-trace-params")
async def get_sample_trace_params() -> list:
    sample_stream = get_sample_mseed()
    return convert_stream_to_list(sample_stream)
