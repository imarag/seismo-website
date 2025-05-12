import PageTitle from "@/components/utils/PageTitle";
import PageSubTitle from "@/components/utils/PageSubTitle";
import EyeBrowText from "@/components/utils/EyeBrowText";
import Section from "@/components/utils/Section";
import Container from "@/components/utils/Container"
import Img from "@/components/utils/Img"
import LinkTag from "@/components/ui/LinkTag";
import Badge from "@/components/utils/Badge"
import { CardTitle, CardParagraph } from "@/components/ui/CardElements"
import { IoIosArrowRoundForward } from "react-icons/io";
import { articles } from "@/utils/topics"

export default function ArticlesPage() {


    return (
        <Section>
            <Container className="space-y-4">
                <div className="text-center">
                    <EyeBrowText className="text-center" text="READ OUR SEISMIC ARTICLES" />
                </div>
                <PageTitle className="text-center" text="Articles on Earthquakes and Science" />
                <PageSubTitle className="text-center" text="Search through the available articles to delve into seismological concepts" />
                <div className="mt-24">
                    {
                        articles?.map(article => (
                            <div key={article.title} className="flex flex-row items-center gap-2 md:gap-8 flex-wrap md:flex-nowrap my-8">
                                <div className="shrink-0 grow-0">
                                    <Img src={article.image_src} alt={article.image_alt} className="w-20 md:w-28" />
                                </div>
                                <div className="flex-shrink flex-grow">
                                    <CardTitle text={article.title} />
                                    <div className="flex flex-row items-center gap-2 my-2">
                                        {
                                            article.keywords.map(keyword => (
                                                <Badge
                                                    key={keyword}
                                                    type="neutral"
                                                    outline={true}
                                                    size="extra-small"
                                                >
                                                    {keyword}
                                                </Badge>
                                            ))
                                        }
                                    </div>
                                    <CardParagraph text={article.description} center={false} />
                                    <div className="mt-2">
                                        {
                                            article.completed ? (
                                                <LinkTag href={`/articles/${article.slug}`}>
                                                    Go to page
                                                    <IoIosArrowRoundForward className="size-5 group-hover:translate-x-2 transition-all" />
                                                </LinkTag>
                                            ) : (
                                                <span className="font-bold">Work in Progress</span>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Container>
        </Section>
    )
}