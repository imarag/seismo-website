import Obspy from '@/app/lib/markdowns/obspy.md';
import SiteEffect from '@/app/lib/markdowns/site-effect.md';
import SeismologyIntro from '@/app/lib/markdowns/introduction-to-seismology.md';
import FileManipulation from '@/app/lib/markdowns/file-manipulation.md';
import Matplotlib from '@/app/lib/markdowns/matplotlib.md';
import ComputeFourierOnWindow from '@/app/lib/markdowns/compute-fourier-on-window.md';

import Fourier from '@/app/ui/tools/Fourier';
import PickArrivals from '@/app/ui/tools/PickArrivals';
import FileToMseed from '@/app/ui/tools/FileToMseed';
import SignalProcessing from '@/app/ui/tools/SignalProcessing';
import DistanceBetweenPoints from '@/app/ui/tools/DistanceBetweenPoints';
import EditSeismicFile from '@/app/ui/tools/EditSeismicFile';

const allArticles = [
  {
    "id": 1,
    "title": "Mastering Python for Seismology with ObsPy",
    "description": "Dive deep into ObsPy, a powerful Python library tailored for analyzing and processing seismic data. Learn how to read, write, and visualize seismic waveforms and metadata for advanced seismological research.",
    "iconPath": "/img/template-images/obspy-icon.png",
    "markdownFileName": Obspy,
    "type": "article",
    "pathLabel": "obspy"
  },
  {
    "id": 2,
    "title": "Understanding Seismic Site Effects",
    "description": "Explore how geological and soil conditions amplify seismic ground motion. This article discusses evaluation methods and mitigation strategies to improve earthquake risk assessments.",
    "iconPath": "/img/template-images/site-effect-icon.png",
    "markdownFileName": SiteEffect,
    "type": "article",
    "pathLabel": "site-effect"
  },
  {
    "id": 3,
    "title": "Introduction to Seismology: The Basics",
    "description": "A beginner-friendly guide to earthquake science, covering key concepts like seismic waves, earthquake mechanics, and seismic data collection techniques.",
    "iconPath": "/img/template-images/introduction-to-seismology-icon.png",
    "markdownFileName": SeismologyIntro,
    "type": "article",
    "pathLabel": "introduction-to-seismology"
  },
  {
    "id": 4,
    "title": "Effective File Management with Python",
    "description": "Learn how to handle files and directories effortlessly using Python libraries like `os` and `shutil`. Automate data preparation and streamline your workflow.",
    "iconPath": "/img/template-images/file-manipulation-icon.png",
    "markdownFileName": FileManipulation,
    "type": "article",
    "pathLabel": "file-manipulation"
  },
  {
    "id": 5,
    "title": "Visualizing Seismic Data with Matplotlib",
    "description": "Discover how to use Matplotlib for seismic data visualization. Learn techniques for plotting waveforms and customizing visualizations to interpret seismic events effectively.",
    "iconPath": "/img/template-images/matplotlib-icon.png",
    "markdownFileName": Matplotlib,
    "type": "article",
    "pathLabel": "matplotlib"
  },
  {
    "id": 6,
    "title": "Fourier Analysis of Seismic Data",
    "description": "Step-by-step guidance on performing Fourier analysis over selected seismic data windows. Gain insights into frequency content and its implications for seismic interpretation.",
    "iconPath": "/img/template-images/edit-seismic-file-icon.png",
    "markdownFileName": ComputeFourierOnWindow,
    "type": "article",
    "pathLabel": "compute-fourier-on-window"
  }
];

const allTools = [
  {
    "id": 1,
    "title": "Fourier Spectra Calculator",
    "small-description": "Analyze frequency content of seismic signals",
    "description": "Easily calculate Fourier spectra for seismic signal and noise windows. Optionally compute Horizontal to Vertical Spectral Ratio (HVSR) and download your results in various formats.",
    "iconPath": "/img/template-images/fourier-icon.png",
    "component": <Fourier />, 
    "type": "tool",
    "pathLabel": "fourier"
  },
  {
    "id": 2,
    "title": "Interactive Seismic File Editor",
    "small-description": "Modify and explore seismic data files",
    "description": "Inspect and edit seismic file headers and metadata. Download updated data for further analysis and streamline seismic data management.",
    "iconPath": "/img/template-images/edit-seismic-file-icon.png",
    "component": <EditSeismicFile />, 
    "type": "tool",
    "pathLabel": "edit-seismic-file"
  },
  {
    "id": 3,
    "title": "Geodesic Distance Calculator",
    "small-description": "Measure distances on the Earth's surface",
    "description": "Compute precise distances between two geographical points using the WGS84 ellipsoid. Visualize your points on an interactive map for added clarity.",
    "iconPath": "/img/template-images/distance-between-points-icon.png",
    "component": <DistanceBetweenPoints />, 
    "type": "tool",
    "pathLabel": "distance-between-points"
  },
  {
    "id": 4,
    "title": "P & S Wave Arrival Picker",
    "small-description": "Identify seismic wave arrivals",
    "description": "Pinpoint P and S wave arrival times with advanced filters. Enhance your seismic data analysis by visually isolating and selecting wave arrivals.",
    "iconPath": "/img/template-images/arrival-pick-icon.png",
    "component": <PickArrivals />, 
    "type": "tool",
    "pathLabel": "pick-arrivals"
  },
  {
    "id": 5,
    "title": "Convert Data Files to MiniSEED",
    "small-description": "Transform ASCII data to MiniSEED format",
    "description": "Upload your data file, set conversion parameters, and generate seismic MiniSEED files. Simplify seismic data standardization and enhance compatibility with tools.",
    "iconPath": "/img/template-images/file-to-mseed-icon.png",
    "component": <FileToMseed />, 
    "type": "tool",
    "pathLabel": "file-to-mseed"
  },
  {
    "id": 6,
    "title": "Signal Processing Toolkit",
    "small-description": "Process and refine seismic signals",
    "description": "Cut, filter, and smooth seismic waveforms using advanced processing techniques. Remove trends and optimize waveforms for analysis.",
    "iconPath": "/img/template-images/signal-processing-icon.png",
    "component": <SignalProcessing />, 
    "type": "tool",
    "pathLabel": "signal-processing"
  }
];

export { allArticles, allTools };
