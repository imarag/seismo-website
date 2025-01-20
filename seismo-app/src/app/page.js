import Image from "next/image";

import Section from "@/components/Section";
import Title from "@/components/Title";
import SubTitle from "@/components/SubTitle";
import Card from "@/components/Card";
import ToolsGallery from "@/components/ToolsGallery";
import CTAButton from "@/components/CTAButton";

import { IoIosArrowRoundForward } from "react-icons/io";

import SiteEffectIcon from "@/images/template-images/resized/site-effect-icon.png"
import ArrivalPickIcon from "@/images/template-images/resized/arrival-pick-icon.png"
import ObsPyIcon from "@/images/template-images/resized/obspy-icon.png"
import ObsPyScriptExample from "@/images/obspy-script-example.gif";
import SeismogramLargeCropped from "@/images/seismogram-large-cropped.svg";


export default function Home() {
    return (
        <>
            <div 
                style={{ backgroundImage: `url('${SeismogramLargeCropped.src}')` }} 
                className={`bg-no-repeat bg-contain bg-top`}
            >
                <div className="min-h-screen flex flex-row items-center justify-center">
                    <div>
                        <h1 className="text-center text-4xl md:text-8xl font-bold">
                            A JOURNEY INTO
                            <br />
                            <span className="text-secondary">SEISMOLOGY</span>
                        </h1>
                        <p className="text-center py-6 font-normal text-lg md:text-3xl">
                            Discover different seismic articles, interact with tools, and deepen
                            your understanding.
                        </p>
                        <CTAButton href="/articles" label="Get started" />
                    </div>
                </div>
                <Section className="mt-52">
                    <Title text="Discover the" styledText="seismic articles" />
                    <SubTitle
                        text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them."
                    />
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <Card
                            title="Introduction to Seismology"
                            description="Delve into the various seismological concepts about the creation of the earthquakes, the various seismic waves generated, the mechanisms that trigger the seismic faults and the effects of the seismic waves on the surface."
                            imgURL={ArrivalPickIcon}
                            imgAlt="seismological concepts about the creation of the earthquakes, the various seismic waves generated"
                            pageURL="/articles/introduction-to-seismology"
                            className="w-full md:w-1/2 xl:w-5/12"
                        />
                        <Card
                            title="Seismic Site Effect"
                            description="Learn about the influence of the underground geology on the incoming ground motion. Discover the local conditions that cause the site effect and whether we can estimate it or not. Lastly, explore a research that took place to understand it."
                            imgURL={SiteEffectIcon}
                            imgAlt="influence of the underground geology on the incoming ground motion"
                            pageURL="/articles/site-effect"
                            className="w-full md:w-1/2 xl:w-5/12"
                        />
                    </div>
                    <CTAButton href="/articles" label="Learn about the seismic articles" link={true} linkIcon={<IoIosArrowRoundForward/>} />
                </Section>
                <Section>
                    <Image src={ObsPyIcon} className="w-20 block mx-auto"  alt="ObsPy Logo" />
                    <Title text="Learn about the" styledText="Python ObsPy" />
                    <SubTitle
                        text="Process seismic data using the various ObsPy functions, manipulate date and time, and plot earthquake recordings."
                    />
                    <CTAButton href="/articles/obspy" label="Learn More" />
                    <Image src={ObsPyScriptExample} alt="python script example" className="block mx-auto max-w-3xl" unoptimized />
                </Section>
                <Section>
                    <Title text="Utilize the" styledText="interactive tools" />
                    <SubTitle
                        text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them."
                    />
                    <CTAButton href="/tools" label="Learn More" />
                    <ToolsGallery />
                </Section>
            </div>
        </>
    );
}

