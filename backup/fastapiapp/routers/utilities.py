from fastapi import APIRouter, UploadFile, HTTPException, BackgroundTasks, Body, Query, Response
from typing import Annotated
from fastapi.responses import FileResponse
from obspy.core import read 
from ..functions import convert_stream_to_traces
import os 
from ..functions import get_record_name, convert_traces_to_stream, delete_file, validate_seismic_file
from ..internals.config import Settings
from obspy.geodetics import gps2dist_azimuth


router = APIRouter(
    prefix="/utilities",
    tags=["utilities"],
)


@router.post("/upload-seismic-file")
async def upload_seismic_file(file: UploadFile):

    # get the SpooledTemporaryFile object
    seismic_file = file.file

    try:
        stream = read(seismic_file)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Cannot read the seismic file: " + str(e))

    # validate the seismic uploaded file
    stream_validation_message = validate_seismic_file(stream)

    # if the validate function returns a message (str) then, there is an error
    if stream_validation_message:
        raise HTTPException(status_code=404, detail=stream_validation_message)

    # convert the uploaded mseed file to json
    json_data = convert_stream_to_traces(stream)

    return json_data


@router.post("/download-seismic-file")
async def download_seismic_file(data: Annotated[list, Body()], background_tasks: BackgroundTasks):
    
    mseed_file_path = os.path.join(Settings.TEMP_DATA_NAME.value, "mseed-file.mseed")

    stream = convert_traces_to_stream(data)

    stream.write(mseed_file_path)

    background_tasks.add_task(delete_file, mseed_file_path)

    record_name = get_record_name(stream)
    return FileResponse(
        mseed_file_path,
        media_type="text/plain",
        filename=f"{record_name}.mseed",
    )


@router.get("/calculate-distance")
def calculate_distance(
    lat1: Annotated[float | int, Query(gt=-90, lt=90)],
    lon1: Annotated[float | int, Query(gt=-180, lt=180)],
    lat2: Annotated[float | int, Query(gt=-90, lt=90)],
    lon2: Annotated[float | int, Query(gt=-180, lt=180)]
    ) -> dict:

    try:
        # calculate the distance
        result = gps2dist_azimuth(lat1, lon1, lat2, lon2)[0] / 1000
        # round the result
        result = round(result, 3)
    except Exception as e:
        error_message = str(e)
        raise HTTPException(status_code=500, detail=error_message)
    
    return {"result": result}


@router.get("/save-arrivals")
def save_arrivals(background_tasks: BackgroundTasks, Parr: float | None = None, Sarr: float | None = None) -> Response:
    # check if the Parr and Sarr exist and create a dict_arrivals dict accordingly
    if Parr is None and Sarr is None:
        error_message = "You need to select at least one wave arrival to use this option!"
        raise HTTPException(status_code=404, detail=error_message)
    
    if (Parr is not None and Sarr is not None) and (Sarr <= Parr):
        error_message = "The S wave arrival cannot be less or equal to the P wave arrival!"
        raise HTTPException(status_code=404, detail=error_message)
    
    # create the dictionary to save the arrivals
    dict_arrivals = {"P": Parr, "S": Sarr}
 
    # set the arrivals and mseed file names and paths
    arrivals_file_name = Settings.ARRIVALS_FILE_NAME.value
    arrivals_file_path = Settings.TEMP_DATA_PATH.value / arrivals_file_name
  
    # write the file to the parent
    with open(arrivals_file_path, "w") as fw:
        fw.write(f"Arrivals \n")
        fw.write(f"P: {dict_arrivals['P']} \n")
        fw.write(f"S: {dict_arrivals['S']} \n")

    background_tasks.add_task(delete_file, str(arrivals_file_path))

    return FileResponse(str(arrivals_file_path), media_type="text/plain", filename=arrivals_file_name)
