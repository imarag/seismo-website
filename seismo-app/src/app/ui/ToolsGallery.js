'use client';
import ToolsHoverButtons from "@/components/ToolsHoverButtons";
import FourierGraphIcon from "@/images/fourier-graph-icon.png";
import AsciiToMseed from "@/images/ascii-to-mseed-icon.png";
import PickingIcon from "@/images/picking-icon.png";
import SignalProcessIcon from "@/images/signal-process-icon.png";

import FourierGif from "@/images/fourier-gif.gif";
import PickGif from "@/images/pick-gif.gif";
import TrimGif from "@/images/trim-gif.gif";
import TaperGif from "@/images/taper-gif.gif";
import Image from "next/image";
import { useState } from "react";

export default function ToolsGallery() {
  const [gifURLSelected, setGifURLSelected] = useState(FourierGif)
  return (
    <>
        <div className="flex flex-row flex-wrap justify-center items-center gap-8 mt-14 mb-10">
          <ToolsHoverButtons onMouseEnter={() => setGifURLSelected(FourierGif)} icon={FourierGraphIcon} title="Fourier" />
          <ToolsHoverButtons onMouseEnter={() => setGifURLSelected(PickGif)} icon={PickingIcon} title="Arrival Picking" />
          <ToolsHoverButtons onMouseEnter={() => setGifURLSelected(TrimGif)} icon={AsciiToMseed} title="ASCII to MSEED" />
          <ToolsHoverButtons onMouseEnter={() => setGifURLSelected(TaperGif)} icon={SignalProcessIcon} title="Signal processing" />
        </div>
        <div className="mockup-window bg-base-300 border">
            <div className="bg-base-200 flex justify-center px-8 py-16">
              <Image src={gifURLSelected} alt="a gif about seismological processing" className="block mx-auto w-full display-image" unoptimized />
            </div>
        </div>
    </>
  )
}
