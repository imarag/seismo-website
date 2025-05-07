import PageTitle from "@/components/utils/PageTitle"
import PageSubTitle from "@/components/utils/PageSubTitle"
import EyeBrowText from "@/components/utils/EyeBrowText"
import LinkTag from "@/components/ui/LinkTag"
import { fastapiEndpoints } from "@/utils/static"
import { CardTitle, CardParagraph, CardLink, CardContainer } from "@/components/ui/CardElements"
import Section from "@/components/utils/Section";
import Container from "@/components/utils/Container"
import { tools } from "@/utils/topics"
import Img from "@/components/utils/Img";
import { FaFileWaveform } from "react-icons/fa6";

export default function ArticlesPage() {
    return (
        <Section>
            <Container className="space-y-4">
                <div className="text-center">
                    <EyeBrowText className="text-center" text="EXPLORE OUR TOOLS" />
                </div>
                <PageTitle className="text-center" text="Your Seismological Toolbox" />
                <PageSubTitle className="text-center" text="Contribute to our cause and help us make a positive impact with your donation. Your support makes all the difference." />
                <div className="my-16 max-w-3/4 lg:max-w-1/2 mx-auto text-center text-sm font-light">
                    <p>
                        Don&apos;t have a seismic data file ?
                        Click below to download a miniseed sample file, to experiment
                        with the tools.
                    </p>
                    <div className="flex gap-2 items-center justify-center mt-4">
                        <FaFileWaveform className="flex-shrink-0 size-4" />
                        <LinkTag href={fastapiEndpoints['DOWNLOAD-TEST-FILE']} external={true}>
                            Download Sample MSEED File
                        </LinkTag>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-center gap-8">
                    {
                        tools.map(tool => (
                            <section key={tool.id} className="border-2 border-transparent rounded-lg flex-grow-0 bg-base-200 hover:scale-110 transition-all">
                                <CardContainer>
                                    <Img src={tool.image_src} alt={tool.image_alt} className="w-32 block mx-auto" />
                                    <CardTitle className="text-center" text={tool.title} />
                                    <CardParagraph className="text-center" text={tool.smallDescription} />
                                    {
                                        tool.completed ? (
                                            <CardLink href={`/tools/${tool.slug}`} />
                                        ) : (
                                            <p className="font-bold text-center">Work in Progress</p>
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