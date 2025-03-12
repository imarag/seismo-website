from enum import Enum 

class SupportedDownloadFileTypes(Enum):
    TXT = "txt"
    MSEED = "mseed"
    JSON = "json"
    CSV = "csv"
    XLSX = "xlsx"

    @classmethod
    def list_supported_file_extensions(cls) -> list[str]:
        """Returns a list of supported file extensions."""
        return [ext.value for ext in cls]
    
    @classmethod
    def extension_is_supported(cls, extension: str) -> bool:
        """Checks if the given file extension is supported."""
        return extension.lower() in cls.list_supported_file_extensions()


class SupportedUploadFileTypes(Enum):
    TXT = "txt"
    CSV = "csv"
    XLSX = "xlsx"

    @classmethod
    def list_supported_extensions(cls) -> list[str]:
        """Returns a list of supported file extensions."""
        return [ext.value for ext in cls]
    
    @classmethod
    def extension_is_supported(cls, extension: str) -> bool:
        """Checks if the given file extension is supported."""
        return extension.lower() in cls.list_supported_extensions()
