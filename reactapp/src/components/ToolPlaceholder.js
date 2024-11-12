import { Link } from "react-router-dom"

export default function ToolPlaceholder({ tool }) {
    return (
        <div className="bg-light h-100 w-100 p-5 border">
            <div className="text-center">
            <img src={tool["image_name"]} className="img-fluid" style={{width: "10rem"}} />
            </div>
            <div>
                <h1 className="text-center fs-3 mt-5 mb-3">{ tool.title }</h1>
                <p className="text-center fw-light">{ tool.description }</p>
                <div className="text-center">
                <Link to={`/tools/${tool.template_name}`} className="link-dark">Go to page</Link>
                </div>
            </div>
        </div>
    )
}