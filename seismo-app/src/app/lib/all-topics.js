import ObspyIcon from '@/images/template-images/resized/obspy-icon.png';
import SiteEffectIcon from '@/images/template-images/resized/site-effect-icon.png';
import SeismologyIntroIcon from '@/images/template-images/resized/introduction-to-seismology-icon.png';
import MatplotlibIcon from '@/images/template-images/resized/matplotlib-icon.png';
import ComputeFourierOnWindowIcon from '@/images/template-images/resized/fourier-on-window-icon.png';
import FileManipulationIcon from '@/images/template-images/resized/file-manipulation-icon.png';

import FourierIcon from '@/images/template-images/resized/fourier-icon.png';
import PickArrivalsIcon from '@/images/template-images/resized/arrival-pick-icon.png';
import FileToMseedIcon from '@/images/template-images/resized/file-to-mseed-icon.png';
import SignalProcessingIcon from '@/images/template-images/resized/signal-processing-icon.png';
import DistanceBetweenPointsIcon from '@/images/template-images/resized/distance-between-points-icon.png';
import EditSeismicFileIcon from '@/images/template-images/resized/edit-seismic-file-icon.png';

export const allArticles = [
  {
    "id": 1,
    "title": "Mastering Python for Seismology with ObsPy",
    "description": "Dive deep into ObsPy, a powerful Python library tailored for analyzing and processing seismic data. Learn how to read, write, and visualize seismic waveforms and metadata for advanced seismological research.",
    "icon": ObspyIcon,
    "iconAlt": "ObsPy logo - A Python library for seismic data",
    "type": "article",
    "slug": "obspy"
  },
  {
    "id": 2,
    "title": "Understanding Seismic Site Effects",
    "description": "Explore how geological and soil conditions amplify seismic ground motion. This article discusses evaluation methods and mitigation strategies to improve earthquake risk assessments.",
    "icon": SiteEffectIcon,
    "iconAlt": "Seismic site effects icon - Amplified ground motion illustration",
    "type": "article",
    "slug": "site-effect"
  },
  {
    "id": 3,
    "title": "Introduction to Seismology: The Basics",
    "description": "A beginner-friendly guide to earthquake science, covering key concepts like seismic waves, earthquake mechanics, and seismic data collection techniques and various other interesting topics.",
    "icon": SeismologyIntroIcon,
    "iconAlt": "Introduction to seismology icon - Earthquake and wave illustration",
    "type": "article",
    "slug": "introduction-to-seismology"
  },
  {
    "id": 4,
    "title": "Effective File Management with Python",
    "description": "Learn how to handle files and directories effortlessly using Python file manipulation libraries such as `os`, `shutil` and `pathlib`. Automate data preparation and streamline your workflow for a complete python file manipulation.",
    "icon": FileManipulationIcon,
    "iconAlt": "File management icon - File and folder representation",
    "type": "article",
    "slug": "file-manipulation"
  },
  {
    "id": 5,
    "title": "Visualizing Seismic Data with Matplotlib",
    "description": "Discover how to use Matplotlib for seismic data visualization. Learn techniques for plotting waveforms and customizing visualizations to interpret seismic events effectively.",
    "icon": MatplotlibIcon,
    "iconAlt": "Matplotlib visualization icon - Graph representation",
    "type": "article",
    "slug": "matplotlib"
  },
  {
    "id": 6,
    "title": "Fourier Analysis of Seismic Data",
    "description": "Step-by-step guidance on performing Fourier analysis over selected seismic data windows. Gain insights into frequency content and its implications for seismic interpretation.",
    "icon": ComputeFourierOnWindowIcon,
    "iconAlt": "Fourier analysis icon - Frequency spectrum representation",
    "type": "article",
    "slug": "compute-fourier-on-window"
  }
];

export const allTools = [
  {
    "id": 1,
    "title": "Fourier Spectra Calculator",
    "description": "Easily calculate Fourier spectra for seismic signal and noise windows. Optionally compute Horizontal to Vertical Spectral Ratio (HVSR) and download your results in various formats.",
    "icon": FourierIcon ,
    "iconAlt": "Fourier Spectra Calculator Icon",
    "type": "tool",
    "slug": "fourier"
  },
  {
    "id": 2,
    "title": "Interactive Seismic File Editor",
    "description": "Inspect and edit seismic file headers and metadata. Download updated data for further analysis and streamline seismic data management.",
    "icon": EditSeismicFileIcon ,
    "iconAlt": "Interactive Seismic File Editor Icon",
    "type": "tool",
    "slug": "edit-seismic-file"
  },
  {
    "id": 3,
    "title": "Geodesic Distance Calculator",
    "description": "Compute precise distances between two geographical points using the WGS84 ellipsoid. Visualize your points on an interactive map for added clarity.",
    "icon": DistanceBetweenPointsIcon ,
    "iconAlt": "Geodesic Distance Calculator Icon",
    "type": "tool",
    "slug": "distance-between-points"
  },
  {
    "id": 4,
    "title": "P & S Wave Arrival Picker",
    "description": "Pinpoint P and S wave arrival times with advanced filters. Enhance your seismic data analysis by visually isolating and selecting wave arrivals.",
    "icon": PickArrivalsIcon,
    "iconAlt": "P & S Wave Arrival Picker Icon",
    "type": "tool",
    "slug": "pick-arrivals"
  },
  {
    "id": 5,
    "title": "Convert Data Files to MiniSEED",
    "description": "Upload your data file, set conversion parameters, and generate seismic MiniSEED files. Simplify seismic data standardization and enhance compatibility with tools.",
    "icon": FileToMseedIcon ,
    "iconAlt": "Convert Data Files to MiniSEED Icon",
    "type": "tool",
    "slug": "file-to-mseed"
  },
  {
    "id": 6,
    "title": "Signal Processing Toolkit",
    "description": "Cut, filter, and smooth seismic waveforms using advanced processing techniques. Remove trends and optimize waveforms for analysis.",
    "icon": SignalProcessingIcon ,
    "iconAlt": "Signal Processing Toolkit Icon",
    "type": "tool",
    "slug": "signal-processing"
  }
];
