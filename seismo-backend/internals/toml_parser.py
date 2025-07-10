from pathlib import Path
from typing import NoReturn

import tomllib


class TomlParser:
    def __init__(self, file_path: str) -> None:
        self.file_path = Path(file_path)

        if not self.file_path.exists():
            error_message = f"TOML file does not exist: {self.file_path}"
            raise FileNotFoundError(error_message)

        self.data = self.parse_file()

    def parse_file(self) -> dict:
        with self.file_path.open("rb") as fr:
            return tomllib.load(fr)

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
