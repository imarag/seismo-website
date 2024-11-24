from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from ..internals.config import Settings
from ..functions import extract_mseed_data
from ..dependencies import get_user_id

import datetime
import numpy as np

from obspy.core import read, UTCDateTime
from obspy.core.stream import Stream
from obspy.core.trace import Trace

router = APIRouter(
    prefix="/edit-seismic-file",
    tags=["edit-seismic-file"],
)

class AddTraceParams(BaseModel):
    sampling_rate: float
    station: str = ""
    data: list
    channel: str = Field(pattern="^[A-Za-z][A-Za-z0-9]?$")
    start_date: datetime.date = datetime.date(1970, 1, 1)
    start_time: datetime.time = datetime.time(0, 0, 0)


@router.post("/add-trace")
def add_trace(add_trace_params: AddTraceParams, user_id: str = Depends(get_user_id)):

    starttime = UTCDateTime(f"{add_trace_params.start_date} {add_trace_params.start_time}")

    trace_header = add_trace_params.model_dump()
    trace_header["starttime"] = starttime
 
    new_trace = Trace(header=trace_header, data=np.array(trace_header["data"]))
    
    mseed_file_path = Settings.TEMP_DATA_PATH.value / user_id / Settings.MSEED_FILE_NAME.value
    stream = read(mseed_file_path)
    old_traces = stream.traces 
    new_traces = old_traces + [new_trace]
    stream.traces = new_traces

    stream.write(Settings.TEMP_DATA_PATH.value / user_id / Settings.MSEED_FILE_NAME.value)

    json_data = extract_mseed_data(stream)
    
    return json_data


class UpdateTraceParams(BaseModel):
    sampling_rate: float
    station: str = ""
    data: list
    channel: str = Field(pattern="^[A-Za-z][A-Za-z0-9]?$")
    start_date: datetime.date = datetime.date(1970, 1, 1)
    start_time: datetime.time = datetime.time(0, 0, 0)


@router.post("/update-trace")
def update_trace(update_trace_params: UpdateTraceParams, user_id: str = Depends(get_user_id)):

    starttime = UTCDateTime(f"{update_trace_params.start_date} {update_trace_params.start_time}")

    trace_header = update_trace_params.model_dump()
    trace_header["starttime"] = starttime
 
    new_trace = Trace(header=trace_header, data=np.array(trace_header["data"]))
    
    mseed_file_path = Settings.TEMP_DATA_PATH.value / user_id / Settings.MSEED_FILE_NAME.value
    stream = read(mseed_file_path)
    old_traces = stream.traces 
    new_traces = old_traces + [new_trace]
    stream.traces = new_traces

    stream.write(Settings.TEMP_DATA_PATH.value / user_id / Settings.MSEED_FILE_NAME.value)

    json_data = extract_mseed_data(stream)
    
    return json_data


@router.get("/delete-trace/{trace_id}")
def delete_seismic_trace(trace_id, user_id: str = Depends(get_user_id)):

    mseed_file_path = Settings.TEMP_DATA_PATH.value / user_id / Settings.MSEED_FILE_NAME.value
    stream = read(mseed_file_path)
   
    traces = []
    for tr in stream.traces:
        if tr.get_id() == trace_id:
            continue 
        traces.append(tr)
    
    new_stream = Stream(traces=traces)

    if len(new_stream.traces) != 0:
        # write the uploaded file
        new_stream.write(
            Settings.TEMP_DATA_PATH.value / user_id / Settings.MSEED_FILE_NAME.value
        )
        # convert the uploaded mseed file to json
        json_data = extract_mseed_data(new_stream)
    else:
        return []

    return json_data
