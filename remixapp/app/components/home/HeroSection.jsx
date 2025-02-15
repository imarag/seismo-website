import HeroTitle from "@/components/home/HeroTitle"
import HeroSubTitle from "@/components/home/HeroSubTitle"
import LinkTag from "@/components/ui/LinkTag";

export default function HeroSection() {
    return (
        <div className="min-h-screen flex flex-row items-center justify-center">
            <div className="flex flex-col items-center">
                <HeroTitle text="A JOURNEY INTO" styledText="SEISMOLOGY"/>
                <HeroSubTitle
                    text="Discover various seismic articles, interact with tools, and deepen
                    your understanding" 
                    className="text-center py-6 font-normal text-lg md:text-3xl" />
                <LinkTag variant="button" href="/articles-search" size="large">Get started</LinkTag>
            </div>
        </div>
    )
}