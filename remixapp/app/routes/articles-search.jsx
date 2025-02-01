import { Title, SubTitle } from "@/components/ui/Typography"
import { SearchInputElement } from "@/components/ui/UIElements"
import Section from "@/components/ui/Section";
import AlignVertical from "@/components/ui/AlignVertical"
import Container from "@/components/ui/Container"
import Image from "@/components/ui/Image"
import LinkTag from "@/components/ui/LinkTag";
import { CardTitle, CardParagraph } from "@/components/ui/CardElements"
import { articles } from "@/utils/topics"

export default function ArticlesPage() {
    return (
        <Section>
            <Container>
                <Title text="Seismic Articles" />
                <SubTitle text="Search through the available articles to delve into seismological concepts" className="mt-4" />
                <div className="max-w-3xl mx-auto mb-24 mt-8">
                    <SearchInputElement 
                        id="search"
                        name="search"
                        block={true}
                        placeholder="Search"
                    />
                </div>
                <div>
                    {
                        articles.map(article => (
                            <div key={article.title} className="flex flex-row gap-8 flex-wrap md:flex-nowrap my-8">
                                <div className="shrink-0 grow-0">
                                    <Image src={article.image_src} alt={article.image_alt} className="w-20 md:w-28" />
                                </div>
                                <div className="flex-shrink flex-grow">
                                    <CardTitle text={article.title} center={false} />
                                    <CardParagraph text={article.description} center={false} />
                                    {
                                        article.completed ? (
                                            <LinkTag href={`/article/${article.slug}`}>Go to page</LinkTag>
                                        ) : (
                                            <span className="font-bold">Work in Progress</span>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Container>
        </Section>
    )
}