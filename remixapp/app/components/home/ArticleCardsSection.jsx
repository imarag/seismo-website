import Section from "@/components/utils/Section";
import { CardTitle, CardParagraph, CardLink, CardContainer, CardImage } from "@/components/ui/CardElements"
import { LinkTag } from "@/components/ui/LinkComponents"
import Container from "@/components/utils/Container"
import AlignVertical from "@/components/utils/AlignVertical";
import { Title, SubTitle } from "@/components/utils/Typography"
import { IoIosArrowRoundForward } from "react-icons/io";
import SiteEffectIcon from "@/images/template-images/resized/site-effect-icon.png"
import ArrivalPickIcon from "@/images/template-images/resized/arrival-pick-icon.png"

export default function ArticlesCardsSection() {
    return (
        <Section className="mt-52">
            <Container>
                <AlignVertical>
                    <Title text="Discover the" styledText="seismic articles" />
                    <SubTitle
                        text="Explore a range of seismic articles designed to deepen your understanding of the mechanisms behind earthquakes and the advanced technologies used to analyze them."
                    />
                    <div className="flex flex-row items-center justify-center gap-8 flex-wrap md:flex-nowrap w-full">
                        <CardContainer>
                            <CardImage src={ArrivalPickIcon} alt="seismological concepts about the creation of the earthquakes, the various seismic waves generated" />
                            <CardTitle text="Introduction to Seismology" />
                            <CardParagraph text="Delve into the various seismological concepts about the creation of the earthquakes, the various seismic waves generated, the mechanisms that trigger the seismic faults and the effects of the seismic waves on the surface." />
                            <CardLink text="Go to page" href="/articles-search/introduction-to-seismology" />
                        </CardContainer>
                        <CardContainer>
                            <CardImage src={SiteEffectIcon} alt="influence of the underground geology on the incoming ground motion" />
                            <CardTitle text="Seismic Site Effect" />
                            <CardParagraph text="Learn about the influence of the underground geology on the incoming ground motion. Discover the local conditions that cause the site effect and whether we can estimate it or not. Lastly, explore a research that took place to understand it." />
                            <CardLink text="Go to page" href="/articles-search/site-effect" />
                        </CardContainer>
                    </div>
                    <LinkTag href="/articles-search">
                        Learn about the seismic articles
                        <IoIosArrowRoundForward />
                    </LinkTag>
                </AlignVertical>
            </Container>
        </Section>
    )
}