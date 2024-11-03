import { Link } from "react-router-dom";

import IntroToSeismologyImage from "../img/template-images/resized/arrival-pick-icon.png";
import SiteEffectImage from "../img/template-images/resized/site-effect-icon.png";

import Title from "../components/Title";
import Subtitle from "../components/Subtitle";
import Card from "../components/Card"
import Section from "../components/Section"
import ToolsGallery from "../components/ToolsGallery"

import LearnMore from "../components/LearnMore";

export default function Home() {
  
  return (
    <div className="container mx-auto">
      <div className="bg-hero-seismogram bg-no-repeat bg-contain bg-top">
        <Section>
          <h1 className="text-6xl lg:text-8xl xl:text-9xl font-bold mb-12 text-center">
            A Journey Into
            <br />
            <span className="text-green-700">Seismology</span>
          </h1>
          <p className="text-2xl lg:text-4xl font-semibold text-center lg:w-8/12 mx-auto">
            Discover different seismic articles, interact with tools and deepen
            your understanding
          </p>
          
          <div className="text-center mt-20">
            <Link
              to=""
              className="bg-green-700 text-green-50 px-8 py-4 text-xl rounded"
            >
              Learn more
            </Link>
          </div>
        </Section>
        <Section className="mt-52">
          <Title text1="Discover the" text2="seismic articles" />
          <Subtitle
            text="Explore a range of seismic articles designed to deepen your
            understanding of the mechanisms behind earthquakes and the advanced
            technologies used to analyze them."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-20 gap-x-8 justify-center items-center my-20">
            <Card 
              title="Introduction to Seismology" 
              description="Introduce yourself to different seismological concepts about earthquakes" 
              imgURL={ IntroToSeismologyImage }
              imgWidth={"w-28"}
              imgHeight={"h-24"}
              pageURL="/articles/introduction-to-seismology"
            />
            <Card 
              title="Seismic Site Effect" 
              description="Influence of the underground Geology at the incoming ground motion" 
              imgURL={ SiteEffectImage }
              imgWidth={"w-28"}
              imgHeight={"h-24"}
              pageURL="/articles/site-effect"
            />
          </div>
          <LearnMore to="/articles-search" />
        </Section>
        <Section>
          <Title text1="Utilize the" text2="interactive tools" />
          <Subtitle 
            text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them" />
          <ToolsGallery />
          <LearnMore to="/tools-search" />
        </Section>
      </div>
    </div>
  );
}
