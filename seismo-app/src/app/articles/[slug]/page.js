import Image from "next/image"

import Section from "@/components/Section"
import Title from "@/components/Title"

import { allArticles } from "@/utils/all-topics"


export default async function ArticleSlugPage({ params }) {
    const slug = (await params).slug
    const selectedArticle = allArticles.find(el => el.slug === slug)
    const ArticleMarkdown = selectedArticle.markdown
    return (
        <Section>
            <div className="flex flex-col xl:flex-row items-center justify-center gap-3">
                <Image src={selectedArticle.icon} alt={selectedArticle.iconAlt} className="w-20" />
                <Title text={selectedArticle.title} />
            </div>
            <ArticleMarkdown />
        </Section>
    )
}