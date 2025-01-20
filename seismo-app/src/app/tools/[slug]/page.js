import Image from 'next/image';

import Collapse from '@/components/Collapse';

import {capitalizeWords} from '@/utils/functions'
import { allTools } from '@/utils/all-topics';
import { fastapiEndpoints } from '@/utils/static';

import Section from "@/components/Section"


export default async function ToolSlugPage({ params }) {
    const slug = (await params).slug
    const capitalizedSlug = capitalizeWords(slug);
    const { default: Tool } = await import(`@/components/tools/${capitalizedSlug}.js`)

    const selectedTool = allTools.find(tl => tl.slug === slug);
   
    return (
        <Section>
            <Image src={selectedTool.icon} alt={selectedTool.iconAlt} className="block w-20 mx-auto" />
            <h1 className="text-center font-semibodl text-5xl">
                <span>{selectedTool.title}</span>
            </h1>
            <h2 className="text-center font-light text-2xl mb-20">
                {selectedTool.subtitle}
            </h2>
            <p className="font-light text-start text-xl">{selectedTool.description}</p>
            <Collapse label="User guide">
                <p>{ selectedTool.userGuide }</p>
            </Collapse>
            <Tool />
        </Section>
    )
}