import * as ObsPyMarkdown from '../markdowns/obspy.mdx';
import * as SiteEffectMarkdown from '../markdowns/site-effect.mdx';
import * as SeismologyIntroMarkdown from '../markdowns/introduction-to-seismology.mdx';
import * as MatplotlibMarkdown from '../markdowns/matplotlib.mdx';
import * as ComputeFourierOnWindowMarkdown from '../markdowns/compute-fourier-on-window.mdx';
import * as FileManipulationMarkdown from '../markdowns/file-manipulation.mdx';

import ObspyIcon from "../../assets/images/topics-icons/obspy-icon.png"
import SiteEffectIcon from "../../assets/images/topics-icons/site-effect-icon.png"
import IntroToSeismologyIcon from "../../assets/images/topics-icons/introduction-to-seismology-icon.png"
import FileManipulationIcon from "../../assets/images/topics-icons/file-manipulation-icon.png"
import MatplotlibIcon from "../../assets/images/topics-icons/matplotlib-icon.png"
import FourierOnWindowIcon from "../../assets/images/topics-icons/fourier-on-window-icon.png"

import EditSeismicFileIcon from "../../assets/images/topics-icons/edit-seismic-file-icon.png"
import DistanceBetweenPointsIcon from "../../assets/images/topics-icons/distance-between-points-icon.png"
import ArrivalPickIcon from "../../assets/images/topics-icons/arrival-pick-icon.png"
import FileToMseedIcon from "../../assets/images/topics-icons/file-to-mseed-icon.png"
import SignalProcessingIcon from "../../assets/images/topics-icons/signal-processing-icon.png"

export const articles = [
  {
    id: 1,
    title: "Mastering Python for Seismology with ObsPy",
    description: "Dive deep into ObsPy, a powerful Python library tailored for analyzing and processing seismic data. Learn how to read, write, and visualize seismic waveforms, extract metadata, and perform advanced analyses critical for seismological research.",
    image_src: ObspyIcon,
    image_alt: "ObsPy logo - A Python library for seismic data",
    type: "article",
    slug: "obspy",
    markdown: ObsPyMarkdown,
    completed: true,
    keywords: ["Python", "ObsPy", "seismology"]
  },
  {
    id: 2,
    title: "Understanding Seismic Site Effects",
    description: "Explore how geological and soil conditions amplify seismic ground motion. Gain insights into evaluation methods, modeling techniques, and mitigation strategies to improve earthquake risk assessments and urban planning.",
    image_src: SiteEffectIcon,
    image_alt: "Seismic site effects icon - Amplified ground motion illustration",
    type: "article",
    slug: "site-effect",
    markdown: SiteEffectMarkdown,
    completed: true,
    keywords: ["site effects", "earthquake risk", "seismic ground motion"]
  },
  {
    id: 3,
    title: "Introduction to Seismology: The Basics",
    description: "A beginner-friendly guide to earthquake science, covering seismic wave propagation, earthquake mechanics, fault dynamics, and the methods used for seismic data collection and interpretation.",
    image_src: IntroToSeismologyIcon,
    image_alt: "Introduction to seismology icon - Earthquake and wave illustration",
    type: "article",
    slug: "introduction-to-seismology",
    markdown: SeismologyIntroMarkdown,
    completed: true,
    keywords: ["seismology", "earthquake science", "seismic waves"]
  },
  {
    id: 4,
    title: "Effective File Management with Python",
    description: "Learn how to handle files and directories effortlessly using Python's robust file manipulation libraries such as `os`, `shutil`, and `pathlib`. Automate data preparation, streamline workflows, and manage large-scale seismic datasets effectively.",
    image_src: FileManipulationIcon,
    image_alt: "File management icon - File and folder representation",
    type: "article",
    slug: "file-manipulation",
    markdown: FileManipulationMarkdown,
    completed: true,
    keywords: ["Python", "file management", "automation"]
  },
  {
    id: 5,
    title: "Visualizing Seismic Data with Matplotlib",
    description: "Discover how to use Matplotlib for seismic data visualization. Learn techniques for plotting waveforms, frequency spectra, and custom seismic event visualizations to effectively interpret your data.",
    image_src: MatplotlibIcon,
    image_alt: "Matplotlib visualization icon - Graph representation",
    type: "article",
    slug: "matplotlib",
    markdown: MatplotlibMarkdown,
    completed: true,
    keywords: ["Matplotlib", "seismic data", "visualization"]
  },
  {
    id: 6,
    title: "Fourier Analysis of Seismic Data",
    description: "Step-by-step guidance on performing Fourier analysis over selected seismic data windows. Explore frequency content to understand seismic source characteristics and improve interpretation accuracy.",
    image_src: FourierOnWindowIcon,
    image_alt: "Fourier analysis icon - Frequency spectrum representation",
    type: "article",
    slug: "compute-fourier-on-window",
    markdown: ComputeFourierOnWindowMarkdown,
    completed: true,
    keywords: ["Fourier analysis", "seismic data", "signal processing"]
  }
];

