import Image from 'next/image';

import Collapse from '@/components/Collapse';
import { Title, SubTitle, Paragraph } from "@/components/Typography"
import AlignVertical from '@/components/AlignVertical';
import Container from "@/components/Container"
import Section from "@/components/Section"

import {capitalizeWords} from '@/utils/functions'
import { allTools } from '@/utils/all-topics';



export default async function ToolSlugPage({ params }) {
    const slug = (await params).slug
    const capitalizedSlug = capitalizeWords(slug);
    const { default: Tool } = await import(`@/components/tools/${capitalizedSlug}.js`)

    const selectedTool = allTools.find(tl => tl.slug === slug);
   
    return (
        <Section>
            <Container>
                {/* <Image src={selectedTool.icon} alt={selectedTool.iconAlt} className="block w-20 mx-auto" /> */}
                {/* <Title text={selectedTool.title} />
                <SubTitle text={selectedTool.subtitle} />
                <div className="max-w-5xl mx-auto">
                    <AlignVertical>
                        <Paragraph text={selectedTool.description} className="mt-20"/>
                        <Collapse label="User guide">
                            <p>{ selectedTool.userGuide }</p>
                        </Collapse>
                    </AlignVertical>
                </div> */}
                {/* <Tool /> */}
            </Container>
        </Section>
    )
}