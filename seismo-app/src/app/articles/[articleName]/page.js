import { allArticles } from "@/app/lib/all-topics"
export default function Article({ params }) {
    
    const filteredArticle = allArticles.filter(el => el.pathLabel === params.articleName)

    return (
        <div>
            {filteredArticle.title}
        </div>
    )
}