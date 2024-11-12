import { Link } from "react-router-dom"

export default function ArticlePlaceholder({ article }) {
    return (
        <div key={article.title} className="p-2">
            <div className="row justify-content-center align-items-center gy-4">
                <div className="col-4 col-md-3 col-xl-2">
                    <img className="img-fluid" src={article["image_name"]} />
                </div>
                <div className="col-12 col-md-9 col-lg-8">
                    <h1 className="text-center text-md-start fs-3 fw-semibold">{ article.title }</h1>
                    <p className="text-center text-md-start fw-light">{ article.description }</p>
                    <Link to={`/articles/${article.template_name}`} className="text-start link-dark">Go to page</Link>
                </div>
            </div>
        </div>
    )
}
