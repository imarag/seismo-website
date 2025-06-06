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
    subtitle: "View, edit, and manage seismic trace data and headers.",
    description:
      "Import MiniSEED seismic files to explore, edit, and export both trace headers and waveform data. Visualize each trace in an interactive chart, update metadata such as station codes, timestamps, or network info, and make precise edits to individual trace data samples. Remove unnecessary traces or headers, then export the modified stream back to MiniSEED. A powerful tool for detailed seismic data management.",
    smallDescription:
      "Import MiniSEED files to inspect and edit trace headers and data.",
    image_src: EditSeismicFileIcon,
    image_alt: "Interactive Seismic File Editor Icon",
    type: "tool",
    slug: "edit-seismic-file",
    completed: true,
    userGuide:
      "Upload a MiniSEED seismic file to explore its contents. Click 'Show Traces Info' for a summary of each trace’s metadata. View trace waveforms in interactive plots and use the toolbar above each plot to download header info or data samples individually. Use the 'Trace Info' menu to edit trace headers or delete traces. Once your edits are complete, export the updated file in MiniSEED format using the 'Download to MSEED' option.",
  },
  {
    id: 2,
    title: "Geodesic Distance Calculator",
    subtitle: "Calculate distances and azimuths between geographic points.",
    description: "Compute the precise geodesic distance and forward/backward azimuths between two geographic points using the WGS84 ellipsoid. Use the interactive map to visualize and refine point positions.",
    smallDescription: "Calculate distance and azimuths between two points.",
    image_src: DistanceBetweenPointsIcon,
    image_alt: "Geodesic Distance Calculator Icon",
    type: "tool",
    slug: "distance-between-points",
    completed: true,
    userGuide: "This tool calculates the geodesic distance and both forward and backward azimuths between two locations on Earth using the WGS84 ellipsoid. Enter the latitude and longitude for each point (latitude must be between -90° and 90°, longitude between -180° and 180°). Use the interactive map to verify and adjust point positions for accuracy. Ideal for geospatial and geophysical use cases where precision is essential. Take into account that some browsers may not accept starting with a minus in number inputs when entering negative values in the input fields. For this reason, in case you need to add a negative coordinate first type the number and then add the minus sign in front. Use the interactive map to verify and adjust point positions for accuracy. Ideal for geospatial and geophysical use cases where precision is essential."
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
    userGuide: "This tool is designed to help you identify P and S wave arrivals on seismic waveforms. Upload your seismic data using the file selector and explore the interactive waveform display to zoom into areas of interest. Use the filters dropdown and the manual filter fields at the bottom to apply specific frequency ranges to the waveforms. Manually mark arrival times for P and S waves by clicking on the seismogram, and export your selections using the 'download arrivals' option. For manual filtering: fill only the left field to apply a highpass filter (passing frequencies above the cutoff), fill only the right field to apply a lowpass filter (passing frequencies below the cutoff), fill both fields to apply a bandpass filter (passing frequencies within the range). Press the Enter key to apply the filter. Use the mouse to select a window on the graph to zoom into that area. Double-click anywhere on the graph to zoom out and reset the axis. Note: If you interact with elements outside the graph—for example, clicking a button to download arrival times—Plotly’s interactivity may temporarily stop responding. To restore full interactivity, simply click once on the graph."
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
  },
  // {
  //   id: 6,
  //   title: "Simple Triangulation",
  //   subtitle: "Locate an earthquake's epicenter using body wave arrivals",
  //   description: "Estimate an earthquake’s epicenter by analyzing P and S wave arrival times from multiple stations. Calculate distances and visualize intersecting circles to pinpoint the source location.",
  //   smallDescription: "Determine epicenter using arrival times.",
  //   image_src: SignalProcessingIcon,
  //   image_alt: "Triangulation Tool Icon",
  //   type: "tool",
  //   slug: "simple-triangulation",
  //   completed: true,
  //   userGuide: "This tool allows you to locate an earthquake's epicenter using triangulation. Upload seismic data from at least three stations and manually mark the P and S wave arrival times. The tool calculates the distance from each station based on the S-P time difference and draws a circle of that radius around each station. The intersection point of these circles indicates the estimated epicenter location. Adjust parameters if needed and export the results for further analysis."
  // }

];
