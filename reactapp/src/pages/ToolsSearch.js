import { useEffect, useState } from "react";
import ToolPlaceholder from "../components/ToolPlaceholder"
import {allTools} from "../all-topics";

export default function ToolsSearch() {
    const [originalTopics, setOriginalTopics] = useState(allTools); // State for original topics
    const [filteredTopics, setFilteredTopics] = useState(allTools); // State for filtered topics

    function handleFillForm(e) {
        const searchValue = e.target.value.toLowerCase().trim(); // Convert to lower case for case-insensitive search
        const newFilteredTopics = originalTopics.filter(tp => (
            tp["description"].toLowerCase().includes(searchValue) || tp["title"].toLowerCase().trim().includes(searchValue)
        ));
        setFilteredTopics(newFilteredTopics); // Update filtered topics
    }

    return (
      <section className="container mx-auto">
        <h1 className="text-6xl text-center mb-4 mt-8 font-semibold">Utilize The Seismic Tools</h1>
        <h2 className="text-3xl text-center mb-20 font-light">Explore various interactive tools built using Python Obspy for seismic data processing</h2>
        <p>
          Discover the different tools built for seismological processing. These tools make use of the  
          <a href="https://docs.obspy.org/" target="_blank" className="underline decoration-solid decoration-blue-500 text-blue-500"> Python Obspy framework</a> related to seismological data 
          processing. It offers functionality to interact with various seismological file formats such as MiniSEED, SAC, 
          and others, fetch seismic data from web services, apply various digital filters (low-pass, high-pass, band-pass) to seismic data, 
          visualize seismic waveforms etc.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch justify-center gap-8 my-8">
            {
                filteredTopics.length !== 0 ? (
                    filteredTopics.map(tool => (
                        <ToolPlaceholder key={tool.title} tool={tool}/>
                    ))
                ) : (
                    <p className="text-center text-xl text-gray-500">No topics found matching your search. Please try a different keyword.</p>                            
                )
            }
        </div>
      </section>
    );
}
