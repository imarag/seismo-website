import { Title, SubTitle } from "@/components/Typography"

import ListArticles from "@/components/ListArticles";
import ArticleSearchInput from "@/components/ArticleSearchInput";
import Section from "@/components/Section";
import AlignVertical from "@/components/AlignVertical"
import Container from "@/components/Container"

export default async function ArticlesPage({searchParams}) {
    const query = (await searchParams)?.query || '';
    return (
        <Section>
            <Container>
                <AlignVertical>
                    <Title text="Seismic Articles" />
                    <SubTitle text="Search through the available articles to delve into seismological concepts" />
                    <ArticleSearchInput />
                    <ListArticles query={query} />
                </AlignVertical>
            </Container>
        </Section>
    );
}
