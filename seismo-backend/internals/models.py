from pydantic import BaseModel, Field, model_validator, computed_field
from typing import Literal
from typing_extensions import Self
import uuid
import datetime
import numpy as np
from obspy.core import Trace


class TraceStats(BaseModel):
    station: str = ""
    component: str = ""
    start_date: datetime.date = datetime.date(1970, 1, 1)
    start_time: datetime.time = datetime.time(0, 0, 0)
    sampling_rate: float
    npts: int

    class Config:
        extra = "ignore"

    @computed_field
    def end_time(self) -> datetime.datetime:
        """Extract the time from starttime"""
        start_date_time = datetime.datetime.fromisoformat(
            f"{self.start_date} {self.start_time}"
        )
        return start_date_time + datetime.timedelta(
            seconds=self.npts / self.sampling_rate
        )

    @computed_field
    def duration(self) -> float:
        """Compute duration in seconds"""
        return self.npts / self.sampling_rate

    @computed_field
    def record_name(self) -> str:
        """Extract the record name from starttime"""
        start_date_iso = self.start_date.isoformat()
        start_time_iso = self.start_time.isoformat()
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

    @model_validator(mode="after")
    def verify_trace(self) -> Self:
        try:
            Trace(data=np.array(self.ydata), header=self.stats.model_dump())
        except Exception as e:
            raise ValueError(str(e))
        return self


class TrimOptions(BaseModel):
    trim_start: float = Field(ge=0)
    trim_end: float = Field(ge=0)

    @model_validator(mode="after")
    def verify_trim_limits(self) -> Self:
        if self.trim_start >= self.trim_end:
            raise ValueError(
                "The start trim value cannot be greater or equal to the end trim value"
            )
        return self


class TrimParams(BaseModel):
    traces: list
    options: TrimOptions


class TaperOptions(BaseModel):
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
        "triang",
    ] = "parzen"
    taper_side: Literal["left", "both", "right"] = "both"
    taper_length: float


class TaperParams(BaseModel):
    traces: list
    options: TaperOptions


class DetrendOptions(BaseModel):
    detrend_type: Literal["simple", "linear", "constant"]


class DetrendParams(BaseModel):
    traces: list
    options: DetrendOptions


class FilterOptions(BaseModel):
    freq_min: float | None = None
    freq_max: float | None = None

    @model_validator(mode="after")
    def verify_filter_limits(self) -> Self:

        if (
            self.freq_min is not None
            and self.freq_max is not None
            and self.freq_min >= self.freq_max
        ):
            raise ValueError(
                "The min frequency value cannot be greater or equal to the max frequency value!"
            )
        return self


class FilterParams(BaseModel):
    traces: list
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

    @model_validator(mode="after")
    def check_arrivals(self) -> Self:
        if self.Parr is None and self.Sarr is None:
            raise ValueError(
                "At least one wave arrival must be selected (P arrival or S arrival) to use this option!"
            )

        if (self.Parr is not None and self.Sarr is not None) and (
            self.Sarr <= self.Parr
        ):
            raise ValueError(
                "The S wave arrival cannot be less or equal to the P wave arrival!"
            )

        return self


class AddTraceParams(BaseModel):
    skip_rows: int = 0
    column_index: int = 1
    station: str
    component: str
    start_date: datetime.date
    start_time: datetime.time
    sampling_rate: float
