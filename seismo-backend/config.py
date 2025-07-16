import logging
from dataclasses import dataclass
from pathlib import Path

from core.app_logger import AppLogger
from core.toml_parser import TomlParser

APP_ROOT_DIR = Path(__file__).resolve().parent


@dataclass
class Settings:
    log_level: str = "INFO"
    log_format: str = "%(asctime)s — %(levelname)s — %(message)s"
    log_datefmt: str = "%Y-%m-%d %H:%M:%S"
    resources_folder_name: str = "resources_data"
    temp_folder_name: str = "temp_data"
    sample_mseed_file_name: str = "seismic-record.mseed"
    mseed_max_npts_allowed: int = 500000
    _logger: logging.Logger | None = None
    host: str = "127.0.0.1"
    port: str = "8000"

    @property
    def app_root_dir(self) -> Path:
        return APP_ROOT_DIR

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
    def from_toml(cls, toml_file_name: str) -> "Settings":
        # look for toml file in the root dir
        toml_file_path = APP_ROOT_DIR / toml_file_name
        parser = TomlParser(toml_file_path)
        config = parser.get_section("tool.app_settings")

        return cls(**config)

    @property
    def logger(self) -> logging.Logger:
        if self._logger is None:
            app_logger = AppLogger(
                level=self.log_level,
                log_format=self.log_format,
                date_format=self.log_datefmt,
            )
            self._logger = app_logger.get_logger()
        return self._logger

    def log_attr_information(self) -> None:
        self.logger.info("Application directories initialized successfully.")
        self.logger.info("Settings:")
        self.logger.info("---------")
        attrs = [
            f"{attr}: {getattr(self, attr)}"
            for attr in dir(Settings)
            if not attr.startswith("__")
        ]
        self.logger.info("\n".join(attrs))

    def initialize_app(self) -> None:
        """Create necessary directories and log application initialization."""
        self.temp_folder_path.mkdir(parents=True, exist_ok=True)
        self.resources_folder_path.mkdir(parents=True, exist_ok=True)
        # self.log_attr_information()  # noqa: ERA001


settings = Settings.from_toml("pyproject.toml")
