import { Link } from "react-router-dom"

export default function ArticlePlaceholder({ article }) {
    return (
        <div key={article.title} className="p-10 font-light">
            <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-x-10">
                <div className="grow-0 shrink-0">
                    <img className="w-32 block my-4" src={article["image_name"]} />
                </div>
                <div className="grow">   
                    <h1 className="text-start text-2xl font-semibold mb-4">{ article.title }</h1>
                    <p className="text-start text-lg font-light">{ article.description }</p>
                    <Link to={`/articles/${article.template_name}`} className="underline block mt-6">Go to page</Link>
                </div>
            </div>
        </div>
    )
}
