from dataclasses import dataclass
from obspy.core import Stream, Trace 
from typing import Literal
import numpy as np 

@dataclass
class SignalProcessingHandler:

    @staticmethod
    def filter_trace(tr: Trace, freqmin: float | None, freqmax: float | None) -> Trace | str:
        
        tr_copy = tr.copy()

        try:
            # if freqmin exists and not freqmax
            if freqmin is not None and freqmax is None:
                tr_copy.filter("highpass", freq=float(freqmin))

            # elif freqmin does not exist but freqmax exists
            elif freqmin is None and freqmax is not None:
                tr_copy.filter("lowpass", freq=float(freqmax))

            # if both are defined (freqmin and freqmax)
            elif freqmin is not None and freqmax is not None:
                tr_copy.filter("bandpass", freqmin=float(freqmin), freqmax=float(freqmax))

        except Exception as e:
            error_message = "Cannot apply the specified filter values: " + str(e)
            return error_message
        
        return tr_copy
    
    @staticmethod
    def filter_stream(st: Stream, freqmin: float | None, freqmax: float | None) -> Stream | str:

        st_copy = st.copy()

        try:
            # if freqmin exists and not freqmax
            if freqmin is not None and freqmax is None:
                st_copy.filter("highpass", freq=float(freqmin))

            # elif freqmin does not exist but freqmax exists
            elif freqmin is None and freqmax is not None:
                st_copy.filter("lowpass", freq=float(freqmax))

            # if both are defined (freqmin and freqmax)
            elif freqmin is not None and freqmax is not None:
                st_copy.filter("bandpass", freqmin=float(freqmin), freqmax=float(freqmax))
                
        except Exception as e:
            error_message = "Cannot filter the waveforms: " + str(e)
            return error_message
        
        return st_copy

    @staticmethod
    def trim_trace(tr: Trace, left_value: float, right_value: float) -> Trace | str:
        
        tr_copy = tr.copy()

        # get the startttime because the starttime and endtime at the trim function
        # need to be UTCDateTimes
        starttime = tr_copy.stats.starttime

        try:
            tr_copy.trim(
                starttime=starttime + left_value, 
                endtime=starttime + left_value + right_value
                )
        except Exception as e:
            error_message = "Cannot trim the waveforms: " + str(e)
            return error_message
        
        return tr_copy
    
    @staticmethod
    def trim_stream(st: Stream, left_value: float, right_value: float) -> Stream | str:
        
        st_copy = st.copy()

        # get the startttime because the starttime and endtime at the trim function
        # need to be UTCDateTimes
        starttime = st_copy.traces[0].stats.starttime

        try:
            st_copy.trim(
                starttime=starttime + left_value, 
                endtime=starttime + left_value + right_value
                )
        except Exception as e:
            error_message = "Cannot trim the waveforms: " + str(e)
            return error_message
        
        return st_copy
    

    @staticmethod
    def taper_trace(tr: Trace, 
              max_percentage: float | None = None, 
              side: Literal["left", "right", "both"] = "both",
              type: str = "parzen",
              max_length: float | None = None
              ) -> Trace | str:
        
        tr_copy = tr.copy()

        try:
            tr_copy.taper(
                max_percentage, 
                side=side, 
                type=type, 
                max_length=max_length)
        except Exception as e:
            error_message = "Cannot taper the waveform: " + str(e)
            return error_message
        
        return tr_copy
    

    @staticmethod
    def taper_stream(st: Stream, 
              max_percentage: float | None = None, 
              side: Literal["left", "right", "both"] = "both",
              type: str = "parzen",
              max_length: float | None = None
              ) -> Stream | str:
        
        st_copy = st.copy()

        try:
            st_copy.taper(
                max_percentage, 
                side=side, 
                type=type, 
                max_length=max_length)
        except Exception as e:
            error_message = "Cannot taper the waveform: " + str(e)
            return error_message
        
        return st_copy
    

    @staticmethod
    def detrend_trace(tr: Trace, type: Literal["simple", "linear", "constant"] = "simple") -> Trace | str:
        
        tr_copy = tr.copy()

        try:
            tr_copy.detrend(type)
        except Exception as e:
            error_message = "Cannot detrend the waveform: " + str(e)
            return error_message
        
        return tr_copy
    
    @staticmethod
    def detrend_stream(st: Stream, type: Literal["simple", "linear", "constant"] = "simple") -> Stream | str:
        
        st_copy = st.copy()

        try:
            st_copy.detrend(type)
        except Exception as e:
            error_message = "Cannot detrend the waveform: " + str(e)
            return error_message
        
        return st_copy

    @staticmethod
    def compute_fourier(tr: Trace):

        # get some information of the stream object
        tr_stats = tr.stats

        # get a copy of the trace for the singal
        tr_copy = tr.copy()

        # calculate the number of frequncies on the frequency spectra
        sl = int(tr_stats.npts / 2)

        # get the nyquist frequency
        fnyq = tr_stats.sampling_rate / 2

        # calculate the frequnecy array to plot the fourier
        freq = np.linspace(0, fnyq, sl)

        # compute the fft of the signal
        tr_fft = np.fft.fft(tr_copy.data[:tr_stats.npts])

        # compute the absolute value
        tr_fft_abs = tr_stats.delta * np.abs(tr_fft)[0:sl]

        return (freq, tr_fft_abs)
      
