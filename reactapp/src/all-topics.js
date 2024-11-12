// Import your topic components
import Obspy from './pages/articles/Obspy';
import Fourier from './pages/tools/Fourier';
import PickArrivals from './pages/tools/PickArrivals';
import FileToMseed from './pages/tools/FileToMseed';
import SignalProcessing from './pages/tools/SignalProcessing';
import SiteEffect from './pages/articles/SiteEffect';
import SeismologyIntro from './pages/articles/SeismologyIntro';
import DistanceBetweenPoints from './pages/tools/DistanceBetweenPoints';
import FileManipulation from './pages/articles/FileManipulation';
import Matplotlib from './pages/articles/Matplotlib';
import EditSeismicFile from './pages/tools/EditSeismicFile';
import ComputeFourierOnWindow from './pages/articles/ComputeFourierOnWindow';

import ObspyImage from "./img/template-images/obspy-icon.png"
import FourierImage from "./img/template-images/fourier-icon.png"
import PickArrivalsImage from "./img/template-images/arrival-pick-icon.png"
import FileToMseedImage from "./img/template-images/file-to-mseed-icon.png"
import SignalProcessingImage from "./img/template-images/signal-processing-icon.png"
import SiteEffectImage from "./img/template-images/site-effect-icon.png"
import SeismologyIntroImage from "./img/template-images/introduction-to-seismology-icon.png"
import DistanceBetweenPointsImage from "./img/template-images/distance-between-points-icon.png"
import FileManipulationImage from "./img/template-images/file-manipulation-icon.png"
import MatplotlibImage from "./img/template-images/matplotlib-icon.png"
import EditSeismicFileImage from "./img/template-images/edit-seismic-file-icon.png"
import ComputeFourierOnWindowImage from "./img/template-images/edit-seismic-file-icon.png"

const allArticles = [
  {
    "id": 1,
    "title": "Python Obspy",
    "description": "An open-source Python library designed for advanced analysis, processing, and manipulation of seismological data. ObsPy supports the reading and writing of seismic formats, waveform analysis, and metadata handling, making it an essential tool for seismologists. The library integrates well with other scientific Python libraries, enabling efficient data processing and visualization.",
    "image_name": ObspyImage,
    "component": <Obspy />,
    "type": "seismic-articles",
    "template_name": "obspy"
  },
  
  {
    "id": 2,
    "title": "Seismic Site Effect",
    "description": "The phenomenon of the amplification of seismic ground motion due to subsurface geological conditions. Understanding site effects is crucial for seismic hazard assessment, as local soil and rock properties can significantly alter ground motion. This article explores different methods used to evaluate and mitigate these effects to enhance earthquake preparedness.",
    "image_name": SiteEffectImage,
    "component": <SiteEffect />,
    "type": "seismic-articles",
    "template_name": "site-effect"
  },

  {
    "id": 3,
    "title": "Introduction to Seismology",
    "description": "An introduction to various seismological concepts, covering the basics of earthquake generation, wave propagation, and seismic recording. This foundational article is ideal for beginners, providing an overview of essential principles and methods used in the study of seismic events and earth structure.",
    "image_name": SeismologyIntroImage,
    "component": <SeismologyIntro />,
    "type": "seismic-articles",
    "template_name": "introduction-to-seismology"
  },

  {
    "id": 4,
    "title": "Python File Manipulation",
    "description": "Utilization of various Python libraries to manipulate system files and paths, with examples using modules like `os` and `shutil` for handling directories, files, and metadata. This article is a valuable resource for those looking to automate data preparation or file management tasks in Python.",
    "image_name": FileManipulationImage,
    "component": <FileManipulation />,
    "type": "seismic-articles",
    "template_name": "file-manipulation"
  },

  {
    "id": 5,
    "title": "Python Matplotlib Plotting",
    "description": "A basic tutorial to plot seismic data using various Matplotlib functions and methods. This guide covers plotting essentials, from waveform visualization to customizing figure aesthetics, making it easy for users to generate meaningful representations of seismic data.",
    "image_name": MatplotlibImage,
    "component": <Matplotlib />,
    "type": "seismic-articles",
    "template_name": "matplotlib"
  },

  {
    "id": 6,
    "title": "Compute Fourier Spectra On A Window",
    "description": "An article that demonstrates how to compute the Fourier Spectra over a selected window of a seismic waveform. This approach is useful for analyzing specific events within a signal, such as noise or earthquake onset, providing insights into frequency distribution over time.",
    "image_name": ComputeFourierOnWindowImage,
    "component": <ComputeFourierOnWindow />,
    "type": "seismic-articles",
    "template_name": "compute-fourier-on-window"
  }
]

