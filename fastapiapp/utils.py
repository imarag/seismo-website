from fastapi import HTTPException, Response
from internals.config import logger
from pathlib import Path
from fastapi.responses import FileResponse
import os 

class RequestHandler:
    @staticmethod
    def send_error(error_message: str, status_code: int = 500) -> Response:
        """Raises an HTTPException with a given error message and status code."""
        logger.error(error_message)
        raise HTTPException(status_code=status_code, detail=error_message)
    
    @staticmethod
    def send_file_response(file_path: Path, file_name: str) -> Response:
        return FileResponse(
            file_path,
            filename=file_name,
            headers={"Content-Disposition": f'attachment; filename="{file_name}"'}
        )


def delete_file(file_path: Path):
    """Delete a file from the server."""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted file: {file_path}")
    except Exception as e:
        print(f"Error deleting file: {e}")