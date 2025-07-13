from typing import Literal

from pydantic import BaseModel, Field, model_validator
from typing_extensions import Self


class TrimOptions(BaseModel):
    trim_start: float = Field(ge=0)
    trim_end: float = Field(ge=0)

    @model_validator(mode="after")
    def verify_trim_limits(self) -> Self:
        if self.trim_start >= self.trim_end:
            error_message = (
                "The start trim value cannot be greater or equal to the end trim value"
            )
            raise ValueError(error_message)
        return self


class TrimParams(BaseModel):
    trace_data: dict | list
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
    trace_data: dict | list
    options: TaperOptions


class DetrendOptions(BaseModel):
    detrend_type: Literal["simple", "linear", "constant"]


class DetrendParams(BaseModel):
    trace_data: dict | list
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
            error_message = (
                "The min frequency value cannot be greater or equal "
                "to the max frequency value!"
            )
            raise ValueError(error_message)
        return self


class FilterParams(BaseModel):
    trace_data: dict | list
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
