// Import your topic components
import Obspy from './pages/articles/Obspy';
// import Fourier from './pages/tools/Fourier';
// import PickArrivals from './pages/tools/PickArrivals';
// import FileToMseed from './pages/tools/FileToMseed';
// import SignalProcessing from './pages/tools/SignalProcessing';
import SiteEffect from './pages/articles/SiteEffect';
import SeismologyIntro from './pages/articles/SeismologyIntro';
// import DistanceBetweenPoints from './pages/tools/DistanceBetweenPoints';
// import FileManipulation from './pages/articles/FileManipulation';
import Matplotlib from './pages/articles/Matplotlib';
// import EditSeismicFile from './pages/tools/EditSeismicFile';
import ComputeFourierOnWindow from './pages/articles/ComputeFourierOnWindow';

// Map template_name to component
const topicComponents = {
  "obspy": <Obspy />,
  // "fourier": Fourier,
  // "pick-arrivals": PickArrivals,
  // "file-to-mseed": FileToMseed,
  // "signal-processing": SignalProcessing,
  "site-effect": <SiteEffect />,
  "seismology-intro": <SeismologyIntro />,
  // "distance-between-points": DistanceBetweenPoints,
  // "file-manipulation": FileManipulation,
  "matplotlib": <Matplotlib />,
  // "edit-seismic-file": EditSeismicFile,
  "compute-fourier-on-window": <ComputeFourierOnWindow />,
};

export default topicComponents;
