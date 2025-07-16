import uuid
from datetime import date, datetime, time

from pydantic import BaseModel, Field, computed_field

from utils.helpers import format_datetime_to_record_name


class TraceStats(BaseModel):
    sampling_rate: float = 1
    delta: float = 1
    calib: float = 1
    npts: int = 0
    network: str = ""
    location: str = ""
    station: str = ""
    channel: str = ""
    component: str = " "
    starttime: datetime = Field(default_factory=lambda: datetime(1970, 1, 1, 0, 0, 0))
    endtime: datetime = Field(default_factory=lambda: datetime(1970, 1, 1, 0, 0, 0))

    @computed_field
    def duration(self) -> float:
        """Compute duration in seconds"""
        return self.npts / self.sampling_rate

    @computed_field
    def start_date(self) -> date:
        """Extract the date from the starttime"""
        return self.starttime.date()

    @computed_field
    def start_time(self) -> time:
        """Extract the time from the starttime"""
        return self.starttime.time()

    @computed_field
    def record_name(self) -> str:
        """Extract the record name from starttime and station"""
        return format_datetime_to_record_name(
            self.starttime.date(), self.starttime.time(), self.station
        )


class TraceParams(BaseModel):
    trace_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ydata: list[float] = Field(default_factory=list)
    xdata: list[float] = Field(default_factory=list)
    stats: TraceStats = Field(default_factory=TraceStats)
