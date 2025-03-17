import HeroTitle from "@/components/home/HeroTitle"
import HeroSubTitle from "@/components/home/HeroSubTitle"
import LinkTag from "@/components/ui/LinkTag";
import SeismogramLargeCropped from "@/images/seismogram-large-cropped-removebg.png";

export default function HeroSection() {
    return (
        <div className="min-h-screen flex flex-row items-center justify-center relative">
            <img src={SeismogramLargeCropped} className="absolute start-0 top-0 w-full opacity-50 dark:opacity-25 z-0" />
            <div className="flex flex-col items-center max-w-5xl mx-auto">
                <HeroTitle text="A JOURNEY INTO SEISMOLOGY"/>
                <HeroSubTitle
                    text="Discover various seismic articles, interact with tools, and deepen
                    your understanding" 
                    className="text-center py-6 font-normal text-lg md:text-3xl" />
                <LinkTag variant="button" href="/articles-search" size="large">Get started</LinkTag>
            </div>
        </div>
    )
}