import ObsPyIcon from '@/images/template-images/resized/obspy-icon.png';
import SiteEffectIcon from '@/images/template-images/resized/site-effect-icon.png';
import SeismologyIntroIcon from '@/images/template-images/resized/introduction-to-seismology-icon.png';
import MatplotlibIcon from '@/images/template-images/resized/matplotlib-icon.png';
import ComputeFourierOnWindowIcon from '@/images/template-images/resized/fourier-on-window-icon.png';
import FileManipulationIcon from '@/images/template-images/resized/file-manipulation-icon.png';

import ObsPyMarkdown from '@/markdowns/obspy.mdx';
import SiteEffectMarkdown from '@/markdowns/site-effect.mdx';
import SeismologyIntroMarkdown from '@/markdowns/introduction-to-seismology.mdx';
import MatplotlibMarkdown from '@/markdowns/matplotlib.mdx';
import ComputeFourierOnWindowMarkdown from '@/markdowns/compute-fourier-on-window.mdx';
import FileManipulationMarkdown from '@/markdowns/file-manipulation.mdx';

import FourierIcon from '@/images/template-images/resized/fourier-icon.png';
import PickArrivalsIcon from '@/images/template-images/resized/arrival-pick-icon.png';
import FileToMseedIcon from '@/images/template-images/resized/file-to-mseed-icon.png';
import SignalProcessingIcon from '@/images/template-images/resized/signal-processing-icon.png';
import DistanceBetweenPointsIcon from '@/images/template-images/resized/distance-between-points-icon.png';
import EditSeismicFileIcon from '@/images/template-images/resized/edit-seismic-file-icon.png';

export const allArticles = [
  {
    id: 1,
    title: "Mastering Python for Seismology with ObsPy",
    description: "Dive deep into ObsPy, a powerful Python library tailored for analyzing and processing seismic data. Learn how to read, write, and visualize seismic waveforms, extract metadata, and perform advanced analyses critical for seismological research.",
    icon: ObsPyIcon,
    iconAlt: "ObsPy logo - A Python library for seismic data",
    type: "article",
    slug: "obspy",
    markdown: ObsPyMarkdown,
    completed: true,
  },
  {
    id: 2,
    title: "Understanding Seismic Site Effects",
    description: "Explore how geological and soil conditions amplify seismic ground motion. Gain insights into evaluation methods, modeling techniques, and mitigation strategies to improve earthquake risk assessments and urban planning.",
    icon: SiteEffectIcon,
    iconAlt: "Seismic site effects icon - Amplified ground motion illustration",
    type: "article",
    slug: "site-effect",
    markdown: SiteEffectMarkdown,
    completed: true,
  },
  {
    id: 3,
    title: "Introduction to Seismology: The Basics",
    description: "A beginner-friendly guide to earthquake science, covering seismic wave propagation, earthquake mechanics, fault dynamics, and the methods used for seismic data collection and interpretation.",
    icon: SeismologyIntroIcon,
    iconAlt: "Introduction to seismology icon - Earthquake and wave illustration",
    type: "article",
    slug: "introduction-to-seismology",
    markdown: SeismologyIntroMarkdown,
    completed: true,
  },
  {
    id: 4,
    title: "Effective File Management with Python",
    description: "Learn how to handle files and directories effortlessly using Python's robust file manipulation libraries such as `os`, `shutil`, and `pathlib`. Automate data preparation, streamline workflows, and manage large-scale seismic datasets effectively.",
    icon: FileManipulationIcon,
    iconAlt: "File management icon - File and folder representation",
    type: "article",
    slug: "file-manipulation",
    markdown: FileManipulationMarkdown,
    completed: true,
  },
  {
    id: 5,
    title: "Visualizing Seismic Data with Matplotlib",
    description: "Discover how to use Matplotlib for seismic data visualization. Learn techniques for plotting waveforms, frequency spectra, and custom seismic event visualizations to effectively interpret your data.",
    icon: MatplotlibIcon,
    iconAlt: "Matplotlib visualization icon - Graph representation",
    type: "article",
    slug: "matplotlib",
    markdown: MatplotlibMarkdown,
    completed: true,
  },
  {
    id: 6,
    title: "Fourier Analysis of Seismic Data",
    description: "Step-by-step guidance on performing Fourier analysis over selected seismic data windows. Explore frequency content to understand seismic source characteristics and improve interpretation accuracy.",
    icon: ComputeFourierOnWindowIcon,
    iconAlt: "Fourier analysis icon - Frequency spectrum representation",
    type: "article",
    slug: "compute-fourier-on-window",
    markdown: ComputeFourierOnWindowMarkdown,
    completed: true,
  }
];

