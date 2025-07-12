from fastapi import APIRouter, Request

from models.seismic_params_models import TraceParams
from utils.transformations import convert_dict_to_trace, convert_trace_to_dict

router = APIRouter()


@router.post("/update-trace")
async def update_trace(request: Request) -> dict:
    trace_dict = await request.json()
    trace_object = convert_dict_to_trace(trace_dict)
    return convert_trace_to_dict(trace_object)


@router.get("/get-default-trace")
async def get_default_trace() -> TraceParams:
    return TraceParams()
