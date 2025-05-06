import HeroSection from "@/components/home/HeroSection"
import ArticleCardsSection from "@/components/home/ArticleCardsSection"
import ObspySection from "@/components/home/ObspySection"
import ToolsSection from "@/components/home/ToolsSection"
import Section from "@/components/utils/Section";
import Container from "@/components/utils/Container"
import AlignVertical from "@/components/utils/AlignVertical";

export default function HomePage() {
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

