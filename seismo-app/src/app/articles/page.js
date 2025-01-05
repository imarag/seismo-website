import Title from "@/components/Title";
import SubTitle from "@/components/SubTitle";
import ListArticles from "@/components/ListArticles";
import ArticleSearchInput from "@/components/ArticleSearchInput";
import Section from "@/components/Section";

export default async function ArticlesPage({searchParams}) {
    const query = (await searchParams)?.query || '';
    return (
        <Section>
            <Title text="Seismic Articles" />
            <SubTitle text="Search through the available articles to delve into seismological concepts" />
            <ArticleSearchInput />
            <ListArticles query={query} />
        </Section>
    );
}
