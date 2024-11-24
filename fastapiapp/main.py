from fastapi import FastAPI, HTTPException, File, UploadFile, Response, Depends, Request, Cookie, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from obspy.core import read
from .functions import validate_seismic_file, extract_mseed_data, convert_data_to_stream, get_record_name, delete_file
import os 
import uuid
from pydantic import BaseModel, Field
from typing import Annotated, Literal
from starlette.responses import FileResponse

from .dependencies import get_user_id
from .internals.config import Settings

from .routers import (
    fourier, 
    arrivals, 
    distance_between_points, 
    edit_seismic_file, 
    file_to_mseed, 
    signal_processing
    )

app = FastAPI()

# include the routers
app.include_router(fourier.router)
app.include_router(arrivals.router)
app.include_router(distance_between_points.router)
app.include_router(edit_seismic_file.router)
app.include_router(file_to_mseed.router)
app.include_router(signal_processing.router)

# set the cors
origins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_unique_user_id(request: Request, call_next):
    
    user_id = request.cookies.get("user_id")
    print(user_id, "*****")
    response = await call_next(request)
    if not user_id:
        user_id = str(uuid.uuid4())
        response.set_cookie(
            key="user_id", 
            value=user_id, 
            httponly=False, 
            samesite="none",
            secure=True
        )
    
    return response


@app.get("/")
async def home(user_id: Annotated[str, Depends(get_user_id)]):
    return {"user id": user_id}

@app.get("/download-file")
async def download_file(file: str, user_id: Annotated[str, Depends(get_user_id)]) -> Response:
    file_location = Settings.TEMP_DATA_PATH.value / user_id / file
    return FileResponse(
        file_location, 
        filename=file
        )

@app.post("/upload-seismic-file")
async def upload_seismic_file(file: UploadFile, user_id: str = Depends(get_user_id)):

    # get the SpooledTemporaryFile object
    seismic_file = file.file
    try:
        stream = read(seismic_file)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot read the seismic file: " + str(e))

    # validate the seismic uploaded file
    # stream_validation_message = validate_seismic_file(stream)

    # if the validate function returns a message (str) then, there is an error
    # if stream_validation_message:
    #     raise HTTPException(status_code=404, detail=stream_validation_message)

    # convert the uploaded mseed file to json
    json_data = extract_mseed_data(stream)

    return json_data

class DownloadSeismicFileBody(BaseModel):
    data: list

@app.post("/download-seismic-file")
async def download_seismic_file(download_seismic_file_body: DownloadSeismicFileBody, background_tasks: BackgroundTasks):
    
    
    mseed_file_path = os.path.join(Settings.TEMP_DATA_NAME.value, "mseed-file.mseed")

    stream = convert_data_to_stream(download_seismic_file_body.data)

    stream.write(mseed_file_path)

    background_tasks.add_task(delete_file, mseed_file_path)

    record_name = get_record_name(stream)
    return FileResponse(
        mseed_file_path,
        media_type="text/plain",
        filename=f"{record_name}.mseed",
    )




class TrimWaveformBody(BaseModel):
    trim_left_side: float
    trim_right_side: float
    data: list

@app.post("/trim-waveform")
async def trim_waveform(trim_waveform_body: TrimWaveformBody):
    seismic_data = trim_waveform_body.data 
    trim_left_side = trim_waveform_body.trim_left_side
    trim_right_side = trim_waveform_body.trim_right_side
 
    stream = convert_data_to_stream(seismic_data)
    starttime = stream.traces[0].stats.starttime
    stream.trim(starttime=starttime+trim_left_side, endtime=starttime+trim_left_side+trim_right_side)
    output_dict_data = extract_mseed_data(stream)

    return output_dict_data


class TaperWaveformBody(BaseModel):
    taper_type: str
    taper_length: float
    data: list
    taper_side: Literal["left", "both", "right"] = "left"

@app.post("/taper-waveform")
async def taper_waveform(taper_waveform_body: TaperWaveformBody):
    seismic_data = taper_waveform_body.data 
    taper_type = taper_waveform_body.taper_type
    taper_side = taper_waveform_body.taper_side
    taper_length = taper_waveform_body.taper_length
 
    stream = convert_data_to_stream(seismic_data)
    
    stream.taper(taper_length, type=taper_type, side=taper_side)
    output_dict_data = extract_mseed_data(stream)

    return output_dict_data


class DetrendWaveformBody(BaseModel):
    detrend_type: str
    detrend_order: int
    data: list

@app.post("/detrend-waveform")
async def detrend_waveform(detrend_waveform_body: DetrendWaveformBody):
    seismic_data = detrend_waveform_body.data 
    detrend_type = detrend_waveform_body.detrend_type
    detrend_order = detrend_waveform_body.detrend_order
 
    stream = convert_data_to_stream(seismic_data)
 
    stream.detrend(type=detrend_type)
    output_dict_data = extract_mseed_data(stream)

    return output_dict_data