from pydantic import BaseModel


class DownloadFileParams(BaseModel):
    data: list | dict
    file_type: str
