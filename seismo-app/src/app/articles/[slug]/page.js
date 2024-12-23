export default async function Page({ params }) {
    const slug = params.slug
    const { default: Article } = await import(`@/markdowns/${slug}.mdx`)
   
    return <Article />
  }

