import Img from '@/components/utils/Img'
import { Title } from "@/components/utils/Typography"
import Section from "@/components/utils/Section"
import Container from "@/components/utils/Container"
import { articles } from "@/utils/topics"


export default async function ArticleSlugPage({ params }) {
    const { slug } = await params
    const selectedArticle = articles.find(el => el.slug === slug)
    const ArticleMarkdown = selectedArticle.markdown
    return (
        <Section>
            <Container>
                <div className="flex flex-col xl:flex-row items-center justify-center gap-3">
                    <Img src={selectedArticle.image_src} alt={selectedArticle.image_alt} className="w-20" />
                    <Title text={selectedArticle.title} />
                </div>
                <ArticleMarkdown />
            </Container>
        </Section>
    )
}