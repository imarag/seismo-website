import HeroSection from "@/components/home/HeroSection"
import ArticleCardsSection from "@/components/home/ArticleCardsSection"
import ObspySection from "@/components/home/ObspySection"
import ToolsSection from "@/components/home/ToolsSection"
import Section from "@/components/utils/Section";
import Container from "@/components/utils/Container"
import AlignVertical from "@/components/utils/AlignVertical";

export const meta = () => {
  return [
    { title: "A journey into seismology" },
    { name: "description", content: "An introduction about the various seismic articles and the interactive tools, for seismology." },
  ];
};

export default function Index() {
    return (
        <>
            <HeroSection />
            <Section>
                <Container>
                    <AlignVertical>
                        <ArticleCardsSection />
                    </AlignVertical>
                </Container>
            </Section>
            <Section>
                <Container>
                    <AlignVertical>
                        <ObspySection />
                    </AlignVertical>
                </Container>
            </Section>
            <Section>
                <Container>
                    <AlignVertical>
                        <ToolsSection />
                    </AlignVertical>
                </Container>
            </Section>
        </>
    );
}

