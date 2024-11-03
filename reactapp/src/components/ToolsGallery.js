import FourierGraphIcon from "../img/fourier-graph-icon.png";
import AsciiToMseed from "../img/ascii-to-mseed-icon.png";
import PickingIcon from "../img/picking-icon.png";
import SignalProcessIcon from "../img/signal-process-icon.png";

import FourierGif from "../img/fourier-gif.gif";
import PickGif from "../img/pick-gif.gif";
import TrimGif from "../img/trim-gif.gif";
import TaperGif from "../img/taper-gif.gif";

import ToolsHoverButtons from "./ToolsHoverButtons";

import { DashIcon, WindowIcon, XMarkIcon } from "../SvgIcons";

export default function ToolsGallery() {
      
  return (
    <>
        <div className="flex flex-row flex-wrap justify-center gap-x-10 mt-12 mb-4">
            <ToolsHoverButtons gifURL={FourierGif} icon={FourierGraphIcon} title="Fourier" />
            <ToolsHoverButtons gifURL={PickGif} icon={PickingIcon} title="Arrival Picking" />
            <ToolsHoverButtons gifURL={TrimGif} icon={AsciiToMseed} title="ASCII to MSEED" />
            <ToolsHoverButtons gifURL={TaperGif} icon={SignalProcessIcon} title="Signal processing" />
        </div>
        <div className="bg-gray-200 flex flex-row justify-end gap-x-6 text-gray-500 py-4 px-8 rounded">
            <DashIcon />
            <WindowIcon />
            <XMarkIcon />
        </div>
        <div className="border-2">
            <img src={FourierGif} className="block mx-auto w-full display-image"/>
        </div>
    </>
  )
}
