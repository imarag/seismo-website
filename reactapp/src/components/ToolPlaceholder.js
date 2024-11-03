import { Link } from "react-router-dom"

export default function ToolPlaceholder({ tool }) {
    return (
        <div key={tool.title} className="p-10 font-light bg-gray-50 border rounded">
            <img className="w-20 block my-4" src={tool["image_name"]} />
            <div>
                <h1 className="text-start text-2xl font-semibold mb-4">{ tool.title }</h1>
                <p className="text-start text-lg font-light">{ tool.description }</p>
                <Link to={`/tools/${tool.template_name}`} className="underline block mt-6">Go to page</Link>
            </div>
        </div>
    )
}