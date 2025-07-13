import json
from pathlib import Path
from typing import IO, Any

from fastapi import BackgroundTasks
from obspy.core import Stream, read

from config import settings
from core.request_handler import RequestHandler
from utils.static import SupportedDownloadFileTypes


def read_seismic_file(seismic_file: str | Path | IO[bytes]) -> Stream:
    """
    Reads the given seismic file and returns an ObsPy Stream object.

    Args:
        seismic_file: A file path as string or pathlib Path or a file-like object.

    Returns:
        Stream: An ObsPy Stream object.
    """
    try:
        return read(seismic_file)
    except Exception as e:
        error_message = (
            "Invalid seismic file. Please refer to the ObsPy 'read' function "
            f"documentation for supported file types. Error: {str(e)}"
        )
        RequestHandler.send_error(error_message, status_code=404)
        raise


def write_to_temp_folder(
    file_name: str,
    file_content: Any,  # noqa: ANN401, F821
    background_tasks: BackgroundTasks,
) -> None:
    temp_file_path = settings.temp_folder_path / file_name

    try:
        if isinstance(file_content, Stream):
            write_stream_to_mseed(file_content, temp_file_path)
        elif isinstance(file_content, str):
            write_text_to_txt(file_content, temp_file_path)
        elif isinstance(file_content, dict | list):
            write_object_to_json(file_content, temp_file_path)
        else:
            RequestHandler.send_error(
                "The content provided is not supported!", status_code=500
            )
    except Exception as e:
        RequestHandler.send_error(str(e), status_code=500)

    background_tasks.add_task(delete_file, temp_file_path)


def write_object_to_json(data_object: list | dict, file_path: Path) -> None:
    """Helper function to write dict or list to json."""
    file_path = file_path.with_suffix(".json")
    with file_path.open("w") as fw:
        json.dump(data_object, fw)


def write_text_to_txt(str_content: str, file_path: Path) -> None:
    """Helper function to write text data to a file."""
    file_path = file_path.with_suffix(".txt")
    with file_path.open("w") as fw:
        fw.write(str_content)


def write_stream_to_mseed(stream: Stream, file_path: Path) -> None:
    """Helper function to write stream to a file."""
    file_path = file_path.with_suffix(".mseed")
    stream.write(file_path)


def delete_file(file_path: Path) -> None:
    """Delete a file from the server."""
    try:
        if file_path.exists():
            file_path.unlink()
            settings.logger.info("Removed file: %s", file_path)
        else:
            settings.logger.warning("File not found: %s", file_path)
    except Exception as e:
        error_message = f"Error deleting file: {e}"
        RequestHandler.send_error(error_message, status_code=500)
