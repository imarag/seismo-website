from typing import Any

from pydantic import BaseModel


class DownloadFileParams(BaseModel):
    data: Any
    file_name: str | None = None  # the name without the extension
