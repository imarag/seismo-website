from fastapi import APIRouter, UploadFile, BackgroundTasks, Query, Response
from pydantic_extra_types.coordinate import Latitude, Longitude
from typing import Annotated
from src.functions import (
    convert_stream_to_traces_list, read_bytes_to_mseed,
    validate_stream, compute_distance_km, write_json_to_file, write_txt_to_file, 
    write_mseed_to_file
)
from src.utils import RequestHandler, delete_file
from internals.config import Settings
from internals.models import DownloadFileParams, ArrivalsParams
from internals.static import SupportedDownloadFileTypes

router = APIRouter(
    prefix="/core",
    tags=["Core"],
)

settings = Settings()
logger = settings.logger 

@router.post("/api/upload-seismic-file")
async def upload_seismic_file(file: UploadFile) -> list:
    """Uploads a seismic file and returns a list of Obspy Traces as a dictionary."""
    logger.info("Reading the input seismic file")
    spooled_file = file.file

    logger.info("Converting the data into a stream object")
    stream = read_bytes_to_mseed(spooled_file)
    
    logger.info("Validating stream object")
    validate_stream(stream)
    
    logger.info("Converting stream to list of traces dictionaries")
    return convert_stream_to_traces_list(stream)
    

@router.get("/calculate-distance")
def calculate_distance(
    lat1: Latitude, lon1: Longitude, lat2: Latitude, lon2: Latitude
) -> dict:
    """Calculates the distance between two coordinates."""
    logger.info(f"Calculating distance between ({lat1}, {lon1}) and ({lat2}, {lon2}) in km")
    result = compute_distance_km(lat1, lon1, lat2, lon2)
    distance_km = round(result[0] / 1000, 3) 
    azimuth_a_b = round(result[1], 3)
    azimuth_b_a = round(result[2], 3)
    return {"distance_km": distance_km, "azimuth_a_b": azimuth_a_b, "azimuth_b_a": azimuth_b_a}
    
    
@router.get("/save-arrivals")
def save_arrivals(
    background_tasks: BackgroundTasks,
    arrivals_query: Annotated[ArrivalsParams, Query()]
) -> Response:
    """Saves P and S wave arrivals to a file."""
    dict_arrivals = {"P": arrivals_query.Parr, "S": arrivals_query.Sarr}
    download_file_name = "arrivals.txt" # does not matter (i control it from the frontend)
    arrivals_file_path = settings.temp_folder_path / download_file_name

    with open(arrivals_file_path, "w") as fw:
        fw.write(f"Arrivals\nP: {dict_arrivals['P']}\nS: {dict_arrivals['S']}\n")

    background_tasks.add_task(delete_file, arrivals_file_path)
    return RequestHandler.send_file_response(arrivals_file_path, download_file_name)


@router.get("/download-test-file")
async def download_test_file() -> Response:
    """Downloads a test seismic file."""
    file_name = settings.sample_mseed_file_name
    file_path = settings.resources_folder_path / file_name
    if not file_path.exists():
        error_message = "Test file not found!"
        RequestHandler.send_error(error_message, status_code=404)
    return RequestHandler.send_file_response(file_path, file_name)


@router.post("/download-file")
async def download_file(
    background_tasks: BackgroundTasks, 
    download_file_params: DownloadFileParams
) -> Response:
    """Generates and downloads a file in the specified format."""
    if not SupportedDownloadFileTypes.extension_is_supported(download_file_params.file_type):
        error_message = "Unsupported file type!"
        RequestHandler.send_error(error_message, status_code=404)

    temp_file_name = f"temp-file.{download_file_params.file_type}"
    temp_file_path = settings.temp_folder_path / temp_file_name

    
    if download_file_params.file_type == SupportedDownloadFileTypes.MSEED.value:
        write_file_function = write_mseed_to_file
    elif download_file_params.file_type == SupportedDownloadFileTypes.JSON.value:
        write_file_function = write_json_to_file
    elif download_file_params.file_type == SupportedDownloadFileTypes.TXT.value:
        write_file_function = write_txt_to_file
    
    try:
        write_file_function(download_file_params.data, temp_file_path)
    except Exception as e:
        error_message = f"Cannot download the file: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)

    background_tasks.add_task(delete_file, temp_file_path)
    return RequestHandler.send_file_response(temp_file_path, temp_file_name)
