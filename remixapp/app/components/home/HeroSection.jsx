import HeroTitle from "@/components/home/HeroTitle"
import HeroSubTitle from "@/components/home/HeroSubTitle"
import { ButtonLinkTag } from "@/components/ui/LinkComponents";

export default function HeroSection() {
    return (
        <div className="min-h-screen flex flex-row items-center justify-center">
            <div className="flex flex-col items-center">
                <HeroTitle text="A JOURNEY INTO" styledText="SEISMOLOGY"/>
                <HeroSubTitle
                    text="Discover various seismic articles, interact with tools, and deepen
                    your understanding" 
                    className="text-center py-6 font-normal text-lg md:text-3xl" />
                <ButtonLinkTag href="/articles-search" size="large">Get started</ButtonLinkTag>
            </div>
        </div>
    )
}