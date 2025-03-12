from pydantic import BaseModel, Field, model_validator, computed_field
from typing import Literal
from typing_extensions import Self
import uuid
from internals.static import SupportedDownloadFileTypes
from typing import Any
import datetime


class TraceStats(BaseModel):
    station: str = ""
    component: str = ""
    starttime: datetime.datetime
    endtime: datetime.datetime
    sampling_rate: float
    npts: int

    class Config:
        extra = "ignore"
    
    @computed_field
    def start_date(self) -> str:
        """ Extract the date from starttime """
        return self.starttime.date().isoformat()
    
    @computed_field
    def start_time(self) -> str:
        """ Extract the time from starttime """
        return self.starttime.time().isoformat()
    
    @computed_field
    def duration(self) -> float:
        """ Compute duration in seconds """
        return (self.endtime - self.starttime).total_seconds()
    
    @computed_field
    def record_name(self) -> str:
        """ Extract the record name from starttime """
        start_date_iso = self.starttime.date().isoformat()
        start_time_iso = self.starttime.time().isoformat()
        station = self.station
        if station:
            rec_name = f"{start_date_iso}_{start_time_iso}_{self.station}"
        else:
            rec_name = f"{start_date_iso}_{start_time_iso}"
        rec_name = rec_name.replace(":", "").replace("-", "")
        return rec_name


class TraceParams(BaseModel):
    trace_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ydata: list[float]
    xdata: list[float]
    stats: TraceStats

    class Config:
        extra = "ignore"


class SeismicDataKeys(BaseModel):
    trace_id: str 
    values: list[float]

class TrimOptions(BaseModel):
    sampling_rate: float = Field(gt=0)
    trim_start: float = Field(ge=0)
    trim_end: float = Field(ge=0)

    @model_validator(mode="after")
    def verify_trim_limits(self) -> Self:
        if self.trim_start >= self.trim_end:
            raise ValueError("The left trim value cannot be greater or equal to the right trim value")
        return self

class TrimParams(BaseModel):
    data: list[SeismicDataKeys]
    options: TrimOptions

class TaperOptions(BaseModel):
    sampling_rate: float = Field(gt=0)
    taper_type: Literal[
        "cosine",
        "barthann",
        "bartlett",
        "blackman",
        "blackmanharris",
        "bohman",
        "boxcar",
        "chebwin",
        "flattop",
        "gaussian",
        "general_gaussian",
        "hamming",
        "hann",
        "kaiser",
        "nuttall",
        "parzen",
        "slepian",
        "triang"
    ] = "parzen"
    taper_side: Literal["left", "both", "right"] = "both"
    taper_length: float

class TaperParams(BaseModel):
    data: list[SeismicDataKeys]
    options: TaperOptions

class DetrendOptions(BaseModel):
    sampling_rate: float = Field(gt=0)
    detrend_type: Literal["simple", "linear", "constant"]

class DetrendParams(BaseModel):
    data: list[SeismicDataKeys]
    options: DetrendOptions
    
class FilterOptions(BaseModel):
    sampling_rate: float = Field(gt=0)
    freq_min: float | None = None
    freq_max: float | None = None

    @model_validator(mode="after")
    def verify_filter_limits(self) -> Self:

        if self.freq_min is not None and self.freq_max is not None and self.freq_min >= self.freq_max:
            raise ValueError("The min frequency value cannot be greater or equal to the max frequency value!")
        return self

class FilterParams(BaseModel):
    data: list[SeismicDataKeys]
    options: FilterOptions



class FourierData(BaseModel):
    trace_id: str
    component: str
    values: list[float]

class FourierParams(BaseModel):
    traces_data: list[FourierData]
    sampling_rate: float = Field(gt=0)

class HVSRData(BaseModel):
    component: Literal["horizontal", "vertical"]
    values: list[float]

class HVSRParams(BaseModel):
    fourier_data: list[HVSRData]

class DownloadFileParams(BaseModel):
    data: list | dict
    file_type: str

class ArrivalsParams(BaseModel):
    Parr: float | None = None
    Sarr: float | None = None

    @model_validator(mode='after')
    def check_arrivals(self) -> Self:
        if self.Parr is None and self.Sarr is None:
            raise ValueError("At least one wave arrival must be selected (P arrival or S arrival) to use this option!")
    
        if (self.Parr is not None and self.Sarr is not None) and (self.Sarr <= self.Parr):
            raise ValueError("The S wave arrival cannot be less or equal to the P wave arrival!")
        
        return self
    
class AddTraceParams(BaseModel):
    skiprows: int = 0
    column: int = 1
    station: str
    component: str
    startdate: datetime.date
    starttime: datetime.time
    fs: float
