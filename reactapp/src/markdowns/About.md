# Basic structure

The main structure of the ObsPy library consists of the `Trace` and the `Stream` objects. The `Trace` represents a single time series record of seismic data recorded at a single station or sensor. It's essentially a single waveform with associated metadata (e.g., station code, sampling frequency, starting time of the recording etc.). The `Stream` is a container of one or more `Trace` objects. Typically, a `Stream` contains three recordings or traces: two with horizontal components (e.g., North-South and East-West) and one with a vertical component. Each `Trace` offers several attributes that provide information about the recording and methods that apply a calculation on the respective recording. 

![The structure of the obspy library](obspy-structure.png)
*A single track trail outside of Albuquerque, New Mexicoo.*

 For instance, the .data attribute of a Trace provides its time series data samples and the .stats returns an object that holds metadata or seismic parameters associated with the trace, such as the sampling frequency, start time, end time, network, station, and other relevant information. In addition, the filter() method, filters the time series data within a specific frequency range and the trim() method cuts the time series between a specific start and end times.

ObsPy supports several file formats to read data. One of the most used seimic file format is the MiniSEED format. It is a binary file used to store time series data in a compact and efficient format that includes information about the station, location, timing, and the actual waveform data. MiniSEED files are widely used in seismology and are the standard format for sharing and archiving seismic data.

Before we continue, start by initializing the functions that we will use throughout the rest of the tutorial: 

```py
    from obspy.core import UTCDateTime
    from obspy.core import read
    from obspy.core.trace import Trace
    from obspy.core.stream import Stream
    import matplotlib.pyplot as plt
    import pandas as pd

    print(x)