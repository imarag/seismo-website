import Link from "next/link"
import Image from "next/image"

export default function ArticlePlaceholder({ article }) {
    return (
        <section className="my-5 flex flex-row gap-6 items-center justify-center bg-base-200 p-6 rounded-lg">
            <Image src={article.iconPath} width={160} height={160} className="block w-40" alt="sf" />
            <div className="grow-1">
                <h1 className="text-start text-xl font-semibold mb-2">{ article.title }</h1>
                <p className="text-start text-lg font-light">{ article.description }</p>
                <Link href={`/articles/${article.markdownFileName}`} className="link link-primary">
                    Go to page
                </Link>
            </div>
        </section>
    )
}
