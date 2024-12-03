from dataclasses import dataclass
from obspy.core import Stream, UTCDateTime, Trace
import numpy as np 
import pandas as pd 
import uuid

@dataclass
class StreamHandler:
    st: Stream  

    def validate_stream(
        self,
        check_empty_stream: bool = True,
        check_total_traces: bool = True,
        check_empty_traces: bool = True,
        check_fs_dt: bool = True,
        check_equal_parameters: bool = True,
        check_numbers: bool = True,
        check_total_number_of_npts: bool = True,
    ) -> str | None:
        """If it returns str there is an error, if it returns None , everything is fine"""

        # check if stream is empty (no traces)
        if check_empty_stream:
            if len(self.st) == 0:
                error_message = f"The seismic file is empty!"
                return error_message
            
        # check if the stream contains 2 traces (one vertical and one horizontal compoenent) or 3 traces
        # (1 vertical and 2 horizontal components)
        if check_total_traces:
            # if the stream has 0, 1 or more than 3 traces abort
            if len(self.st) not in [2, 3]:
                error_message = f"The seismic file provided needs to include two or three traces (components), comprising either one or two horizontal components and one vertical component. Your current seismic file contains {len(self.st)} traces!"
                return error_message
            
        if check_empty_traces:
            # if at least one of the traces is empty abort
            for tr in self.st:
                if len(tr.data) == 0:
                    error_message = "One or more of your records in the stream object, is empty!"
                    return error_message
        
        if check_equal_parameters:
            npts_list = []
            fs_list = []
            dt_list = []
            starttime_list = []
            for tr in self.st:
                npts_list.append(tr.stats["npts"])
                fs_list.append(tr.stats["sampling_rate"])
                dt_list.append(tr.stats["delta"])
                starttime_list.append(str(tr.stats["starttime"]))
                

            if len(set(npts_list)) != 1:
                error_message = "The traces in the stream object, do not have the same number of sampling data points (npts)!"
                return error_message
            if len(set(fs_list)) != 1:
                error_message = "The traces in the stream object, do not have the same sampling frequency (fs)!"
                return error_message
            if len(set(dt_list)) != 1:
                error_message = "The traces in the stream object, do not have the same sampling distance (dt)!"
                return error_message
            if len(set(starttime_list)) != 1:
                error_message = "The traces in the stream object, do not have the same starting time!"
                return error_message

        if check_total_number_of_npts:
            if self.st.traces[0].stats.npts > 200000:
                error_message = "The provided file contains an exceptionally high number of sampling points (npts > 200,000). It is advisable to trim the file before using it with this tool. You can conveniently perform this operation on a separate page."
                return error_message

        if check_numbers:
            # check if the data of the traces are indeed numbers and not any string
            for tr in self.st:
                try:
                    pd.to_numeric(tr.data, errors="raise")
                except:
                    error_message = f"The data in one of your records (channel: {tr.stats.channel}) contain a non-valid input value. Only numbers and NaN values are allowed!"
                    return error_message

        if check_fs_dt:
            # if the user hasn't defined nor the fs neither the delta, then error
            for tr in self.st:
                if tr.stats["sampling_rate"] == 1 and tr.stats["delta"] == 1:
                    error_message = "Neither sampling rate (fs[Hz]) nor sample distance (delta[sec]) are specified in the trace objects. Consider including them in the stream objects, for the correct x-axis time representation!"
                    return error_message

        # if everything ok return None
        return None
    

    
    def get_record_name(self) -> str:
        # get the traces of the stream
        traces = self.st.traces

        # get the first trace of the stream
        first_trace = traces[0]

        # get the starttime and station
        starttime = first_trace.stats["starttime"]
        station = first_trace.stats["station"]

        if not station:
            station = "STATION"

        # create a record name and return it
        rec_name = starttime.date.isoformat() + "_" + starttime.time.isoformat() + "_" + station
        rec_name = rec_name.replace(":", "").replace("-", "")

        return rec_name

    
    def convert_stream_to_traces(self) -> list:
        """Extract the data from the mseed file into a list of traces (dictionaries)"""
        traces_data_list = []
        rec_name = self.get_record_name()

        for n, trace in enumerate(self.st.traces):
            ydata = trace.data.tolist()
            xdata = trace.times().tolist()
            stats = dict(trace.stats)
            stats["date"] = stats["starttime"].date.isoformat()
            stats["time"] = stats["starttime"].time.isoformat()
            stats["duration"] = stats["endtime"] - stats["starttime"]
            stats["starttime"] = stats["starttime"].isoformat()
            stats["endtime"] = stats["endtime"].isoformat()
            
            if "mseed" in stats:
                del stats["mseed"]
                
            trace_data = {
                "record-name": rec_name,
                "ydata": ydata,
                "xdata": xdata,
                "stats": stats,
                "id": str(uuid.uuid4())
            }
            traces_data_list.append(trace_data)
        return traces_data_list
    
    @classmethod
    def convert_traces_to_stream(cls, data: list) -> Stream:
        traces = []
        for tr in data:
            stats = tr["stats"]
            ydata = tr["ydata"]
            header = {**stats}
            header["starttime"] = UTCDateTime(stats["date"] + " " + stats["time"])
            
            trace = Trace(data=np.array(ydata), header=header)
            traces.append(trace)
        
        stream = Stream(traces=traces)
        
        return stream