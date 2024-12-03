from dataclasses import dataclass
from obspy.core import read, Stream
from tempfile import SpooledTemporaryFile

@dataclass
class UploadFileHandler:
    spooled_file: SpooledTemporaryFile

    def convert_spool_file_to_stream(self) -> Stream | str:
        try:
            st = read(self.spooled_file)
        except Exception as e:
            return str(e)
        
        return st

