from fastapi import APIRouter, UploadFile, BackgroundTasks, Query, Response, HTTPException
from pydantic_extra_types.coordinate import Latitude, Longitude
from typing import Annotated
from functions import (
    convert_stream_to_traces_list, read_bytes_to_mseed,
    validate_stream, compute_distance, write_json_to_file, write_txt_to_file, 
    write_mseed_to_file
)
from internals.config import Settings, logger
from models import DownloadFileParams, ArrivalsParams
from static import SupportedDownloadFileTypes
from utils import RequestHandler, delete_file

router = APIRouter(
    prefix="/core",
    tags=["Core"],
)

@router.post("/upload-seismic-file")
async def upload_seismic_file(file: UploadFile) -> list:
    """Uploads a seismic file and returns traces."""
    logger.info("Reading the input seismic file")
    spooled_file = file.file

    logger.info("Converting the data into a stream object")
    stream = read_bytes_to_mseed(spooled_file)
    
    logger.info("Validating stream object")
    validate_stream(stream)
    
    logger.info("Converting stream to traces")
    return convert_stream_to_traces_list(stream)
    

@router.get("/calculate-distance")
def calculate_distance(
    lat1: Latitude, lon1: Longitude, lat2: Latitude, lon2: Latitude
) -> dict:
    """Calculates the distance between two coordinates."""
    logger.info(f"Calculating distance between ({lat1}, {lon1}) and ({lat2}, {lon2})")
    result = compute_distance(lat1, lon1, lat2, lon2)
    return {"distance_km": result}
    
    
@router.get("/save-arrivals")
def save_arrivals(
    background_tasks: BackgroundTasks,
    arrivals_query: Annotated[ArrivalsParams, Query()]
) -> Response:
    """Saves P and S wave arrivals to a file."""
    dict_arrivals = {"P": arrivals_query.Parr, "S": arrivals_query.Sarr}
    arrivals_file_path = Settings.TEMP_DATA_PATH.value / Settings.ARRIVALS_FILE_NAME.value

    with open(arrivals_file_path, "w") as fw:
        fw.write(f"Arrivals\nP: {dict_arrivals['P']}\nS: {dict_arrivals['S']}\n")

    background_tasks.add_task(delete_file, arrivals_file_path)
    return RequestHandler.send_file_response(arrivals_file_path, Settings.ARRIVALS_FILE_NAME.value)


@router.get("/download-test-file")
async def download_test_file() -> Response:
    """Downloads a test seismic file."""
    file_name = "20150724_095834_KRL1.mseed"
    file_path = Settings.TEMP_DATA_PATH.value / file_name
    if not file_path.exists():
        error_message = "Test file not found!"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)
    return RequestHandler.send_file_response(file_path, file_name)


@router.post("/download-file")
async def download_file(
    background_tasks: BackgroundTasks, 
    download_file_params: DownloadFileParams
) -> Response:
    """Generates and downloads a file in the specified format."""
    if not SupportedDownloadFileTypes.extension_is_supported(download_file_params.file_type):
        error_message = "Unsupported file type!"
        logger.error(error_message)
        raise HTTPException(status_code=404, detail=error_message)

    temp_file_name = f"temp-file.{download_file_params.file_type}"
    temp_file_path = Settings.TEMP_DATA_PATH.value / temp_file_name

    if download_file_params.file_type == SupportedDownloadFileTypes.MSEED.value:
        write_mseed_to_file(download_file_params.data, temp_file_path)
    elif download_file_params.file_type == SupportedDownloadFileTypes.JSON.value:
        write_json_to_file(download_file_params.data, temp_file_path)
    elif download_file_params.file_type == SupportedDownloadFileTypes.TXT.value:
        write_txt_to_file(download_file_params.data, temp_file_path)

    background_tasks.add_task(delete_file, temp_file_path)
    return RequestHandler.send_file_response(temp_file_path, temp_file_name)
