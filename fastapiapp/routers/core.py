from fastapi import APIRouter, UploadFile, BackgroundTasks, Query, Response
from pydantic_extra_types.coordinate import Latitude, Longitude
from typing import Annotated
from functions import (
    convert_stream_to_traces, read_mseed_file_bytes,
    validate_seismic_file, compute_distance, write_json_to_file, write_txt_to_file, 
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

@router.post("/upload-seismic-file", response_model=None)
async def upload_seismic_file(file: UploadFile) -> list | Response:
    """Uploads a seismic file and returns traces."""
    logger.info("Reading the input seismic file")
    seismic_file = file.file
    logger.info("Converting the data into a stream object")
    try:
        stream = read_mseed_file_bytes(seismic_file)
    except Exception:
        error_message = "Invalid seismic file. Please refer to the ObsPy 'read' function documentation for supported file types."
        return RequestHandler.send_error(error_message, 404)

    logger.info("Validating stream object")
    validate_seismic_file(stream)

    logger.info("Converting stream to traces")
    return convert_stream_to_traces(stream)

@router.get("/calculate-distance", response_model=None)
def calculate_distance(
    lat1: Latitude, lon1: Longitude, lat2: Latitude, lon2: Latitude
) -> dict | Response:
    """Calculates the distance between two coordinates."""
    logger.info(f"Calculating distance between ({lat1}, {lon1}) and ({lat2}, {lon2})")
    try:
        result = compute_distance(lat1, lon1, lat2, lon2)
        return {"distance_km": result}
    except Exception as e:
        error_message = f"Distance calculation failed: {e}"
        return RequestHandler.send_error(error_message, 500)
    

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
        return RequestHandler.send_error(error_message, 500)

    return RequestHandler.send_file_response(file_path, file_name)

@router.post("/download-file")
async def download_file(
    background_tasks: BackgroundTasks, 
    download_file_params: DownloadFileParams
) -> Response:
    """Generates and downloads a file in the specified format."""
    if not SupportedDownloadFileTypes.extension_is_supported(download_file_params.file_type):
        error_message = "Unsupported file type!"
        return RequestHandler.send_error(error_message, 404)

    temp_file_name = f"temp-file.{download_file_params.file_type}"
    temp_file_path = Settings.TEMP_DATA_PATH.value / temp_file_name

    try:
        if download_file_params.file_type == SupportedDownloadFileTypes.MSEED.value:
            write_mseed_to_file(download_file_params.data, temp_file_path)
        elif download_file_params.file_type == SupportedDownloadFileTypes.JSON.value:
            write_json_to_file(download_file_params.data, temp_file_path)
        elif download_file_params.file_type == SupportedDownloadFileTypes.TXT.value:
            write_txt_to_file(download_file_params.data, temp_file_path)
    except Exception:
        error_message = "File download failed!"
        return RequestHandler.send_error(error_message, 500)

    background_tasks.add_task(delete_file, temp_file_path)
    return RequestHandler.send_file_response(temp_file_path, temp_file_name)
