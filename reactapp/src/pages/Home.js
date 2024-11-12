import { Link } from "react-router-dom";
import "../styles/Home.css"
import IntroToSeismologyImage from "../img/template-images/resized/arrival-pick-icon.png";
import SiteEffectImage from "../img/template-images/resized/site-effect-icon.png";
import ObspyScriptExample from "../img/obspy-script-example.gif";

import Title from "../components/Title";
import Subtitle from "../components/Subtitle";
import Card from "../components/Card"
import Section from "../components/Section"
import ToolsGallery from "../components/ToolsGallery"

import { ArrowRightIcon } from "../SvgIcons";

export default function Home() {

    return (
        <div>
            <div className="bg-hero-seismogram bg-no-repeat bg-contain bg-top">
                <Section>
                    <h1 className="display-1 fw-bold mb-4 text-center">
                        A JOURNEY INTO
                        <br />
                        <span className="text-success">SEISMOLOGY</span>
                    </h1>
                    <p className="col-lg-10 mx-auto fs-2 text-center">
                        Discover different seismic articles, interact with tools and deepen
                        your understanding
                    </p>
                    <div className="text-center">
                        <Link to="/articles-search" className="btn btn-success btn-lg my-4">
                            Learn More
                        </Link>
                    </div>
                </Section>
                <Section className="mt-large">
                    <Title text1="Discover the" text2="seismic articles" />
                    <Subtitle
                        text="Explore a range of seismic articles designed to deepen your
            understanding of the mechanisms behind earthquakes and the advanced
            technologies used to analyze them."
                    />
                    <div className="row align-items-center justify-content-center gap-5 mt-5">
                        <div className="col-5">
                            <Card
                                title="Introduction to Seismology"
                                description="Delve into the various seismological concepts about the creation
                of the earthquakes, the various seismic waves generated, the mechanisms that 
                trigger the seismic faults and the effects of the sesmic waves on the surface"
                                imgURL={IntroToSeismologyImage}
                                imgWidth={"w-28"}
                                imgHeight={"h-24"}
                                pageURL="/articles/introduction-to-seismology"
                            />
                        </div>
                        <div className="col-5">
                            <Card
                                title="Seismic Site Effect"
                                description="Learn about the influence of the underground Geology at the 
                incoming ground motion. Discover the local conditions that cause the site effect and
                whether we can estimate it or not. Lastly, explore a research that took place in order
                to understand it"
                                imgURL={SiteEffectImage}
                                imgWidth={"w-28"}
                                imgHeight={"h-24"}
                                pageURL="/articles/site-effect"
                            />
                        </div>
                    </div>
                    <p className="text-center my-5 d-flex flex-row justify-content-center align-items-center gap-1">
                        <Link className="link-dark" to="/articles-search">Learn about the seismic articles</Link>
                        <ArrowRightIcon />
                    </p>
                </Section>
                <Section>
                    <Title text1="Learn about the" text2="Python Obspy" />
                    <Subtitle
                        text="Process seismic data using the various Obspy functions, manipulate date and time and plot earthquake recordings" />
                    <div className="text-center my-8">
                        <Link to="/articles/obspy" className="btn btn-success my-4">
                            Learn More
                        </Link>
                    </div>
                    <div className="row justify-content-center align-items-center">
                        <div className="col-lg-7">
                            <img src={ObspyScriptExample} className="img-fluid" />
                        </div>
                    </div>
                </Section>
                <Section>
                    <Title text1="Utilize the" text2="interactive tools" />
                    <Subtitle text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them" />
                    <div className="text-center my-8">
                        <Link to="/articles/obspy" className="btn btn-success my-4">
                            Learn More
                        </Link>
                    </div>
                    <ToolsGallery />
                </Section>
            </div>
        </div>
    );
}
