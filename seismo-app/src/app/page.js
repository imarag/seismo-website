import Image from "next/image";
import Section from "@/components/Section";
import Title from "@/components/Title";
import SubTitle from "@/components/SubTitle";
import Card from "@/components/Card";
import Link from 'next/link';
import ToolsGallery from "@/components/ToolsGallery";
import { IoIosArrowRoundForward } from "react-icons/io";
import SiteEffectIcon from "@/images/template-images/resized/site-effect-icon.png"
import ArrivalPickIcon from "@/images/template-images/resized/arrival-pick-icon.png"
import ObspyIcon from "@/images/template-images/resized/obspy-icon.png"
import ObspyScriptExample from "@/images/obspy-script-example.gif";

export default function Home() {
    return (
        <div>
            <div className="bg-hero-seismogram bg-no-repeat bg-contain bg-top">
                <Section className="h-screen flex flex-row items-center justify-center">
                    <div>
                        <h1 className="text-4xl md:text-8xl font-semibold mb-8 text-center">
                            A JOURNEY INTO
                            <br />
                            <span className="text-green-500">SEISMOLOGY</span>
                        </h1>
                        <h2 className="text-lg md:text-3xl mx-auto text-center max-w-4xl">
                            Discover different seismic articles, interact with tools, and deepen
                            your understanding.
                        </h2>
                        <div className="text-center mt-14">
                            <Link href="/articles" className="btn bg-green-500 text-white text-lg py-2 px-6 rounded-lg hover:bg-green-600">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </Section>
                <Section className="mt-52">
                    <Title text1="Discover the" text2="seismic articles" />
                    <SubTitle
                        text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them."
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 justify-center gap-y-14 gap-x-8">
                        <Card
                            title="Introduction to Seismology"
                            description="Delve into the various seismological concepts about the creation of the earthquakes, the various seismic waves generated, the mechanisms that trigger the seismic faults and the effects of the seismic waves on the surface."
                            imgURL={ArrivalPickIcon}
                            imgAlt="seismological concepts about the creation of the earthquakes, the various seismic waves generated"
                            pageURL="/articles/introduction-to-seismology"
                        />
                        <Card
                            title="Seismic Site Effect"
                            description="Learn about the influence of the underground geology on the incoming ground motion. Discover the local conditions that cause the site effect and whether we can estimate it or not. Lastly, explore a research that took place to understand it."
                            imgURL={SiteEffectIcon}
                            imgAlt="influence of the underground geology on the incoming ground motion"
                            pageURL="/articles/site-effect"
                        />
                    </div>
                    <p className="text-center mt-14 flex flex-row justify-center items-center gap-2">
                        <Link href="/articles" className="link link-hover text-gray-800 hover:text-gray-600">
                            Learn about the seismic articles
                        </Link>
                        <IoIosArrowRoundForward />
                    </p>
                </Section>
            </div>
            <Section>
                <Image src={ObspyIcon} className="w-20 block mx-auto"  alt="Obspy Logo" />
                <Title text1="Learn about the" text2="Python Obspy" />
                <SubTitle
                    text="Process seismic data using the various Obspy functions, manipulate date and time, and plot earthquake recordings."
                />
                <div className="text-center mb-12">
                    <Link href="/articles/obspy" className="btn btn-primary">
                        Learn More
                    </Link>
                </div>
                <Image src={ObspyScriptExample} alt="python script example" className="block mx-auto mb-4" />
            </Section>
            <Section>
                <Title text1="Utilize the" text2="interactive tools" />
                <SubTitle
                    text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them."
                />
                <div className="text-center mt-8">
                    <Link href="/articles/obspy" className="btn btn-primary">
                        Learn More
                    </Link>
                </div>
                <ToolsGallery />
            </Section>
        </div>
    );
}

