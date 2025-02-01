import { Title, SubTitle } from "@/components/ui/Typography"
import { CardTitle, CardParagraph, CardLink, CardContainer } from "@/components/ui/CardElements"
import Section from "@/components/ui/Section";
import AlignVertical from "@/components/ui/AlignVertical"
import Container from "@/components/ui/Container"
import Image from "@/components/ui/Image"
import LinkTag from "@/components/ui/LinkTag";
import { tools } from "@/utils/topics"

export default function ArticlesPage() {
    return (
        <Section>
            <Container>
                <Title text="Seismic Tools" />
                <SubTitle text="Utilize the interactive tools for seismic processing" className="mb-24"/>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mt-20">
                    {
                        tools.map(tool => (
                            <section key={tool.id} className="bg-base-200 hover:bg-base-300 rounded-lg p-12">
                                <CardContainer>
                                    <Image src={tool.image_src} alt={tool.image_alt} className="w-32 block mx-auto" />
                                    <CardTitle text={tool.title} />
                                    <CardParagraph text={tool.smallDescription} />
                                    {
                                        tool.completed ? (
                                            <CardLink href={`/tool/${tool.slug}`} text="Go to page" />
                                        ) : (
                                            <span className="font-bold">Work in Progress</span>
                                        )
                                    }
                                </CardContainer>
                            </section>
                        ))
                    }
                </div>
            </Container>
        </Section>
    )
}