from pydantic import BaseModel, Field, ValidationError, model_validator
from typing import Literal
from typing_extensions import Self
import datetime 


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

