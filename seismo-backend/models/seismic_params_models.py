import datetime
import uuid

import numpy as np
from obspy.core import Trace
from pydantic import BaseModel, Field, computed_field, model_validator
from typing_extensions import Self


class TraceStats(BaseModel):
    sampling_rate: float = 1
    delta: float = 1
    calib: float = 1
    npts: int = 0
    network: str = ""
    location: str = ""
    station: str = ""
    channel: str = ""
    starttime: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime(1970, 1, 1)
    )
    endtime: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime(1970, 1, 1)
    )

    @computed_field
    def duration(self) -> float:
        """Compute duration in seconds"""
        return self.npts / self.sampling_rate

    @computed_field
    def component(self) -> str:
        """Extract the component from the channel (last char of channel attribute)"""
        if self.channel:
            return self.channel[-1]
        return "C"

    @computed_field
    def start_date(self) -> datetime.date:
        """Extract the date from the starttime"""
        return self.starttime.date()

    @computed_field
    def start_time(self) -> datetime.time:
        """Extract the time from the starttime"""
        return self.starttime.time()

    @computed_field
    def record_name(self) -> str:
        """Extract the record name from starttime"""
        start_date_iso = self.start_date.isoformat()
        start_time_iso = self.start_time.isoformat()
        if self.station:
            rec_name = f"{start_date_iso}_{start_time_iso}_{self.station}"
        else:
            rec_name = f"{start_date_iso}_{start_time_iso}"
        return rec_name.replace(":", "").replace("-", "")


class TraceParams(BaseModel):
    trace_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ydata: list[float] = Field(default_factory=list)
    xdata: list[float] = Field(default_factory=list)
    stats: TraceStats = Field(default_factory=TraceStats)

    @model_validator(mode="after")
    def verify_trace(self) -> Self:
        try:
            Trace(data=np.array(self.ydata), header=self.stats.model_dump())
        except Exception as e:
            raise ValueError(str(e)) from e
        return self
