import {capitalizeWords} from '@/utils/functions'
import { allTools } from '@/utils/all-topics';
import Image from 'next/image';
import Accordion from '@/components/Accordion';

export default async function ToolSlugPage({ params }) {
    const slug = (await params).slug
    const capitalizedSlug = capitalizeWords(slug);
    const { default: Tool } = await import(`@/components/tools/${capitalizedSlug}.js`)

    const selectedTool = allTools.find(tl => tl.slug === slug);
    return (
        <section className="container mx-auto">
            
            <Image src={selectedTool.icon} alt={selectedTool.iconAlt} className="block w-20 mx-auto" />
            <h1 className="text-center font-semibodl text-5xl mt-4 mb-3">
                <span>{selectedTool.title}</span>
            </h1>
            <h2 className="text-center font-light text-2xl mb-20">
                {selectedTool.subtitle}
            </h2>
            <p className="font-light text-start text-xl">{selectedTool.description}</p>
            <Accordion label="User guide">
                <p>{ selectedTool.userGuide }</p>
            </Accordion>
            <Tool />
        </section>
    )
}

// "title": "Fourier Spectra Calculator",
//     "description": "Easily calculate Fourier spectra for seismic signal and noise windows. Optionally compute Horizontal to Vertical Spectral Ratio (HVSR) and download your results in various formats.",
//     "icon": FourierIcon ,
//     "iconAlt": "Fourier Spectra Calculator Icon",
//     "type": "tool",
//     "slug": "fourier"