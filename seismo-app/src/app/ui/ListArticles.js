import Image from "next/image"

import LinkTag from "@/components/LinkTag";
import { Paragraph } from "@/components/Typography"
import { CardTitle, CardParagraph, CardLink, CardContainer } from "@/components/CardElements"

import { allArticles } from "@/utils/all-topics"

export default function ListArticles({ query }) {
    const queryLowered = query.toLowerCase();
    const filteredArticles = allArticles.filter(art => (
        art.description.toLowerCase().includes(queryLowered) || art.title.toLowerCase().includes(queryLowered) 
    ))
    return (
        <div className="flex flex-col gap-8">
            <Paragraph>
                {`${filteredArticles.length !== 0 ? filteredArticles.length : "No"} articles found`}
            </Paragraph>
            {
                filteredArticles.map(article => (
                    <div key={article.title} className="flex flex-row gap-8 flex-wrap md:flex-nowrap">
                        <div className="shrink-0 grow-0">
                            <Image src={article.icon} alt={article.iconAlt} className="w-20 md:w-28" />
                        </div>
                        <div className="flex-shrink flex-grow">
                            <CardTitle text={article.title} center={false} />
                            <CardParagraph text={article.description} center={false} />
                            {
                                article.completed ? (
                                    <LinkTag href={`/articles/${article.slug}`}>Go to page</LinkTag>
                                ) : (
                                    <span className="font-bold">Work in Progress</span>
                                )
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}