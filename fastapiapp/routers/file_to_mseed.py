from fastapi import APIRouter

router = APIRouter(
    prefix="/file-to-mseed",
    tags=["file-to-mseed"],
)