const allTools = [
  {
    "id": 1,
    "title": "Fourier Spectra calculation",
    "small-description": "Compute the Fourier spectra at a window on the seismogram",
    "description": "An interactive tool to calculate the Fourier spectra at the signal and/or the noise window on the seismogram. Optionally, compute the Horizontal to Vertical Spectral Ratio (HVSR) using the generated Fourier spectra. Feel free to download the data and the figures at the results.",
    "image_name": FourierImage,
    "component": <Fourier />,
    "type": "seismic-tools",
    "template_name": "fourier"
  },
  {
    "id": 2,
    "title": "Edit Seismic File",
    "small-description": "Process seismic files using the interactive tools",
    "description": "A tool to look inside the content of a seismic file. Feel free to edit the header of it and download its data and header information",
    "image_name": EditSeismicFileImage,
    "component": <EditSeismicFile />,
    "type": "seismic-tools",
    "template_name": "edit-seismic-file"
  },
  {
    "id": 3,
    "title": "Distance between points",
    "small-description": "calculate the distance between two points on the WGS84 ellipsoid",
    "description": "An interactive tool to compute the distance between two geographical points on the WGS84 ellipsoid. Use the \"locate\" option to open an interactive map and visually inspect the specified points.",
    "image_name": DistanceBetweenPointsImage,
    "component": <DistanceBetweenPoints />,
    "type": "seismic-tools",
    "template_name": "distance-between-points"
  },
  {
    "id": 4,
    "title": "Arrival Time Selection",
    "small-description": "Select the P & S wave arrivals",
    "description": "An interactive tool to extract the P & S wave arrival times from the records. You can use either the built-in filters or manually set filters to filter the seismograms within a defined frequency range, simplifying the process of selecting the arrivals.",
    "user-guide": "Begin by uploading a seismic data file using the Upload option. From the top menu, select either the P-wave (P button) or S-wave (S button) option, then click anywhere on the waveforms to select the arrival time of the chosen wave. To remove a previously applied arrival time, use the del P and del S buttons. Feel free to utilize the filter dropdown in the top menu to apply a pre-defined filter to the waveforms, which can facilitate your picking process. Additionally, you have the option to manually input a filter using the entry boxes located at the bottom right corner. If you input a value only in the left entry box, a highpass filter will be applied with the specified frequency. Similarly, you input a value only in the right entry box, a lowpass filter will be implemented using the specified frequency. If both entry boxes are filled, a bandpass filter will be applied. Once the mouse focus is in the left or right entry box, simply press the Enter key to confirm your input and apply the manual filters. Lastly, utilize the options located at the top right corner of the plot to zoom in, zoom out, and adjust the position of the waveforms. ",
    "image_name": PickArrivalsImage,
    "component": <PickArrivals />,
    "type": "seismic-tools",
    "template_name": "pick-arrivals"
  },
  {
    "id": 5,
    "title": "Data Files To MiniSEED",
    "small-description": "Convert ASCII files to MSEED seismic files",
    "template_path": "file-to-mseed",
    "description": "An interactive tool to transform data files into the seismic MiniSEED format. To begin, upload your file at the specific file format menu, and specify the relevant parameters (e.g., delimiter and skip rows). Afterward, choose the corresponding seismic parameters to complete the conversion process.",
    "image_name": FileToMseedImage,
    "component": <FileToMseed />,
    "type": "seismic-tools",
    "template_name": "file-to-mseed"
  },
  {
    "id": 6,
    "title": "Signal Processing",
    "small-description": "Apply signal processing techniques to a seismogram",
    "description": "An interactive tool to process seismic records using various techniques to cut the waveforms between a specific time range, to apply a smoothing function using an appropriate filter and eliminate any pre-existing trend in the waveforms.",
    "image_name": SignalProcessingImage,
    "component": <SignalProcessing />,
    "type": "seismic-tools",
    "template_name": "signal-processing"
  },
]

export { allArticles, allTools };
