import { allArticles } from "@/utils/all-topics"


export default async function ArticleSlugPage({ params }) {
    const slug = (await params).slug
    const Article = allArticles.find(el => el.slug === slug)
    const ArticleMarkdown = Article.markdown
    return (
        <article className="container mx-auto">
            <ArticleMarkdown />
        </article>
    )
}