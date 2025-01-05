from enum import Enum
from pathlib import Path

class Settings(Enum):
    TEMP_DATA_NAME = "temp_data"
    RESOURCES_DATA_NAME = "resources_data"
    APP_DIR = Path(__file__).resolve().parent.parent
    RESOURCES_PATH = APP_DIR / RESOURCES_DATA_NAME
    TEMP_DATA_PATH = APP_DIR / TEMP_DATA_NAME
    ARRIVALS_FILE_NAME = "arrivals.txt"
    MSEED_FILE_NAME = "seismic-record.mseed"
