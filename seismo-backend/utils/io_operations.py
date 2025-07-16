import json
from pathlib import Path
from typing import IO, Any

from fastapi import BackgroundTasks
from obspy.core import Stream, read

from config import settings
from core.request_handler import RequestHandler


def read_seismic_file(seismic_file: str | Path | IO[bytes]) -> Stream:
    """
    Reads the given seismic file and returns an ObsPy Stream object.
    """
    try:
        return read(seismic_file)
    except Exception:
        error_message = (
            "Invalid seismic file. Please refer to the ObsPy 'read' function "
            "documentation for supported file types"
        )
        RequestHandler.send_error(error_message, status_code=400)


def write_to_temp_folder(
    file_name: str,
    file_content: Any,  # noqa: ANN401, F821
    background_tasks: BackgroundTasks,
) -> Path:
    file_ext, write_function = get_uploaded_data_info(file_content)
    temp_file_path = settings.temp_folder_path / (file_name + "." + file_ext)

    try:
        write_function(file_content, temp_file_path)
    except Exception as e:
        RequestHandler.send_error(str(e), status_code=500)

    background_tasks.add_task(delete_file, temp_file_path)
    return temp_file_path


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


def get_uploaded_data_info(data: Any) -> tuple:  # noqa: ANN401
    file_info = None
    if isinstance(data, str):
        file_info = ("txt", write_text_to_txt)
    elif isinstance(data, (dict, list)):
        file_info = ("json", write_object_to_json)
    elif isinstance(data, Stream):
        file_info = ("mseed", write_stream_to_mseed)
    else:
        error_message = "Unsupported data type!"
        RequestHandler.send_error(error_message, status_code=500)

    return file_info
