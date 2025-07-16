from pathlib import Path
from typing import NoReturn

from fastapi import HTTPException, Response
from fastapi.responses import FileResponse

from config import settings


class RequestHandler:
    @staticmethod
    def send_error(error_message: str, status_code: int = 500) -> NoReturn:
        """Raises an HTTPException with a given error message and status code."""
        settings.logger.error(error_message)
        raise HTTPException(detail=error_message, status_code=status_code)

    @staticmethod
    def send_file_response(file_path: Path) -> Response:
        """Returns file response if the file exists, otherwise raises HTTPException."""
        if not file_path.exists():
            error_message = f"File not found: {file_path}"
            settings.logger.error(error_message)
            raise HTTPException(status_code=404, detail=error_message)
        file_name = file_path.name
        return FileResponse(
            file_path,
            filename=file_name,
            headers={"Content-Disposition": f'attachment; filename="{file_name}"'},
        )
