from fastapi import APIRouter, UploadFile ,HTTPException, BackgroundTasks, Body, Query, Response
from pydantic import BaseModel, model_validator
from pydantic_extra_types.coordinate import Latitude, Longitude
from fastapi.encoders import jsonable_encoder
from fastapi.responses import FileResponse
from typing import Annotated
from obspy.core import read 
from functions import convert_stream_to_traces
from functions import get_record_name, convert_traces_to_stream, delete_file, validate_seismic_file
from internals.config import Settings, logger
from obspy.geodetics import gps2dist_azimuth
from typing_extensions import Self

router = APIRouter(
    prefix="/utilities",
    tags=["utilities"],
)

@router.post("/upload-seismic-file")
async def upload_seismic_file(file: UploadFile):

    logger.info("Reading the input seismic file")
    seismic_file = file.file # SpooledTemporaryFile object

    logger.info("converting the data into a stream object")
    try:
        stream = read(seismic_file)
    except Exception as e:
        error_message = "Cannot read the file. Please verify that the file is a valid seismic file and try again (https://docs.obspy.org/packages/autogen/obspy.core.stream.read.html)."
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)

    logger.info("validating stream object")
    validate_seismic_file(stream)

    logger.info("converting stream object to a list of traces")

    output_traces = convert_stream_to_traces(stream)

    return output_traces.traces


@router.get("/calculate-distance")
def calculate_distance(
    lat1: Latitude,
    lon1: Longitude,
    lat2: Latitude,
    lon2: Longitude
    ) -> dict:

    logger.info(f"calculating the distance between Point1({lat1}-{lon1}) and Point2({lat2}-{lon2})")
    try:
        result = gps2dist_azimuth(lat1, lon1, lat2, lon2)[0] / 1000
        result = round(result, 3)
    except Exception as e:
        error_message = f"Cannot compute the distance between the points: {str(e)}"
        raise HTTPException(status_code=500, detail=error_message)
    
    return {"result": result}



class ArrivalsParams(BaseModel):
    Parr: float | None = None
    Sarr: float | None = None

    @model_validator(mode='after')
    def check_arrivals(self) -> Self:
        if self.Parr is None and self.Sarr is None:
            raise ValueError("At least one wave arrival must be selected (P arrival or S arrival) to use this option!")
    
        if (self.Parr is not None and self.Sarr is not None) and (self.Sarr <= self.Parr):
            raise ValueError("The S wave arrival cannot be less or equal to the P wave arrival!")
        
        return self

@router.get("/save-arrivals")
def save_arrivals(background_tasks: BackgroundTasks, arrivals_query: Annotated[ArrivalsParams, Query()]) -> Response:
    dict_arrivals = {"P": arrivals_query.Parr, "S": arrivals_query.Sarr}
    
    arrivals_file_name = Settings.ARRIVALS_FILE_NAME.value
    arrivals_file_path = Settings.TEMP_DATA_PATH.value / arrivals_file_name

    with open(arrivals_file_path, "w") as fw:
        fw.write(f"Arrivals \n")
        fw.write(f"P: {dict_arrivals['P']} \n")
        fw.write(f"S: {dict_arrivals['S']} \n")

    background_tasks.add_task(delete_file, str(arrivals_file_path))

    return FileResponse(
        str(arrivals_file_path), 
        media_type="text/plain", 
        filename=arrivals_file_name
    )




