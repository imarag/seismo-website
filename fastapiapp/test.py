from internals.config import Settings
from obspy.core import Trace, Stream
import numpy as np
import re
from pydantic import BaseModel, Field, model_validator, computed_field
from typing import Literal
from typing_extensions import Self
import uuid
from typing import Any
import datetime
import numpy as np
from obspy.core import Trace
settings = Settings()
mseed_path = settings.sample_mseed_file_path




class TraceStats(BaseModel):
    station: str = " "
    component: str = " "
    start_date: datetime.date
    start_time: datetime.time
    sampling_rate: float
    npts: int

    class Config:
        extra = "ignore"
    
    @computed_field
    def endtime(self) -> datetime.datetime:
        """ Extract the time from starttime """
        start_date_time = datetime.datetime.fromisoformat(f"{self.start_date} {self.start_time}")
        return start_date_time + datetime.timedelta(seconds=self.npts / self.sampling_rate)
    
    @computed_field
    def duration(self) -> float:
        """ Compute duration in seconds """
        return self.npts / self.sampling_rate
    
    @computed_field
    def record_name(self) -> str:
        """ Extract the record name from starttime """
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

# station: str = " "
#     component: str = " "
#     start_date: datetime.date
#     start_time: datetime.time
#     sampling_rate: float
#     npts: int
data = np.random.randint(1, 100, 1000)

stats_dict = {
    "station": "",
    "component": "Z",
    "sampling_rate": 100,
    "start_date": "1970-0ffh1-01",
    "start_time": "00:04:06",
    "npts": len(data)
}


tr = TraceParams(
    xdata=list(data), 
    ydata=list(data), 
    stats=TraceStats(**stats_dict)
    )

