import { Link } from "react-router-dom"

export default function ArticlePlaceholder({ article }) {
    return (
        <div key={article.title} className="bg-gray-50/50 hover:bg-gray-100/70 border w-full rounded p-10 font-light">
            <h1 className="text-start text-2xl font-semibold mb-4">{ article.title }</h1>
            <p className="text-start text-lg font-light">{ article.description }</p>
            <Link to="#" className="underline block mt-6">Go to page</Link>
        </div>
    )
}