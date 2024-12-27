import Link from "next/link"
import Image from "next/image"

export default function ListArticles({ articles }) {
    return (
        <div className="my-24">
                {
                    articles.map(article => (
                        <section key={article.id} className="my-12 flex flex-wrap sm:flex-nowrap items-center gap-6">
                            <div className="flex-shrink-0 flex-grow-0">
                                <Image src={article.icon} alt={article.iconAlt} className="w-28" />
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