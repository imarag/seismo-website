import Windows from "@/images/windows.png"
import FourierPlot from "@/images/fourier-plot.png"
import Taper from "@/images/taper.png"
import Trimmed from "@/images/trimmed.png"
import Arrivals from "@/images/arrivals.png"
import ObsPyStreamFiltered from "@/images/obspy-stream-filtered.png"

import { H1, H2, ListItem, ListContainer, Code } from "../articleElements"

export default function ComputeFourierOnWindow() {
  return (
    <>
        <H1>Task Description</H1>
        <Paragraph>
            In this tutorial, our aim is to compute the Fourier spectra within a specific window on the waveforms.
            This process involves a series of crucial preprocessing steps which enchance the quality of the data and ensure that
            the subsequent Fourier spectra
            analysis is conducted on a refined and targeted portion of the seismic recordings. The preprocessing steps can be
            summarized as follows:
        </Paragraph>
        <ListContainer>
            <ListItem>
                <b>Apply a bandpass filter (1 to 5 Hz)</b>:
                The initial step involves the application of a bandpass filter with a frequency range of 1 to 5 Hz. This
                filtering operation is designed to
                eliminate unwanted noise from the seismic signal, ensuring that only the relevant frequency band is retained for
                further analysis.
            </ListItem>
            <ListItem>
                <b>Select the P & S wave arrival times</b>:
                Following the bandpass filtering, the identification and selection of arrivals corresponding to the P (primary)
                and S (secondary) waves are
                essential. This step aims to define the edges of the signal and the noise windows at a subsequent step.
            </ListItem>
            <ListItem>
                <b>Define the signal and the noise window</b>:
                At this point we define the left signal window side to be S wave arrival time and the right side to be 10
                seconds later. Likewise, the
                left side of the noise window is positioned 10 seconds prior to the P wave arrival time, and its right side
                aligns with the P wave arrival.

            </ListItem>
            <ListItem>
                <b>Trim recordings inside the 10-second window</b>:
                This step is applied to cut the waveforms into signal and noise windows, created in relation to the P and S wave
                arrivals. Both windows
                will have a consistent duration of 10 seconds.
            </ListItem>
            <ListItem>
                <b>Taper the Waveforms</b>:
                The last step involves the smoothing of the trimmed waveforms in order to ensure zero acceleration values at the
                edges.
            </ListItem>
        </ListContainer>
        <H1>Reading the Input Data</H1>
        <Paragraph>
            In this article we will make use of the ObsPy Python library to apply the seismological computations and the Python
            Matplotlib library to plot the
            waveform time series. For this reason, we will start by initializing the libraries that we will use throughout the
            rest of the article:
        </Paragraph>
        <Code>
            import matplotlib.pyplot as plt
            from obspy.core import read
            from obspy.core import UTCDateTime
        </Code>
        <Paragraph>
            To proceed, read a MiniSEED file containing a record from April 4, 2014, at 20:08:20, recorded by the CH03 station:
        </Paragraph>
        <Code>
            st = read("20140404_200820_CH03.mseed")
            print(st)

            # Output:

            # 3 Trace(s) in Stream:
            # .CH03..E | 2014-04-04T20:08:20.000000Z - 2014-04-04T20:11:10.000000Z | 100.0 Hz, 17001 samples
            # .CH03..N | 2014-04-04T20:08:20.000000Z - 2014-04-04T20:11:10.000000Z | 100.0 Hz, 17001 samples
            # .CH03..Z | 2014-04-04T20:08:20.000000Z - 2014-04-04T20:11:10.000000Z | 100.0 Hz, 17001 samples
        </Code>
        <H1>Application Of the Pre-Processing Steps</H1>
        <H2>Apply A Bandpass Filter</H2>
        <Paragraph>
            Initiate the process by applying a bandpass filter to the records within the frequency range of 1 to 5 Hz. This step
            aims to eliminate surrounding
            noise and facilitate the arrival selection. Utilize the ObsPy
            <a href="https://docs.obspy.org/packages/autogen/obspy.core.stream.Stream.filter.html" 
                target="_blank"><code>filter()</code></a> function
            for this purpose:
        </Paragraph>
        <Code>
            # apply an inplace bandpass filter of 1-5 Hz
            st.filter('bandpass', freqmin=1, freqmax=5)

            # plot the recordings
            st.plot()
        </Code>
        <script src="https://gist.github.com/imarag/d54cb68d57ebf3759dbc963474a48a6c.js"></script>
        <figure>
            <Img src={ObsPyStreamFiltered} />
            <figcaption>Recordings after applying a bandpass filter of 1-5 Hz</figcaption>
        </figure>
        <H2>Select The P And S Wave Arrivals</H2>
        <Paragraph>
            It's clear from the filtered waveforms, that the P wave arrivals occurs roughly at <code>20:08:36</code> and the S
            wave arrivals at <code>20:08:58</code>.
            Convert these into ObsPy <code>UTCDateTime</code> objects and convert the arrival values as total seconds from the
            starting date:
        </Paragraph>
        <script src="https://gist.github.com/imarag/f5af9772fadcaeedb9dbeafd243f2235.js"></script>
        <Paragraph>
            To plot the P-wave and S-wave arrivals on the waveforms, we use Matplotlib to mark these time points with vertical
            lines. Here's an example of how you can do it in Python:
        </Paragraph>
        <script src="https://gist.github.com/imarag/20e1b4548a1b69fe4e5f11c295361c45.js"></script>
        <figure>
            <Img src={Arrivals} />
            <figcaption>Arrivals of the P (red dashed line) and the S (black dashed line) waves</figcaption>
        </figure>
        <H2>Define The Signal And Noise Windows</H2>
        <Paragraph>
            At this stage we define two windows to calculate the Fourier Spectra, one for the signal part of the waveform and
            one for the noise part.
            Both windows will share the same duration or length of 10 seconds. The first window
            will start from the S wave arrival and the second one will begin 10 seconds before the P wave arrival. Let's
            visualize these windows:
        </Paragraph>
        <script src="https://gist.github.com/imarag/fb383cf8879d821871f1438d920a0650.js"></script>
        <figure>
            <Img src={Windows} />
            <figcaption>Define the signal and the noise window to calculate the Fourier Spectra. Both will have the same
                duration of 10 seconds. The signal window
                starts at the S wave arrival and ends 10 seconds later. Similarly, the noise window initiates 10 seconds
                prior the P wave arrival and ends at the
                P wave arrival.
            </figcaption>
        </figure>
        <H2>Trim The Waveforms Between The Windows</H2>
        <Paragraph>
            To continue, trim the waveforms at the two windows using the ObsPy
            <a href="https://docs.obspy.org/packages/autogen/obspy.core.stream.Stream.trim.html" 
                target="_blank"><code>trim()</code></a> function.
            Because the trimming happens inplace, create copies of the orginal <code>Stream</code> object using the
            <code>copy()</code> method:
        </Paragraph>
        <script src="https://gist.github.com/imarag/8fd9990f4451e595c1a9f5c131dd9110.js"></script>
        <Paragraph>
            Then plot the trimmed waveforms using the Matplotlib library:
        </Paragraph>
        <script src="https://gist.github.com/imarag/e250f716129c581c748d408a686d55fc.js"></script>
        <figure>
            <Img src={Trimmed} />
            <figcaption>Trimmed waveforms at the noise and the signal windows for all the components</figcaption>
        </figure>
        <H2>Smooth the waveforms</H2>
        <Paragraph>
            At the last step, generate another copy of two obects from the previous trimmed recordings and smooth the left and
            the right side of the waveforms, using the obspy
            <a href="https://docs.obspy.org/packages/autogen/obspy.core.trace.Trace.taper.html" 
                target="_blank"><code>taper()</code></a> function:
        </Paragraph>
        <script src="https://gist.github.com/imarag/14572aaf70ea874461d23ae6ea0c8f74.js"></script>
        <Paragraph>
            Lastly, plot the results using Matplotlib:
        </Paragraph>
        <script src="https://gist.github.com/imarag/dd697ea2048b6f6b930b1f3f2aa5aa4b.js"></script>
        <figure>
            <Img src={Taper} />
            <figcaption>Trimmed (blue) and tappered (orange) waveforms at the noise and the signal window for all the
                components</figcaption>
        </figure>
        <H2>Compute The Fourier Spectra</H2>
        <Paragraph>
            Finally we can calculate the Fourier Spectra at the noise and the signal window on the filtered, trimmed and
            tappered waveforms:
        </Paragraph>
        <Code>
            {`
                # get the first trace of the signal Stream object
                first_trace = st_signal_taper[0]

                # get the starting date of the recordings
                starttime = first_trace.stats.starttime

                # get the sampling frequency and the sample distance
                fs = first_trace.stats["sampling_rate"]
                delta = first_trace.stats["delta"]

                # calculate the nyquist frequency
                fnyq = fs / 2

                # initialize a dictionary to save the outputs
                fourier_data_dict = {}

                # loop through the traces
                for i in range(len(st_signal_taper)):
                    # get a copy of the trace for the singal
                    df_s = st_signal_taper[i].copy()
                    
                    # get the current trace channel
                    channel = df_s.stats.channel

                    # get the number of sample points after the trimming
                    npts = df_s.stats["npts"]

                    # calculate the number of frequencies on the frequency spectra
                    sl = int(npts / 2)

                    # calculate the frequnecy array to plot the fourier
                    freq_x = np.linspace(0 , fnyq , sl)
                    
                    # save the frequencies in a variable to use it later at the plotting
                    xdata = freq_x

                    # compute the fft of the signal
                    yf_s = np.fft.fft(df_s.data[:npts]) 
                    y_write_s = delta * np.abs(yf_s)[0:sl]

                    # do the same also for the noise part
                    # get a copy of the trace for the noise
                    df_p = st_noise_taper[i].copy()

                    # calculate the fft
                    yf_p = np.fft.fft(df_p.data[:npts]) 
                    y_write_p = delta * np.abs(yf_p)[0:sl]
                    
                    # add the fft of the signal and noise part to the dictionary for the current trace
                    fourier_data_dict[channel] = {"signal": y_write_s, "noise": y_write_p}
            `}
        </Code>
        <Paragraph>
            And we present the results:
        </Paragraph>
        <Code>
            {`
                # initialize a Matplotlib figure to plot the Fourier data
                figfourier, axfourier = plt.subplots(1, len(fourier_data_dict),  figsize=(19,6))

                # create a hex colors list to style the curves
                colors = ['#5E62FF', '#B9BBFF', '#0a0a0a', '#969595', '#b50421', '#fc8b9e']

                color_i = 0
                # loop through each component at the dictionary
                for n, compo in enumerate(fourier_data_dict):
                    # loop through the 'noise' and the 'signal' part
                    for s_n in fourier_data_dict[compo]:
                        # define the ydata with data located in the dictionary created earlier
                        ydata = fourier_data_dict[compo][s_n]
                        
                        # create a variable to save the legend name of the curves
                        label_name = f"{compo}-{s_n}"
                        
                        # plot the frequencies and the data
                        axfourier[n].plot(xdata, ydata, color=colors[color_i], lw=1, label=label_name)
                        color_i += 1
                    
                    # style the graphs 
                    axfourier[n].legend(loc='upper left', fontsize=11, facecolor='w')
                    axfourier[n].set_xscale('log')
                    axfourier[n].set_yscale('log')
                    axfourier[n].set_xlabel("frequency [Hz]", fontsize=14)
                    axfourier[n].grid(color='grey', ls='-', which='both', alpha=0.1)
                    axfourier[n].tick_params(axis='both', which='both', labelsize=14)

                plt.tight_layout()
            `}
        </Code>
        <Img 
            src={FourierPlot} 
            caption="Fourier Spectra of the signal (bold curve) and the noise (muted curve) window for each component of
            the tappered <code>Stream</code> object" 
        />
    </>
  )
}
