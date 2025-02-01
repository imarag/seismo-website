import Image from "@/components/ui/Image"

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container"
import { HeroTitle, Title, SubTitle, HeroSubTitle } from "@/components/ui/Typography"
import AlignVertical from "@/components/ui/AlignVertical";
import { CardTitle, CardParagraph, CardLink, CardContainer, CardImage } from "@/components/ui/CardElements"
import ToolsGallery from "@/components/ui/ToolsGallery";
import LinkTag from "@/components/ui/LinkTag";
import { IoIosArrowRoundForward } from "react-icons/io";

import SiteEffectIcon from "@/images/template-images/resized/site-effect-icon.png"
import ArrivalPickIcon from "@/images/template-images/resized/arrival-pick-icon.png"
import ObsPyIcon from "@/images/template-images/resized/obspy-icon.png"
import ObsPyScriptExample from "@/images/obspy-script-example.gif";
import SeismogramLargeCropped from "@/images/seismogram-large-cropped.svg";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
    return (
        <>
            <div 
                style={{ backgroundImage: `url('${SeismogramLargeCropped}')` }} 
                className={`bg-no-repeat bg-contain bg-top`}
            >
                <div className="min-h-screen flex flex-row items-center justify-center">
                    <div className="flex flex-col items-center">
                        <HeroTitle text="A JOURNEY INTO" styledText="SEISMOLOGY"/>
                        <HeroSubTitle
                            text="Discover different seismic articles, interact with tools, and deepen
                            your understanding." 
                            className="text-center py-6 font-normal text-lg md:text-3xl" />
                        <LinkTag variance="primary" href="/articles-search" button={true} large={true}>Get started</LinkTag>
                    </div>
                </div>
                <Section className="mt-52">
                    <Container>
                        <AlignVertical>
                            <Title text="Discover the" styledText="seismic articles" />
                            <SubTitle
                                text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them."
                            />
                            <div className="flex flex-row items-center justify-center gap-8 flex-wrap md:flex-nowrap w-full">
                                <CardContainer>
                                    <CardImage src={ArrivalPickIcon} alt="seismological concepts about the creation of the earthquakes, the various seismic waves generated" />
                                    <CardTitle text="Introduction to Seismology" />
                                    <CardParagraph text="Delve into the various seismological concepts about the creation of the earthquakes, the various seismic waves generated, the mechanisms that trigger the seismic faults and the effects of the seismic waves on the surface." />
                                    <CardLink text="Go to page" href="/articles-search/introduction-to-seismology" />
                                </CardContainer>
                                <CardContainer>
                                    <CardImage src={SiteEffectIcon} alt="influence of the underground geology on the incoming ground motion" />
                                    <CardTitle text="Seismic Site Effect" />
                                    <CardParagraph text="Learn about the influence of the underground geology on the incoming ground motion. Discover the local conditions that cause the site effect and whether we can estimate it or not. Lastly, explore a research that took place to understand it." />
                                    <CardLink text="Go to page" href="/articles-search/site-effect" />
                                </CardContainer>
                            </div>
                            <LinkTag href="/articles-search">
                                Learn about the seismic articles
                                <IoIosArrowRoundForward />
                            </LinkTag>
                        </AlignVertical>
                    </Container>
                </Section>
                <Section>
                    <Container>
                        <AlignVertical>
                            <Image src={ObsPyIcon} className="w-20 block mx-auto"  alt="ObsPy Logo" />
                            <Title text="Learn about the" styledText="Python ObsPy" />
                            <SubTitle
                                text="Process seismic data using the various ObsPy functions, manipulate date and time, and plot earthquake recordings."
                            />
                            <LinkTag variance="primary"  href="/articles-search/obspy" button={true}>
                                Learn More
                            </LinkTag>
                            <Image src={ObsPyScriptExample} alt="python script example" className="block mx-auto max-w-3xl" unoptimized />
                        </AlignVertical>
                    </Container>
                </Section>
                <Section>
                    <Container>
                        <AlignVertical>
                            <Title text="Utilize the" styledText="interactive tools" />
                            <SubTitle
                                text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them."
                            />
                            <LinkTag variance="primary"  href="/tools-search" button={true}>
                                Learn More
                            </LinkTag>
                            <ToolsGallery />
                        </AlignVertical>
                    </Container>
                </Section>
            </div>
        </>
    );
}

