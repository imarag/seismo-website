import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"
import { allArticles, allTools } from "../all-topics.js"
import { Link } from "react-router-dom";

export default function TopicsSearch() {

    let [searchParams, setSearchParams] = useSearchParams();
    const [topics, setTopics] = useState(allArticles.concat(allTools))

    useEffect(
        () => {
            const allTopics = allArticles.concat(allTools);
            const filteredTopics = allTopics.filter(tp => {
                const searchString = searchParams.get("q").toLowerCase().trim();
                const description = tp.description.toLowerCase().trim();
                const title = tp.title.toLowerCase().trim();
                return description.includes(searchString) || title.includes(searchString)
            })
            setTopics(filteredTopics)
        }, 
        [searchParams]
    )
    return (
        <div className="container mx-auto">
            <p className="text-gray-600">Search results for: {searchParams.get("q")}</p>
            {topics.length === 0 && <p className="text-center my-14">There are no topics for this search parameter</p>}
            {topics.length !== 0 && (
                <div>
                    {
                        topics.map(tp => (
                            <div className="my-10" key={ tp.title }>
                                <h1 className="text-2xl font-semibold mb-2">
                                    { tp.title }
                                    <small 
                                        className={"text-xs rounded-full px-2 py-1 ms-3 " + (tp.type === "seismic-tools" ? "bg-blue-200" : "bg-gray-200")}
                                    >
                                        { tp.type }
                                    </small>
                                </h1>
                                <p className="font-light mb-3">{ tp.description }</p>
                                <Link 
                                    className="underline" 
                                    to={tp.type === "seismic-tools" ? `/tools/${tp.template_name}` : `/articles/${tp.template_name}`}
                                >
                                    Go to page
                                </Link>
                            </div>
                        ))
                    }
                </div>
            )}

        </div>
    )
}
