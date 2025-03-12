from dataclasses import dataclass
from pathlib import Path
import logging

@dataclass
class Settings:
    logger: logging.Logger = logging.getLogger("uvicorn.error")
    app_dir: Path = Path(__file__).resolve().parent.parent
    temp_folder_name: str = "temp_data"
    resources_folder_name: str = "resources_data"
    sample_mseed_file_name: str = "seismic-record.mseed"
    mseed_max_npts_allowed: int = 500000

    @property
    def temp_folder_path(self) -> Path:
        return self.app_dir / self.temp_folder_name

    @property
    def resources_folder_path(self) -> Path:
        return self.app_dir / self.resources_folder_name

    @property
    def sample_mseed_file_path(self) -> Path:
        return self.resources_folder_path / self.sample_mseed_file_name
