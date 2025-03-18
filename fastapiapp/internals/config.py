from dataclasses import dataclass
from pathlib import Path
import tempfile
import logging

@dataclass
class Settings:
    logger: logging.Logger = logging.getLogger("uvicorn.error")
    app_dir: Path = Path.cwd()  # Use current working directory

    temp_folder_path: Path = Path(tempfile.gettempdir()) / "temp_data"
    resources_folder_path: Path = app_dir / "resources_data"
    sample_mseed_file_name: str = "seismic-record.mseed"
    mseed_max_npts_allowed: int = 500000

    @property
    def sample_mseed_file_path(self) -> Path:
        return self.resources_folder_path / self.sample_mseed_file_name

    def initialize_folders(self):
        """Create required folders if they don't exist."""
        self.temp_folder_path.mkdir(parents=True, exist_ok=True)
        self.logger.info(f"Initialized temp folder: {self.temp_folder_path}")

# Initialize settings and folders
settings = Settings()
settings.initialize_folders()

