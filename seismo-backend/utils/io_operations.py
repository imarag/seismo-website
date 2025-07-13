import json
from pathlib import Path
from typing import Any

from obspy.core import Stream, read

from config import settings
from core.request_handler import RequestHandler
from utils.transformations import convert_list_to_stream


def read_bytes_to_stream(seismic_file_bytes: Any) -> Stream:
    """Reads the given seismic file bytes and returns a Stream object."""
    try:
        return read(seismic_file_bytes)
    except Exception as e:
        error_message = (
            "Invalid seismic file. Please refer to the ObsPy 'read' function "
            f"documentation for supported file types. Error: {str(e)}"
        )
        RequestHandler.send_error(error_message, status_code=404)


def read_path_into_stream(file_path: str) -> Stream:
    """Reads the given file path and returns a Stream object."""
    try:
        return read(file_path)
    except Exception as e:
        error_message = (
            "Invalid seismic file. Please refer to the ObsPy 'read' function "
            f"documentation for supported file types. Error: {str(e)}"
        )
        RequestHandler.send_error(error_message, status_code=404)


def write_json_to_file(data: list | dict, path: Path) -> None:
    """Helper function to write JSON data to a file."""
    with path.open("w") as fw:
        json.dump(data, fw)


def write_txt_to_file(data: list | dict, path: Path) -> None:
    """Helper function to write text data to a file."""
    with path.open("w") as fw:
        json_string = json.dumps(data)
        fw.write(json_string)


def write_mseed_to_file(data: list, path: Path) -> None:
    """Helper function to write miniseed data to a file."""
    stream = convert_list_to_stream(data)
    stream.write(path)


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
