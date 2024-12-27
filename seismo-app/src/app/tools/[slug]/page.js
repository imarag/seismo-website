import {capitalizeWords} from '@/utils/functions'

export default async function ToolSlugPage({ params }) {
    const slug = (await params).slug
    const capitalizedSlug = capitalizeWords(slug);
    const { default: Tool } = await import(`@/components/tools/${capitalizedSlug}.js`)
    return (
        <article className="container mx-auto">
            <Tool />
        </article>
    )
}