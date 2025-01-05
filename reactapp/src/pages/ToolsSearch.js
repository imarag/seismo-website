import { useState } from "react";
import ToolPlaceholder from "../components/ToolPlaceholder"
import { allTools } from "../all-topics";
import Title from "../components/Title";
import Subtitle from "../components/Subtitle";

export default function ToolsSearch() {
    const [originalTopics, setOriginalTopics] = useState(allTools); 

    return (
      <section className="container-lg">
        <Title text1="Seismic Tools" />
        <Subtitle text="Explore various interactive tools built using Python ObsPy for seismic data processing" />
        <p>
          Discover the different tools built for seismological processing. These tools make use of the  
          <a href="https://docs.obspy.org/" target="_blank" className="underline decoration-solid decoration-blue-500 text-blue-500"> Python ObsPy framework</a> related to seismological data 
          processing. It offers functionality to interact with various seismological file formats such as MiniSEED, SAC, 
          and others, fetch seismic data from web services, apply various digital filters (low-pass, high-pass, band-pass) to seismic data, 
          visualize seismic waveforms etc.
        </p>
        <div className="row align-items-stretch justify-content-center g-4 mt-5">
            {
                originalTopics.map(tool => (
                    <div className="col-12 col-lg-6 rounded" key={tool.title}>
                        <ToolPlaceholder key={tool.title} tool={tool}/>
                    </div>
                ))
            }
        </div>
      </section>
    );
}
