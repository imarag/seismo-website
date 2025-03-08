from fastapi import HTTPException, Response
from internals.config import logger
from pathlib import Path
from fastapi.responses import FileResponse

class RequestHandler:
    @staticmethod
    def send_file_response(file_path: Path, file_name: str) -> Response:
        """Returns a file response if the file exists, otherwise raises an HTTPException."""
        if not file_path.exists():
            error_message = f"File not found: {file_path}"
            logger.error(error_message)
            HTTPException(status_code=404, detail=error_message)

        return FileResponse(
            file_path,
            filename=file_name,
            headers={"Content-Disposition": f'attachment; filename="{file_name}"'}
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
        logger.error(error_message)
        HTTPException(status_code=404, detail=error_message)
