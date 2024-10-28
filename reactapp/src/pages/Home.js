import { Link } from "react-router-dom";

import IntroToSeismologyImage from "../img/tectonic-plates-earthquakes.gif"
import SiteEffectImage from "../img/site-effect.png"
import FourierGraphIcon from "../img/fourier-graph-icon.png"
import AsciiToMseed from "../img/ascii-to-mseed-icon.png"
import PickingIcon from "../img/picking-icon.png"
import SignalProcessIcon from "../img/signal-process-icon.png"

import FourierGif from "../img/fourier-gif.gif"
import PickGif from "../img/pick-gif.gif"
import TrimGif from "../img/trim-gif.gif"
import TaperGif from "../img/taper-gif.gif"

function Title({ text1, text2 }) {
  return (
    <h1 className="text-8xl font-semibold mb-8 text-center">
      { text1 }
      <br />
      <span className="text-green-700">
        { text2 }
      </span>
    </h1>
  )
}

function Subtitle({ text }) {
  return (
    <p className="text-3xl font-light text-center lg:w-4/5 mx-auto">{ text }</p>
  )
}
export default function Home() {

  function handleMouseEnter(file) {
    let displayImage = document.querySelector(".display-image");
    displayImage.src = file
  }
  return (
    <>
      <div className="bg-hero-seismogram bg-no-repeat bg-contain bg-top">
        <section className="mb-12 pt-28">
          <h1 className="text-9xl font-bold mb-12 text-center">
            A Journey Into
            <br />
            <span className="text-green-700">Seismology</span>
          </h1>
          <p className="text-4xl font-semibold text-center lg:w-8/12 mx-auto">
            Discover different seismic articles, interact with tools and deepen
            your understanding
          </p>
          <div className="text-center mt-20">
            <button className="bg-green-700 text-green-50 px-8 py-4 text-xl rounded">
              Learn more
            </button>
          </div>
        </section>
        <section className="container mx-auto  mt-96 pt-96">
          <Title text1="Discover the" text2="seismic articles" />
          <Subtitle text="Explore a range of seismic articles designed to deepen your
            understanding of the mechanisms behind earthquakes and the advanced
            technologies used to simulate them." />
          <div className="flex flex-row justify-center items-center gap-x-10 mt-10">
            <div className="w-1/3">
              <img className="w-44 h-24 block mx-auto" src={IntroToSeismologyImage} />
              <h1 className="text-center font-semibold mb-3 text-xl mt-5">Introduction to Seismology</h1>
              <p className="font-light">
                Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to simulate them.
              </p>
              <div className="text-center mt-10">
                <button className="bg-green-700 text-green-50 px-4 py-2 text-lg rounded">
                  Go to page
                </button>
              </div>
            </div>
            <div className="w-1/3">
              <img className="w-44 h-20 block mx-auto" src={SiteEffectImage} />
              <h1 className="text-center font-semibold mb-3 text-xl mt-5">Seismic Site Effect</h1>
              <p className="font-light">
                Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to simulate them.
              </p>
              <div className="text-center mt-10">
                <Link to="/" className="bg-green-700 text-green-50 px-4 py-2 text-lg rounded">
                  Go to page
                </Link>
              </div>
            </div>
          </div>
          
          <Link to="topics?type=seismic-articles" className="flex flex-row items-center justify-center font-semibold gap-x-4 my-14">
            Learn more about Seismic Articles
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </section>
        <section className="container mx-auto">
          <Title text1="Utilize the" text2="interactive tools" />
          <Subtitle text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to simulate them."/>
          <div className="flex flex-row justify-center gap-x-10 mt-12 mb-4">
            <div className="flex flex-col items-center justify-center" onMouseEnter={() => handleMouseEnter(FourierGif)}>
              <button className="rounded hover:bg-gray-100 p-4">
                <img src={FourierGraphIcon} />
              </button>
              <p className="text-center">Fourier</p>
            </div>
            <div className="flex flex-col items-center justify-center" onMouseEnter={() => handleMouseEnter(PickGif)}>
              <button className="rounded hover:bg-gray-100 p-4">
                <img src={AsciiToMseed} />
              </button>
              <p className="text-center">Arrival Picking</p>
            </div>
            <div className="flex flex-col items-center justify-center" onMouseEnter={() => handleMouseEnter(TaperGif)}>
              <button className="rounded hover:bg-gray-100 p-4">
                <img src={PickingIcon} />
              </button>
              <p className="text-center">ASCII to MSEED</p>
            </div>
            <div className="flex flex-col items-center justify-center" onMouseEnter={() => handleMouseEnter(TrimGif)}>
            <button className="rounded hover:bg-gray-100 p-4">
              <img src={SignalProcessIcon} />
            </button>
              <p className="text-center">Signal processing</p>
            </div>
          </div>
          <div>
            <div className="bg-gray-200 flex flex-row justify-end gap-x-6 text-gray-500 py-4 px-8 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="h-autoborder-4">
             <img src={FourierGif} className="block mx-auto w-full display-image" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
