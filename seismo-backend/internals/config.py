import logging
from dataclasses import dataclass
from pathlib import Path

from internals.app_logger import AppLogger
from internals.toml_parser import TomlParser


@dataclass
class Settings:
    log_level: str = "INFO"
    log_format: str = "%(asctime)s — %(levelname)s — %(message)s"
    log_datefmt: str = "%Y-%m-%d %H:%M:%S"
    log_file: str | None = None
    resources_folder_name: str = "resources_data"
    sample_mseed_file_name: str = "seismic-record.mseed"
    mseed_max_npts_allowed: int = 500000
    temp_folder_name: str = "temp_data"
    logger: logging.Logger | None = None

    @property
    def app_root_dir(self) -> Path:
        return Path(__file__).resolve().parent.parent

    @property
    def sample_mseed_file_path(self) -> Path:
        return self.resources_folder_path / self.sample_mseed_file_name

    @property
    def resources_folder_path(self) -> Path:
        return self.app_root_dir / self.resources_folder_name

    @property
    def temp_folder_path(self) -> Path:
        return self.app_root_dir / self.temp_folder_name

    @classmethod
    def from_toml(cls, toml_file: str) -> "Settings":
        parser = TomlParser(toml_file)
        config = parser.get_section("tool.app_settings")

        return cls(**config)

    def get_logger(self) -> logging.Logger:
        if self.logger is None:
            app_logger = AppLogger(
                level=self.log_level,
                log_format=self.log_format,
                date_format=self.log_datefmt,
                file_handler_path=self.log_file,
            )
            self.logger = app_logger.get_logger()
        return self.logger

    def initialize_folders(self) -> None:
        """Create required folders if they don't exist."""
        self.temp_folder_path.mkdir(parents=True, exist_ok=True)
        self.get_logger().info("Initialized temp folder: %s", self.temp_folder_path)
