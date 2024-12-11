from fastapi import APIRouter
from pydantic import BaseModel, Field
from obspy.core import read, UTCDateTime, Stream, Trace
import datetime 
import numpy as np
from internals.config import Settings
from functions import convert_stream_to_traces

router = APIRouter(
    prefix="/handle-seismic-traces",
    tags=["handle seismic traces"],
)


class AddTraceParams(BaseModel):
    sampling_rate: float
    station: str = ""
    data: list
    channel: str = Field(pattern="^[A-Za-z][A-Za-z0-9]?$")
    start_date: datetime.date = datetime.date(1970, 1, 1)
    start_time: datetime.time = datetime.time(0, 0, 0)


@router.post("/add-trace")
def add_trace(add_trace_params: AddTraceParams):

    starttime = UTCDateTime(f"{add_trace_params.start_date} {add_trace_params.start_time}")

    trace_header = add_trace_params.model_dump()
    trace_header["starttime"] = starttime
 
    new_trace = Trace(header=trace_header, data=np.array(trace_header["data"]))
    
    mseed_file_path = Settings.TEMP_DATA_PATH.value / Settings.MSEED_FILE_NAME.value
    stream = read(mseed_file_path)
    old_traces = stream.traces 
    new_traces = old_traces + [new_trace]
    stream.traces = new_traces

    stream.write(Settings.TEMP_DATA_PATH.value / Settings.MSEED_FILE_NAME.value)

    json_data = convert_stream_to_traces(stream)
    
    return json_data


class UpdateTraceParams(BaseModel):
    sampling_rate: float
    station: str = ""
    data: list
    channel: str = Field(pattern="^[A-Za-z][A-Za-z0-9]?$")
    start_date: datetime.date = datetime.date(1970, 1, 1)
    start_time: datetime.time = datetime.time(0, 0, 0)


@router.post("/update-trace")
def update_trace(update_trace_params: UpdateTraceParams):

    starttime = UTCDateTime(f"{update_trace_params.start_date} {update_trace_params.start_time}")

    trace_header = update_trace_params.model_dump()
    trace_header["starttime"] = starttime
 
    new_trace = Trace(header=trace_header, data=np.array(trace_header["data"]))
    
    mseed_file_path = Settings.TEMP_DATA_PATH.value / Settings.MSEED_FILE_NAME.value
    stream = read(mseed_file_path)
    old_traces = stream.traces 
    new_traces = old_traces + [new_trace]
    stream.traces = new_traces

    stream.write(Settings.TEMP_DATA_PATH.value / Settings.MSEED_FILE_NAME.value)

    json_data = convert_stream_to_traces(stream)
    
    return json_data


@router.get("/delete-trace/{trace_id}")
def delete_seismic_trace(trace_id):

    mseed_file_path = Settings.TEMP_DATA_PATH.value / Settings.MSEED_FILE_NAME.value
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
            Settings.TEMP_DATA_PATH.value / Settings.MSEED_FILE_NAME.value
        )
        # convert the uploaded mseed file to json
        json_data = convert_stream_to_traces(new_stream)
    else:
        return []

    return json_data
