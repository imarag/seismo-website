from pydantic import BaseModel, model_validator
from typing_extensions import Self


class ArrivalsParams(BaseModel):
    Parr: float | None = None
    Sarr: float | None = None

    @model_validator(mode="after")
    def check_arrivals(self) -> Self:
        if self.Parr is None and self.Sarr is None:
            error_message = (
                "At least one wave arrival must be "
                "selected (P arrival or S arrival) to use this option!"
            )
            raise ValueError(error_message)

        if (self.Parr is not None and self.Sarr is not None) and (
            self.Sarr <= self.Parr
        ):
            error_message = (
                "The S wave arrival cannot be less or equal to the P wave arrival!"
            )
            raise ValueError(error_message)

        return self
