
import { allArticles } from "@/utils/all-topics"

export default async function Articles() {
    return (
        <section>
            {
                allArticles.map(element => (
                    <p>{element.title}</p>
                ))
            }
        </section>
    )
}