export const allTools = [
  {
    id: 1,
    title: "Fourier Spectra Calculator",
    subtitle: "Analyze seismic data with Fourier spectra and HVSR.",
    description: "Easily calculate Fourier spectra for seismic signal and noise windows. Optionally compute Horizontal to Vertical Spectral Ratio (HVSR) to evaluate site effects and download results in multiple formats for further processing.",
    smallDescription: "Calculate Fourier spectra and HVSR for seismic data.",
    icon: FourierIcon,
    iconAlt: "Fourier Spectra Calculator Icon",
    type: "tool",
    slug: "fourier",
    completed: true,
    userGuide: "This tool helps you calculate Fourier spectra for seismic signals and noise windows. Start by uploading your seismic data, and define the time windows you want to analyze. You can also compute Horizontal to Vertical Spectral Ratios (HVSR) for further insights. Once processed, results can be downloaded in various formats for deeper analysis."
  },
  {
    id: 2,
    title: "Interactive Seismic File Editor",
    subtitle: "Edit seismic file headers with ease.",
    description: "Inspect and edit seismic file headers and metadata with a user-friendly interface. Ensure data accuracy by updating station codes, timing, and other attributes. Export the modified file for seamless integration into seismic analysis workflows.",
    smallDescription: "Edit seismic file headers and metadata easily.",
    icon: EditSeismicFileIcon,
    iconAlt: "Interactive Seismic File Editor Icon",
    type: "tool",
    slug: "edit-seismic-file",
    completed: true,
    userGuide: "This editor allows you to inspect and update seismic file headers and metadata. Load your seismic file to view detailed information, including station, channel, and timing data. Use the editing interface to correct errors, fill missing fields, or update values as required. After editing, save and download the updated file for integration into your workflows."
  },
  {
    id: 3,
    title: "Geodesic Distance Calculator",
    subtitle: "Calculate distances between geographic points.",
    description: "Compute precise distances between two geographical points using advanced geodesic algorithms. Visualize points on an interactive map for improved accuracy and usability.",
    smallDescription: "Compute geographic distances with precision.",
    icon: DistanceBetweenPointsIcon,
    iconAlt: "Geodesic Distance Calculator Icon",
    type: "tool",
    slug: "distance-between-points",
    completed: true,
    userGuide: "Calculate accurate distances between two points on Earth using geodesic algorithms. Input the latitude and longitude for each point, and the tool will compute the distance based on the WGS84 ellipsoid. Use the interactive map to verify and adjust the points visually. This tool is ideal for geophysical applications requiring precise location measurements."
  },
  {
    id: 4,
    title: "P & S Wave Arrival Picker",
    subtitle: "Identify P and S wave arrival times.",
    description: "Visually pinpoint the arrival times of P and S waves on seismic waveforms. Enhance your analysis with advanced filters and export results for detailed review.",
    smallDescription: "Mark P and S wave arrivals on seismic data.",
    icon: PickArrivalsIcon,
    iconAlt: "P & S Wave Arrival Picker Icon",
    type: "tool",
    slug: "pick-arrivals",
    completed: true,
    userGuide: "This tool is designed to help you identify P and S wave arrivals on seismic waveforms. Upload your data, and use the interactive waveform display to zoom into areas of interest. Apply filters to remove noise and highlight critical wave patterns. Manually mark arrival times for P and S waves, and export your selections for further analysis."
  },
  {
    id: 5,
    title: "Convert Data Files to MiniSEED",
    subtitle: "Transform seismic files into MiniSEED format.",
    description: "Convert seismic data into the standardized MiniSEED format. Simplify data compatibility and improve workflow efficiency with customizable conversion parameters.",
    smallDescription: "Convert seismic files to MiniSEED format.",
    icon: FileToMseedIcon,
    iconAlt: "Convert Data Files to MiniSEED Icon",
    type: "tool",
    slug: "file-to-mseed",
    completed: false,
    userGuide: "This tool simplifies the process of converting various seismic file formats into MiniSEED. Upload your file and specify conversion settings, such as station codes and sample rates. The tool validates input data to ensure compatibility and generates standardized MiniSEED files. Download the converted files for seamless integration with analysis software."
  },
  {
    id: 6,
    title: "Signal Processing Toolkit",
    subtitle: "Process seismic waveforms efficiently.",
    description: "Perform advanced processing of seismic waveforms, including filtering, smoothing, and trend removal. Optimize data quality for analysis and visualization.",
    smallDescription: "Process and enhance seismic waveforms.",
    icon: SignalProcessingIcon,
    iconAlt: "Signal Processing Toolkit Icon",
    type: "tool",
    slug: "signal-processing",
    completed: true,
    userGuide: "This toolkit provides advanced signal processing capabilities for seismic waveforms. Load your data, and use tools to cut waveforms, apply filters, or smooth noisy signals. Additional features allow you to remove trends and perform baseline corrections. Export processed data for detailed seismic analysis or visualization."
  }
];
