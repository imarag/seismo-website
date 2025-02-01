from enum import Enum
from pathlib import Path
import logging

logger = logging.getLogger('uvicorn.error')

class Settings(Enum):
    TEMP_DATA_NAME = "temp_data"
    RESOURCES_DATA_NAME = "resources_data"
    APP_DIR = Path(__file__).resolve().parent.parent
    RESOURCES_PATH = APP_DIR / RESOURCES_DATA_NAME
    TEMP_DATA_PATH = APP_DIR / TEMP_DATA_NAME
    ARRIVALS_FILE_NAME = "arrivals.txt"
    MSEED_FILE_NAME = "seismic-record.mseed"
    ARTICLES_PATH = APP_DIR / "articles.json"
    TOOLS_PATH = APP_DIR / "tools.json"
    MARKDOWNS_PATH = APP_DIR / "markdowns"
    STATIC_FOLDER_NAME = "static"
