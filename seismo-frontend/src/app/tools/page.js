import { Title, SubTitle } from "@/components/utils/Typography"
import LinkTag from "@/components/ui/LinkTag"
import { fastapiEndpoints } from "@/utils/static"
import { CardTitle, CardParagraph, CardLink, CardContainer } from "@/components/ui/CardElements"
import Section from "@/components/utils/Section";
import Container from "@/components/utils/Container"
import { tools } from "@/utils/topics"
import Img from "@/components/utils/Img";

export default function ArticlesPage() {
    return (
        <Section>
            <Container>
                <Title text="Seismic Tools" />
                <SubTitle text="Utilize the interactive tools for seismic processing" className="mt-4 mb-24" />
                <p className="text-center text-md font-light mt-4 mb-8">
                    Don't have a seismic data file ?
                    Click <LinkTag href={fastapiEndpoints['DOWNLOAD-TEST-FILE']} external={true}>here</LinkTag> to download a miniseed sample file, to experiment
                    with the tools.
                </p>
                <div className="flex flex-row flex-wrap justify-center mt-20 gap-8">
                    {
                        tools.map(tool => (
                            <section key={tool.id} className="w-96 border-2 border-transparent rounded-lg flex-grow-0 bg-base-200 hover:scale-110 transition-all">
                                <CardContainer>
                                    <Img src={tool.image_src} alt={tool.image_alt} className="w-32 block mx-auto" />
                                    <CardTitle text={tool.title} />
                                    <CardParagraph text={tool.smallDescription} />
                                    {
                                        tool.completed ? (
                                            <LinkTag href={`/tools/${tool.slug}`} variant="button">Go to page</LinkTag>
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