import Image from "next/image"

import { CardTitle, CardParagraph, CardLink, CardContainer } from "@/components/CardElements"
import AlignVertical from "@/components/AlignVertical";
import { Title, SubTitle } from "@/components/Typography"
import Section from "@/components/Section";
import Container from "@/components/Container";

import { allTools } from "@/utils/all-topics";

export default function Tools() {
    return (
        <Section>
            <Container>
                <AlignVertical>
                    <Title text="Seismic Tools" />
                    <SubTitle text="Discover the interactive tools built to facilitate seismological processing" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mt-20">
                        {
                            allTools.map(tool => (
                                <section key={tool.id} className="bg-base-200 hover:bg-base-300 rounded-lg p-12">
                                    <CardContainer>
                                        <Image src={tool.icon} alt={tool.iconAlt} className="w-32 block mx-auto" />
                                        <CardTitle text={tool.title} />
                                        <CardParagraph text={tool.smallDescription} />
                                        {
                                            tool.completed ? (
                                                <CardLink href={`/tools/${tool.slug}`} text="Go to page" />
                                            ) : (
                                                <span className="font-bold">Work in Progress</span>
                                            )
                                        }
                                    </CardContainer>
                                </section>
                            ))
                        }
                    </div>
                </AlignVertical>
            </Container>
        </Section>
    );
}
