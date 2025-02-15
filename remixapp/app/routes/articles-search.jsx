import { Title, SubTitle } from "@/components/utils/Typography"
import { SearchInputElement } from "@/components/ui/UIElements"
import Section from "@/components/utils/Section";
import Container from "@/components/utils/Container"
import Image from "@/components/utils/Image"
import { LinkTag } from "@/components/ui/LinkComponents";
import { CardTitle, CardParagraph } from "@/components/ui/CardElements"
import { useState } from "react";
import { articles } from "@/utils/topics"

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
                    <SearchInputElement 
                        id="q"
                        name="q"
                        block={true}
                        placeholder="Search"
                        onChange={handleSearchInputChange}
                    />
                </div>
                <div>
                    {
                        filteredArticlesList?.map(article => (
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