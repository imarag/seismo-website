import HeroTitle from "@/components/home/HeroTitle"
import HeroSubTitle from "@/components/home/HeroSubTitle"
import LinkTag from "@/components/ui/LinkTag";
import Img from "../utils/Img";
import SeismogramLargeCropped from "@/images/main-bg-wave.svg";

export default function HeroSection() {
    return (
        <div className="min-h-screen flex flex-row items-center justify-center relative">
            <Img alt="seismic wave" src={SeismogramLargeCropped} className="absolute start-0 top-0 w-full opacity-20 -z-10" />
            <div className="spacing-y-4 max-w-5xl mx-auto">
                <HeroTitle text="A JOURNEY INTO SEISMOLOGY" />
                <HeroSubTitle
                    text="Discover various seismic articles, interact with tools, and deepen
                    your understanding"
                    className="text-center py-6 font-normal text-lg md:text-3xl" />
                <div className="text-center mt-8">
                    <LinkTag variant="button" href="/articles" size="large">Get started</LinkTag>
                </div>
            </div>
        </div>
    )
}