"use client";

import FourierGraphIcon from "@/images/fourier-graph-icon.png";
import AsciiToMseed from "@/images/ascii-to-mseed-icon.png";
import PickingIcon from "@/images/picking-icon.png";
import SignalProcessIcon from "@/images/signal-process-icon.png";

import FourierGif from "@/images/fourier-gif.gif";
import PickGif from "@/images/pick-gif.gif";
import TrimGif from "@/images/trim-gif.gif";
import TaperGif from "@/images/taper-gif.gif";
import Img from "@/components/utils/Img";
import { useState } from "react";

function ToolsHoverButtons({ onMouseEnter, icon, title }) {
  return (
    <div
      className="w-36 flex flex-col gap-3 items-center justify-center p-2 rounded-lg  hover:bg-base-300 bg-base-100"
      onMouseEnter={onMouseEnter}
    >
      <Img src={icon} alt="button icon" />
      <p className="text-center font-semibold text-sm">{title}</p>
    </div>
  );
}

export default function ToolsGallery() {
  const [gifURLSelected, setGifURLSelected] = useState(FourierGif);
  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="flex flex-row flex-wrap justify-center items-center gap-2 mb-8">
        <ToolsHoverButtons
          onMouseEnter={() => setGifURLSelected(FourierGif)}
          icon={FourierGraphIcon}
          title="Fourier"
        />
        <ToolsHoverButtons
          onMouseEnter={() => setGifURLSelected(PickGif)}
          icon={PickingIcon}
          title="Arrival Picking"
        />
        <ToolsHoverButtons
          onMouseEnter={() => setGifURLSelected(TrimGif)}
          icon={AsciiToMseed}
          title="ASCII to MSEED"
        />
        <ToolsHoverButtons
          onMouseEnter={() => setGifURLSelected(TaperGif)}
          icon={SignalProcessIcon}
          title="Signal processing"
        />
      </div>
      <div className="mockup-window bg-base-300 border  z-10">
        <div className="bg-base-200 flex justify-center px-8 py-16  z-10">
          <Img
            src={gifURLSelected}
            alt="a gif about seismological processing"
            className="block mx-auto max-w-3xl display-image  z-10"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
