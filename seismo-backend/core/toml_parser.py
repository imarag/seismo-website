from pathlib import Path
from typing import NoReturn

import tomllib


class TomlParser:
    def __init__(self, file_path: Path) -> None:
        self.file_path = Path(file_path)

        if not self.file_path.exists() or not self.file_path.is_file():
            error_message = f"Missing TOML configuration file at: {self.file_path}"
            raise FileNotFoundError(error_message)

        self.data = self.parse_file()

    def parse_file(self) -> dict:
        try:
            with self.file_path.open("rb") as fr:
                return tomllib.load(fr)
        except FileNotFoundError as exc:
            error_message = f"TOML file not found: {self.file_path}"
            raise FileNotFoundError(error_message) from exc
        except tomllib.TOMLDecodeError as exc:
            error_message = f"Failed to parse TOML file {self.file_path}: {exc}"
            raise ValueError(error_message) from exc
        except Exception as e:
            error_message = (
                f"Unexpected error while reading TOML file {self.file_path}: {e}"
            )
            raise RuntimeError(error_message) from e

    def get_section(self, section_path: str) -> dict | NoReturn:
        """
        Retrieve a nested section using dot notation like 'tool.app_logger'.
        Returns None if the section is not found.
        """
        path_segments = section_path.split(".")
        value = self.data
        for seg in path_segments:
            if isinstance(value, dict) and seg in value:
                value = value[seg]
            else:
                error_message = f"Section path invalid: {section_path}"
                raise KeyError(error_message)
        return value
