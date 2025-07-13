from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Query, Response, UploadFile

from config import settings
from core.request_handler import RequestHandler
from models.common_models import DownloadFileParams
from models.preprocessing_models import ArrivalsParams
from utils.io_operations import read_seismic_file, write_to_temp_folder
from utils.transformations import convert_stream_to_list
from utils.validators import validate_stream

router = APIRouter()


@router.get("/save-arrivals")
def save_arrivals(
    background_tasks: BackgroundTasks,
    arrivals_query: Annotated[ArrivalsParams, Query()],
) -> Response:
    content = f"Arrivals\nP: {arrivals_query.Parr}\nS: {arrivals_query.Sarr}\n"
    file_name = "arrivals.txt"
    write_to_temp_folder(file_name, content, background_tasks)
    arrivals_file_path = settings.temp_folder_path / file_name
    return RequestHandler.send_file_response(arrivals_file_path)


@router.post("/upload-seismic-file")
async def upload_seismic_file(file: UploadFile) -> list:
    """Uploads a seismic file and returns a list of Obspy Traces as a dictionary."""
    settings.logger.info("Reading the input seismic file")
    spooled_file = file.file

    settings.logger.info("Converting the data into a stream object")
    stream = read_seismic_file(spooled_file)

    settings.logger.info("Validating stream object")
    validate_stream(stream)

    settings.logger.info("Converting stream to list of traces dictionaries")
    return convert_stream_to_list(stream)


@router.get("/download-sample-file")
async def download_sample_file() -> None:
    """Downloads a sample seismic file."""
    file_name = settings.sample_mseed_file_name
    file_path = settings.resources_folder_path / file_name
    if not file_path.exists():
        error_message = "Sample file not found!"
        RequestHandler.send_error(error_message, status_code=404)
    RequestHandler.send_file_response(file_path)


@router.post("/download-file")
async def download_file(
    background_tasks: BackgroundTasks, download_file_params: DownloadFileParams
) -> Response:
    """Generates and downloads a file in the specified format."""

    temp_file_name = f"temp-file.{download_file_params.file_type}"
    temp_file_path = settings.temp_folder_path / temp_file_name

    try:
        write_to_temp_folder(download_file_params.data, background_tasks)
    except Exception as e:
        error_message = f"Cannot download the file: {str(e)}"
        RequestHandler.send_error(error_message, status_code=500)

    return RequestHandler.send_file_response(temp_file_path)
