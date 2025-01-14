from pydantic import BaseModel, Field, ValidationError, model_validator
from typing import Literal
from typing_extensions import Self
import datetime 

class TraceStats(BaseModel):
    starttime: datetime.datetime
    endtime: datetime.datetime
    npts: int 
    sampling_rate: float 
    station: str 
    channel: str
    start_date: datetime.date
    start_time: datetime.time
    duration: float

class TraceData(BaseModel):
    record_name: str 
    ydata: list 
    xdata: list 
    id: str
    stats: TraceStats

class StreamData(BaseModel):
    traces: list[TraceData]


class TrimParamsObject(BaseModel):
    values: list[float]
    sampling_rate: float = Field(gt=0)
    left_trim: float = Field(ge=0)
    right_trim: float = Field(ge=0)

    @model_validator(mode="after")
    def verify_trim_limits(self) -> Self:
        if self.left_trim >= self.right_trim:
            raise ValueError("The left trim value cannot be greater or equal to the right trim value")
        
        total_duration = len(self.values) / self.sampling_rate 

        if self.right_trim > total_duration:
            raise ValueError("The right trim value cannot be greater than the total waveform duration")
        
        return self

class TrimParams(BaseModel):
    seismic_data: TrimParamsObject | list[TrimParamsObject]



class TaperParamsObject(BaseModel):
    values: list[float]
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
    taper_length: float = 1

class TaperParams(BaseModel):
    seismic_data: TaperParamsObject | list[TaperParamsObject]

    

class DetrendParamsObject(BaseModel):
    values: list[float]
    sampling_rate: float = Field(gt=0)
    detrend_type: Literal["simple", "linear", "constant"]

class DetrendParams(BaseModel):
    seismic_data: DetrendParamsObject | list[DetrendParamsObject]



class FilterParamsObject(BaseModel):
    values: list[float]
    sampling_rate: float
    left_filter: float | None
    right_filter: float | None

    @model_validator(mode="after")
    def verify_filter_limits(self) -> Self:
        if self.left_filter is None and self.right_filter is None:
            raise ValueError("You must provide at least one of the left or right filter values to apply the filtering.")        
        
        elif self.left_filter is not None and self.right_filter is not None and self.left_filter >= self.right_filter:
            raise ValueError("The left filter value cannot be greater or equal to the right filter value")
        return self

class FilterParams(BaseModel):
    seismic_data: FilterParamsObject | list[FilterParamsObject]

