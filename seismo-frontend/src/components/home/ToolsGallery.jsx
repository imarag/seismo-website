import { useState } from "react";
import FourierComputation from "../../assets/images/pages/fourier-computation.gif";
import ArrivalPick from "../../assets/images/pages/pick-waveform.gif";
import TrimWaveform from "../../assets/images/pages/trim-waveform.gif";
import TaperWaveform from "../../assets/images/pages/taper-waveform.gif";
import FourierIcon from "../../assets/images/pages/fourier-graph-icon.png";
import PickingIcon from "../../assets/images/pages/picking-icon.svg";
import AsciiToMseedIcon from "../../assets/images/pages/ascii-to-mseed-icon.svg";
import SignalProcessingIcon from "../../assets/images/pages/signal-processing-icon.svg";

function ToolsHoverButtons({ onMouseEnter, icon, title }) {
  return (
    <div
      className="w-36 flex flex-col gap-3 items-center justify-center p-2 rounded-lg  hover:bg-base-300 bg-base-100"
      onMouseEnter={onMouseEnter}
    >
      <img src={icon} alt="button icon" />
      <p className="text-center font-semibold text-sm">{title}</p>
    </div>
  );
}

export default function ToolsGallery() {
  const [gifURLSelected, setGifURLSelected] = useState(FourierComputation.src);
  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="flex flex-row flex-wrap justify-center items-center gap-2 mb-8">
        <ToolsHoverButtons
          onMouseEnter={() => setGifURLSelected(FourierComputation.src)}
          icon={FourierIcon.src}
          title="Fourier"
        />
        <ToolsHoverButtons
          onMouseEnter={() => setGifURLSelected(ArrivalPick.src)}
          icon={PickingIcon.src}
          title="Arrival Picking"
        />
        <ToolsHoverButtons
          onMouseEnter={() => setGifURLSelected(TrimWaveform.src)}
          icon={AsciiToMseedIcon.src}
          title="ASCII to MSEED"
        />
        <ToolsHoverButtons
          onMouseEnter={() => setGifURLSelected(TaperWaveform.src)}
          icon={SignalProcessingIcon.src}
          title="Signal processing"
        />
      </div>
      <div className="mockup-window bg-base-300 border  z-10">
        <div className="bg-base-200 flex justify-center px-8 py-16  z-10">
          <img
            src={gifURLSelected}
            alt="a gif about seismological processing"
            className="block size-full mx-auto display-image  z-10"
          />
        </div>
      </div>
    </section>
  );
}