export const tools = [
  {
    id: 1,
    title: "Interactive Seismic File Editor",
    subtitle: "Edit seismic file headers with ease.",
    description: "Inspect and edit seismic file headers and metadata with a user-friendly interface. Ensure data accuracy by updating station codes, timing, and other attributes. Export the modified file for seamless integration into seismic analysis workflows.",
    smallDescription: "Edit seismic file headers and metadata easily.",
    image_src: EditSeismicFileIcon,
    image_alt: "Interactive Seismic File Editor Icon",
    type: "tool",
    slug: "edit-seismic-file",
    completed: true,
    userGuide: "This editor allows you to inspect and update seismic file headers and metadata. Load your seismic file to view detailed information, including station, channel, and timing data. Use the editing interface to correct errors, fill missing fields, or update values as required. After editing, save and download the updated file for integration into your workflows."
  },
  {
    id: 2,
    title: "Geodesic Distance Calculator",
    subtitle: "Calculate distances between geographic points.",
    description: "Compute precise distances between two geographical points using advanced geodesic algorithms. Visualize points on an interactive map for improved accuracy and usability.",
    smallDescription: "Compute geographic distances with precision.",
    image_src: DistanceBetweenPointsIcon,
    image_alt: "Geodesic Distance Calculator Icon",
    type: "tool",
    slug: "distance-between-points",
    completed: true,
    userGuide: "Calculate accurate distances between two points on Earth using geodesic algorithms. Input the latitude and longitude for each point, and the tool will compute the distance based on the WGS84 ellipsoid. Use the interactive map to verify and adjust the points visually. This tool is ideal for geophysical applications requiring precise location measurements."
  },
  {
    id: 3,
    title: "P & S Wave Arrival Picker",
    subtitle: "Identify P and S wave arrival times.",
    description: "Visually pinpoint the arrival times of P and S waves on seismic waveforms. Enhance your analysis with advanced filters and export results for detailed review.",
    smallDescription: "Mark P and S wave arrivals on seismic data.",
    image_src: ArrivalPickIcon,
    image_alt: "P & S Wave Arrival Picker Icon",
    type: "tool",
    slug: "pick-arrivals",
    completed: true,
    userGuide: "This tool is designed to help you identify P and S wave arrivals on seismic waveforms. Upload your data, and use the interactive waveform display to zoom into areas of interest. Apply filters to remove noise and highlight critical wave patterns. Manually mark arrival times for P and S waves, and export your selections for further analysis."
  },
  {
    id: 4,
    title: "Convert Data Files to MiniSEED",
    subtitle: "Transform seismic files into MiniSEED format.",
    description: "Convert seismic data into the standardized MiniSEED format. Simplify data compatibility and improve workflow efficiency with customizable conversion parameters.",
    smallDescription: "Convert seismic files to MiniSEED format.",
    image_src: FileToMseedIcon,
    image_alt: "Convert Data Files to MiniSEED Icon",
    type: "tool",
    slug: "file-to-mseed",
    completed: false,
    userGuide: "This tool simplifies the process of converting various seismic file formats into MiniSEED. Upload your file and specify conversion settings, such as station codes and sample rates. The tool validates input data to ensure compatibility and generates standardized MiniSEED files. Download the converted files for seamless integration with analysis software."
  },
  {
    id: 5,
    title: "Signal Processing Toolkit",
    subtitle: "Process seismic waveforms efficiently.",
    description: "Perform advanced processing of seismic waveforms, including filtering, smoothing, and trend removal. Optimize data quality for analysis and visualization.",
    smallDescription: "Process and enhance seismic waveforms.",
    image_src: SignalProcessingIcon,
    image_alt: "Signal Processing Toolkit Icon",
    type: "tool",
    slug: "signal-processing",
    completed: true,
    userGuide: "This toolkit provides advanced signal processing capabilities for seismic waveforms. Load your data, and use tools to cut waveforms, apply filters, or smooth noisy signals. Additional features allow you to remove trends and perform baseline corrections. Export processed data for detailed seismic analysis or visualization."
  }
];
