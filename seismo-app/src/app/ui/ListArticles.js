import Link from "next/link"
import Image from "next/image"

export default function ListArticles({ articles }) {
    return (
        <div>
            {
                articles.map(article => (
                    <section key={article.id} className="my-12 flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="shrink-0 grow-0">
                            <Image src={article.icon} alt={article.iconAlt} className="w-20 md:w-28" />
                        </div>
                        <div className="flex-shrink flex-grow">
                            <h1 className="font-semibold text-start mb-2">{article.title}</h1>
                            <p className="font-light text-start">{article.description}</p>
                            <p className="mt-2">
                                <Link href={`/articles/${article.slug}`} className="link link-primary btn-primary">Go to page</Link>
                            </p>
                        </div>
                    </section>
                ))
            }
        </div>
    )
}