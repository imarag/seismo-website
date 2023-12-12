Basic structure
===============

The main structure of the Obspy library consists of the `Trace` and the `Stream` objects. The `Trace` represents a single time series record of seismic data recorded at a single station or sensor. It's essentially a single waveform with associated metadata (e.g., station code, sampling frequency, starting time of the recording etc.). The `Stream` object is a container of one or more `Trace` objects. Typically, a `Stream` object, contains three recordings or traces: two with horizontal components (e.g., North-South and East-West) and one with a vertical component and offers several attributes that provide information about the respective recording.


*The structure of the obspy library. A Stream consists of one or more Trace objects which have different methods (.taper(), .filter(), etc.) and attributes (.data, .stats, etc.)*

For instance, the `.data` attribute provides the time series data samples and the `.stats` returns the seismic parameters of the recordings (sampling frequency, number of sample points, etc.). In addition, it provides several methods or functions to manipulate the record. Such methods are the `filter()` function that filters the recordings between a specific frequency range and the `trim()` function that trims the time series between a specific starting and ending time.

Obspy supports several file [formats](https://docs.obspy.org/packages/autogen/obspy.core.stream.read.html) to read data. One of the most used seimic file formats is the MiniSEED format. It is a binary file used to store time series data in a compact and efficient format that includes information about the station, location, timing, and the actual waveform data. MiniSEED files are widely used in seismology and are the standard format for sharing and archiving seismic data.

Obspy Date and Time Manipulation
================================

Obspy offers extensive support for date and time manipulation. It includes the `UTCDateTime` object to represent date and time. For instance the start date and the end date of a recording, which are saved as `starttime` and `endtime` in the metadata information of a `Trace` object (the `.stats` attribute), are both a `UTCDateTime` data type. Start by initializing the function:


```py
from obspy.core import UTCDateTime
```
    
Create a `UTCDateTime` object from a Pyton string:

```py
dt = UTCDateTime("2012-09-07T12:15:00")
print(dt, type(dt))
```

```text
2012-09-07T12:15:00.000000Z <class 'obspy.core.utcdatetime.UTCDateTime'>
```          

You can perform addition, subtraction and extract multiple attributes from this object using the dot notation:

```py
# add 20 seconds
dt += 20
print(dt)
print()
# get some datetime attributes
print("dt.date      -> ", dt.date)
print("dt.time      -> ", dt.time)
print("dt.year      -> ", dt.year)
print("dt.month     -> ", dt.month)
print("dt.day       -> ", dt.day)
print("dt.hour      -> ", dt.hour)
print("dt.minute    -> ", dt.minute)
print("dt.second    -> ", dt.second)
print("dt.timestamp -> ", dt.timestamp)
print("dt.weekday   -> ", dt.weekday)
```            

```text
2012-09-07T12:15:20.000000Z
        
dt.date      ->  2012-09-07
dt.time      ->  12:15:20
dt.year      ->  2012
dt.month     ->  9
dt.day       ->  7
dt.hour      ->  12
dt.minute    ->  15
dt.second    ->  20
dt.timestamp ->  1347020120.0
dt.weekday   ->  4
```

        
    

Last but not least, one can subtract `UTCDateTime` objects and get the difference of them in seconds:

```py
# create another UTCDateTime object
dt2 = UTCDateTime("2012-09-07T12:20:00")
print(dt2)
print()
# calculate the difference of the two UTCDateTime objects
diff = dt2 - dt
print(diff)
```

```text
2012-09-07T12:20:00.000000Z

280.0
```

        

The `starttime` and `endtime` keys in the header information of the recordings need to be in a `UTCDateTime` data type. Therefore, if you intend to modify these keys within the `trace.stats` dictionary-like header, convert your datetime string into the `UTCDateTime` format.

Attributes and Methods
======================

Within ObsPy, you'll find an array of attributes and methods associated with the `Trace` class for accessing recording information, seismic file handling, and applying waveform processing techniques. To begin with, let's use the Obspy `read()` function for reading seismic files. We'll initiate by importing this function:

```py
from obspy.core import read
```

To continue, let's read a file of a recording took place on **04 April, 2014** at **20:08:20** and recorded by **CH03** station:

```py
# read the recording
st = read("20140404_200820_CH03.mseed")
print(st)
```

```text
3 Trace(s) in Stream:
.CH03..E | 2014-04-04T20:08:20.000000Z - 2014-04-04T20:11:10.000000Z | 100.0 Hz, 17001 samples
.CH03..N | 2014-04-04T20:08:20.000000Z - 2014-04-04T20:11:10.000000Z | 100.0 Hz, 17001 samples
.CH03..Z | 2014-04-04T20:08:20.000000Z - 2014-04-04T20:11:10.000000Z | 100.0 Hz, 17001 samples
```

    

The file is a MiniSEED file that contains 3 traces or records each with a different component (E, N, Z). We can see the start and the end time of the record, the sampling frequency in Hz and the total samples. Let's get this information for the first trace of the `Stream` object:



```py
# get the first trace
first_trace = st[0]
# output the header information of that trace object
print(first_trace.stats)
```

```text
network: 
station: CH03
location: 
channel: E
starttime: 2014-04-04T20:08:20.000000Z
endtime: 2014-04-04T20:11:10.000000Z
sampling_rate: 100.0
delta: 0.01
npts: 17001
calib: 1.0
_format: MSEED
mseed: AttribDict({'dataquality': 'D', 'number_of_records': 34, 'encoding': 'FLOAT64', 'byteorder': '>', 'record_length': 4096, 'filesize': 417792})
```

We can observe multiple key-value pairs that contain the seismic parameters, such as the station code or name which is _CH03_, the component of the record which is East-West (E) and the the sampling frequency or sampling rate of 100 Hz. Several other parameters are also apparent like the starting and the ending date of the record (starttime, endtime), the sample distance in seconds (dt), the total number of sample points (npts) and more. The output is a `obspy.core.trace.Stats` object which is a `dict-like` object that you can get and set the values.

In order to check the recordings visually, get the sample data and the time information using the `.data` and the `.times()` methods respectively.

```py
# import the matplotlib library 
import matplotlib.pyplot as plt

# Initialize a matplotlib figure and axes with the total
# number of plots equal to the number of traces len(st)
fig, ax = plt.subplots(len(st), 1)

# Loop through all the traces in the stream object (st)
for n, tr in enumerate(st):
    # get the time information of the current trace
    xdata = tr.times()
    # get the data of the current trace
    ydata = tr.data
    # plot the graph with legend, the trace channel
    ax[n].plot(xdata, ydata, label=tr.stats.channel)
    # add the legend on the plot
    ax[n].legend()
# adjust the subplots so they do not overlap
plt.tight_layout()
```   

    



Recordings of the MiniSEED file plotted using the matplotlib library

We could achieve a similar result by just using the `.plot()` method of the `Stream` object (st):

```py
st.plot()
```       

    



Recordings of the MiniSEED file plotted using the `.plot()` method of the `stream` object

This method can get some parameters to control the visualization of the plots such as the color of the waveforms, the size of the plot, the rotation and size of the x axis labels and more. Check all these parameters of the [obspy.core.stream.Stream.plot](https://docs.obspy.org/packages/autogen/obspy.core.stream.Stream.plot.html) command.

At this point, for the sake of the tutorial, let's assume that we need to calculate the Fourier spectra within a specific window of the signal in the waveforms. To accomplish this, there are several preprocessing steps that need to be applied:

1.  Apply a bandpass filter from 1 to 5 Hz to remove the noise
2.  Select the arrivals of the P and S waves
3.  Define a window of 10 seconds to calculate the Fourier Spectra
4.  Trim the recordings inside that 10-second window
5.  Taper the waveforms so that they start and end with zero acceleration

Start by applying a bandpass filter to the records from 1 to 5 Hz to remove the surrounding noise and facilitate the arrival selection. Utilize the Obspy `filter()` function:

```py
# apply an inplace bandpass filter of 1-5 Hz
st.filter('bandpass', freqmin=1, freqmax=5)
# plot the recordings
st.plot()
```   

    



Recordings after applying a bandpass filter of 1-5 Hz

It's clear from the filtered waveforms, that the P wave arrivals occurs roughly at **20:08:33** and the S wave arrivals at **20:08:58**. To plot the P-wave and S-wave arrivals on the waveforms, you can use Matplotlib to mark these time points with vertical lines. Here's an example of how you can do it in Python:

```py
# Initialize a matplotlib figure and axes with the total
# number of plots equal to the number of traces len(st)
fig, ax = plt.subplots(len(st), 1)

# Define the P and S wave arrivals as UTCDateTime objects
Parr = UTCDateTime('2014-04-04 20:08:33')
Sarr = UTCDateTime('2014-04-04 20:08:58')

# Get the start date of the records from the first trace of the stream object
start_date = st[0].stats.starttime

# Calculate the P and S arrivals in seconds from the start date
Parr_sec = Parr - start_date
Sarr_sec = Sarr - start_date

# Loop through all the traces in the stream object (st)
for n, tr in enumerate(st):
    # get the time series time information of the current trace
    xdata = tr.times()
    # get the data of the current trace
    ydata = tr.data
    # plot the graph with legend, the trace channel
    ax[n].plot(xdata, ydata, label=tr.stats.channel)
    
    # add two vertical lines that represent the arrivals
    ax[n].axvline(x=Parr_sec, ymin=0, ymax=1, lw=2, ls='--', color='red', label='P arrival')
    ax[n].axvline(x=Sarr_sec, ymin=0, ymax=1, lw=2, ls='--', color='black', label='S arrival')
    
    # add the legend on the plot
    ax[n].legend(loc='upper right')
# adjust the subplots so they do not overlap
plt.tight_layout()
```  

    



Arrivals of the P (red dashed line) and the S (black dashed line) waves

At this stage we define two windows to calculate the Fourier Spectra, one for the signal part of the waveform and one for the noise part. Both windows will share the same duration or length of 10 seconds. The first window will start from the S wave arrival and the second one will begin 10 seconds before the P wave arrival. Let's visualize these windows:

```py
# Initialize a matplotlib figure and axes with the total
# number of plots equal to the number of traces len(st)
fig, ax = plt.subplots(len(st), 1)

# Define the P and S wave arrivals as UTCDateTime objects
Parr = UTCDateTime('2014-04-04 20:08:33')
Sarr = UTCDateTime('2014-04-04 20:08:58')

# Get the start date of the records from the first trace of the stream object
start_date = st[0].stats.starttime

# Calculate the P and S arrivals in seconds from the start date
Parr_sec = Parr - start_date
Sarr_sec = Sarr - start_date

# initialize the window length
window_length = 10

# Loop through all the traces in the stream object (st)
for n, tr in enumerate(st):
    # get the time series time information of the current trace
    xdata = tr.times()
    # get the data of the current trace
    ydata = tr.data
    # plot the graph with legend, the trace channel
    ax[n].plot(xdata, ydata, label=tr.stats.channel)

    # add two vertical lines that represent the arrivals
    ax[n].axvline(x=Parr_sec, ymin=0, ymax=1, lw=2, ls='--', color='red', label='P arrival')
    ax[n].axvline(x=Sarr_sec, ymin=0, ymax=1, lw=2, ls='--', color='black', label='S arrival')

    # create the signal and the noise window on the waveforms
    ax[n].fill_betweenx([-1.8,1.8], x1=Sarr_sec, x2=Sarr_sec+window_length, alpha=0.5, facecolor='orange', zorder=2, label='signal window')
    ax[n].fill_betweenx([-1.8,1.8], x1=Parr_sec-window_length, x2=Parr_sec, alpha=0.5, facecolor='red', zorder=2, label='noise window')

    # add the legend on the plot
    ax[n].legend(loc='upper right')
# adjust the subplots so they do not overlap
plt.tight_layout()
```  

    



Create two windows to calculate the Fourier Spectra, one at the signal part of the waveform and the other at the noise part. Both will have a duration of 10 seconds. The first starts at the S wave arrival and the second 10 seconds before the P arrival.

To continue, trim the waveforms at the two windows using the Obspy `trim()` function. Here's how you can do it in Python:

```py
# Initialize a matplotlib figure and axes with the total
# number of plots equal to the number of traces plus 3
# a signal and a noise part for each trace (3) 
fig, ax = plt.subplots(len(st)+3, 1, figsize=(8,10))

# Define the P and S wave arrivals as UTCDateTime objects
Parr = UTCDateTime('2014-04-04 20:08:33')
Sarr = UTCDateTime('2014-04-04 20:08:58')

# Get the start date of the records from the first trace of the stream object
start_date = st[0].stats.starttime

# Calculate the P and S arrivals in seconds from the start date
Parr_sec = Parr - start_date
Sarr_sec = Sarr - start_date

# initialize the window length
window_length = 10

# trim the waveforms at the respective windows
# noise window: from Parr - window_length to Parr
# signal window: from Sarr to Sarr + window_length
# Since the trim() function happens inplace, create new streams
# using the copy() function to trim the traces separately
st_signal = st.copy().trim(starttime=start_date+Sarr_sec, endtime=start_date+Sarr_sec+window_length)
st_noise = st.copy().trim(starttime=start_date+Parr_sec-window_length, endtime=start_date+Parr_sec)

# Loop through all the traces in the noise Stream
# and plot them in the first 3 plots for each trace
for n, tr_noise in enumerate(st_noise):
    # get the time series time information of the current trace
    xdata = tr_noise.times()
    # get the data of the current trace
    ydata = tr_noise.data
    # plot the graph
    ax[n].plot(xdata, ydata, label=f'noise window, channel: {tr_noise.stats.channel}')
    ax[n].legend(loc='upper left')

# Loop through all the traces in the signal Stream
# and plot them in the next 3 plots for each trace
for n, tr_signal in enumerate(st_signal, start=3):
    # get the time series time information of the current trace
    xdata = tr_signal.times()
    # get the data of the current trace
    ydata = tr_signal.data
    # plot the graph
    ax[n].plot(xdata, ydata, label=f'signal window, channel: {tr_signal.stats.channel}')
    ax[n].legend(loc='upper left')

# adjust the subplots so they do not overlap
plt.tight_layout()
```     

    


Trimmed waveforms at the noise and the signal windows for all the components

Lastly, taper the waveforms, in order to smooth the left and the right side of the waveforms, using the obspy `taper()` function:


```py
# Initialize a matplotlib figure and axes with the total
# number of plots equal to the number of traces plus 3
# a signal and a noise part for each trace (3) 
fig, ax = plt.subplots(len(st)+3, 1, figsize=(8,10))

# Define the P and S wave arrivals as UTCDateTime objects
Parr = UTCDateTime('2014-04-04 20:08:33')
Sarr = UTCDateTime('2014-04-04 20:08:58')

# Get the start date of the records from the first trace of the stream object
start_date = st[0].stats.starttime

# Calculate the P and S arrivals in seconds from the start date
Parr_sec = Parr - start_date
Sarr_sec = Sarr - start_date

# initialize the window length
window_length = 10

# trim the waveforms at the respective windows
# noise window: from Parr - window_length to Parr
# signal window: from Sarr to Sarr + window_length
# Since the trim() function happens inplace, create new streams
# using the copy() function to trim the traces separately
st_signal = st.copy().trim(starttime=start_date+Sarr_sec, endtime=start_date+Sarr_sec+window_length)
st_noise = st.copy().trim(starttime=start_date+Parr_sec-window_length, endtime=start_date+Parr_sec)

# taper the waveforms at the respective windows 30% on the left and 30% on the right side
# again use the copy() function to apply the taper on new stream object
st_signal_taper = st_signal.copy().taper(side='both', max_percentage=0.3)
st_noise_taper = st_noise.copy().taper(side='both', max_percentage=0.3)

# Loop through the number of traces in the noise Stream
for i in range(len(st_noise)):
    # plot the trimmed waveforms with blue color                
    ax[i].plot(st_noise[i].times(), st_noise[i].data, label=f'trimmed noise window, channel: {st_noise[i].stats.channel}', color="blue")
    # plot the tappered waveforms with orange color
    ax[i].plot(st_noise_taper[i].times(), st_noise_taper[i].data, label=f'tapered', lw=3, color="orange")
    ax[i].legend(loc='upper center')

# Loop through the number of traces in the signal Stream
for i in range(len(st_signal)):
    # plot the trimmed waveforms with blue color
    ax[i+3].plot(st_signal[i].times(), st_signal[i].data, label=f'trimmed signal window, channel: {st_signal[i].stats.channel}', color="blue")
    # plot the tappered waveforms with orange color
    ax[i+3].plot(st_signal_taper[i].times(), st_signal_taper[i].data, label=f'tapered', lw=3, color="orange")
    ax[i+3].legend(loc='upper center')
        
# adjust the subplots so they do not overlap
plt.tight_layout()
```
    



Trimmed (blue) and tappered (orange) waveforms at the noise and the signal window for all the components

Finally we can calculate the Fourier Spectra at the noise and the signal window on the waveforms. To save the final tappered and/or trimmed `Stream` objects, utilize the Obspy `write()` function to write the seismic data from a `Stream` object to a file in various supported formats. It allows you to save the seismic data, including metadata, to a file for further analysis or sharing with others.


```py
# write the tappered noise and signal stream object into a MiniSEED file
st_signal_taper.write("tappered_signal_waveform.mseed")
st_noise_taper.write("tappered_noise_waveform.mseed")
```                  
        

In this section we have explored several attributes and methods of the Obspy `Trace` object, including the `read` and `write` methods to upload and save seismic files, the `.data` and `.stats` attributes to extract information about the recordings, the `trim()`, `taper()` and `filter()` functions to manipulate the traces and the `plot()` function to plot the recordings. Obspy offers a wide range of additional attributes and methods for working with seismic data at the [Trace](https://docs.obspy.org/packages/autogen/obspy.core.trace.Trace.html) object documentation.

Generating Trace and Stream objects from data
=============================================

In addition to reading seismological file formats, you have the flexibility to create your own `Trace` and `Stream` objects using ObsPy's `obspy.core.trace.Trace` and `obspy.core.stream.Stream` classes. To create a `Trace` object, begin by supplying the data values of the recording (e.g., acceleration) as a NumPy `ndarray` to the `data` parameter within `obspy.core.trace.Trace`, and include the recording's metadata in a Python dictionary provided to the `header` parameter. Do this for each trace you want to create. Then, gather all the generated `Trace` objects into a Python list and pass it into the `traces` parameter in the `obspy.core.stream.Stream` class to construct a `Stream` object.

Below is presented a seismic recording from the _LEF2_ station, containing data from three channels (E, N, Z). This data file includes metadata information positioned at the file's header, followed by data for each component. Our goal is to read this file and assemble a `Stream` object comprising three individual traces.



Acceleration data in raw ASCII format. The first lines contain the record metadata and the rest of the lines the acceleration data of the three components

Start by reading the file and collecting the file header information in order to build a dictionary of the seismic parameters. Then extract the acceleration values of the recording and transform them into a numpy `ndarray` form. Lastly, create one `Trace` for each recording and then a `Stream` object from the traces.

```py
# open the file and read its metadata
with open('20140207-085940-LEF2-data.txt') as fr:
    # skip the first line
    fr.readline()
    # read the station name
    station = fr.readline().split(':')[1].strip()
    # read the starting date of the record
    dt_start = fr.readline().split(':', 1)[1].strip()
    # read the sampling frequency in Hz
    fs =  fr.readline().split(':')[1].strip(' Hz\n')
    # read the number of sample points
    npts = fr.readline().split(':')[1].strip()
    # skip 2 lines
    fr.readline()
    fr.readline()
    # read the components
    compos = fr.readline().split(':')[1].split()
    # show all the parameters that we read from the header of the file
    print(station, dt_start, fs, npts, compos)
```

```text
LEF2 2014-02-07T08:59:40.000000Z 100.0 18100 ['E', 'N', 'Z']
```              

Before we add the metadata into the dictionary, we convert the number of points (npts) into a Python `int` datatype, the sampling frequency (fs) into a `float` datatype and the start time of the record (`starttime`) into a `UTCDateTime` object. Also it is important for the keys of the dictionary, to be one of the options provided in the [`obspy.core.trace.Stats`](https://docs.obspy.org/packages/autogen/obspy.core.trace.Stats.html) object. Then we use the python Pandas library to read the data of the record:


```py
# use the Pandas read-csv method to read the data from text file
df_data = pd.read_csv('20140207-085940-LEF2-data.txt', skiprows=10, sep='\s+', header=None)
# assign the previous components list into the columns
df_data.columns = compos
```
        

At this time we have the metadata and the data of the traces. Using these two parameters, we can create the `Trace` objects. To do this, loop trough the components, create a header dictionary file for each `Trace` and add its data:


```py
# create an empty list to append each trace object
lt_traces = []
# then create a trace for each component
for compo in compos:
    # create a dictionary object and add there the metadata
    dict_header = {}
    dict_header["station"] = station
    dict_header["npts"] = int(npts)
    dict_header["sampling_rate"] = float(fs)
    dict_header["starttime"] = UTCDateTime(dt_start)
    dict_header["channel"] = compo
    # create the trace object
    tr = Trace(data=df_data[compo].to_numpy(), header=dict_header)
    # append the trace into the traces list
    lt_traces.append(tr)
print(lt_traces)
```



```text
[
<obspy.core.trace.Trace object at 0x0000020E0EFB25F0>,
<obspy.core.trace.Trace object at 0x0000020E0F501FC0>,
<obspy.core.trace.Trace object at 0x0000020E0F502890>
]
```


Finally, create the `Stream` object, from the list of the traces:


```py
# create the stream by inserting the list of traces into the obspy.core.stream.Stream class
st = Stream(lt_traces)
print(st)
```



```text
3 Trace(s) in Stream:
.LEF2..E | 2014-02-07T08:59:40.000000Z - 2014-02-07T09:02:40.990000Z | 100.0 Hz, 18100 samples
.LEF2..N | 2014-02-07T08:59:40.000000Z - 2014-02-07T09:02:40.990000Z | 100.0 Hz, 18100 samples
.LEF2..Z | 2014-02-07T08:59:40.000000Z - 2014-02-07T09:02:40.990000Z | 100.0 Hz, 18100 samples
```
    

Finally, use the `stream` `write()` method to save the stream somewhere in your machine.