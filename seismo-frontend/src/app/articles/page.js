'use client';
import { Title, SubTitle } from "@/components/utils/Typography"
import { FormElement } from "@/components/ui/UIElements";
import Section from "@/components/utils/Section";
import Container from "@/components/utils/Container"
import Img from "@/components/utils/Img"
import LinkTag from "@/components/ui/LinkTag";
import Badge from "@/components/utils/Badge"
import { CardTitle, CardParagraph } from "@/components/ui/CardElements"
import { useState } from "react";
import { articles } from "@/utils/topics"
import { IoIosArrowRoundForward } from "react-icons/io";

export default function ArticlesPage() {

    const [articlesList, setArticlesList] = useState(articles);
    const [filteredArticlesList, setFilteredArticlesList] = useState(articles);

    function handleSearchInputChange(e) {
        const searchParam = e.target.value;
        if (searchParam) {
            const lowerSearchParam = searchParam.toLowerCase();
            const newArticles = articlesList.filter(article => {
                const articleTitle = article.title.toLowerCase();
                const articleDescription = article.description.toLowerCase();
                return articleTitle.includes(lowerSearchParam) || articleDescription.includes(lowerSearchParam);
            })
            setFilteredArticlesList(newArticles)
        }
        else {
            setFilteredArticlesList(articles)
        }
    }

    return (
        <Section>
            <Container>
                <Title text="Seismic Articles" />
                <SubTitle text="Search through the available articles to delve into seismological concepts" className="mt-4" />
                <div className="max-w-3xl mx-auto mb-24 mt-8">
                    <FormElement
                        type="search"
                        id="q"
                        name="q"
                        placeholder="Search"
                        onChange={handleSearchInputChange}
                        className="w-full"
                    />
                </div>
                <div>
                    {
                        filteredArticlesList.length !== 0 ? (
                            filteredArticlesList?.map(article => (
                                <div key={article.title} className="flex flex-row items-center gap-8 flex-wrap md:flex-nowrap my-8">
                                    <div className="shrink-0 grow-0">
                                        <Img src={article.image_src} alt={article.image_alt} className="w-20 md:w-28" />
                                    </div>
                                    <div className="flex-shrink flex-grow">
                                        <CardTitle text={article.title} center={false} />
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
                                                        <IoIosArrowRoundForward className="size-5" />
                                                    </LinkTag>
                                                ) : (
                                                    <span className="font-bold">Work in Progress</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No articles match your search criteria!</p>
                        )
                    }
                </div>
            </Container>
        </Section>
    )
}