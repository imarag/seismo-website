from pathlib import Path
from typing import NoReturn

from fastapi import HTTPException, Response
from fastapi.responses import FileResponse

from internals.config import Settings

settings = Settings()
logger = settings.logger


class RequestHandler:
    @staticmethod
    def send_error(error_message: str, status_code: int = 500) -> NoReturn:
        """Raises an HTTPException with a given error message and status code."""
        logger.error(error_message)
        raise HTTPException(detail=error_message, status_code=status_code)

    @staticmethod
    def send_file_response(file_path: Path, file_name: str) -> Response:
        """Returns a file response if the file exists, otherwise raises an HTTPException."""
        if not file_path.exists():
            error_message = f"File not found: {file_path}"
            logger.error(error_message)
            raise HTTPException(status_code=404, detail=error_message)

        return FileResponse(
            file_path,
            filename=file_name,
            headers={"Content-Disposition": f'attachment; filename="{file_name}"'},
        )


def delete_file(file_path: Path) -> None:
    """Delete a file from the server."""
    try:
        if file_path.exists():
            file_path.unlink()
            logger.info(f"Removed file: {file_path}")
        else:
            logger.warning(f"File not found: {file_path}")
    except Exception as e:
        error_message = f"Error deleting file: {e}"
        RequestHandler.send_error(error_message, status_code=500)
