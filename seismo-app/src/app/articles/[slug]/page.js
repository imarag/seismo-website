
export default async function ArticleSlugPage({ params }) {
    const slug = (await params).slug
    const { default: Article } = await import(`@/markdowns/${slug}.mdx`)
    return (
        <article className="container mx-auto">
            <Article />
        </article>
    )
}