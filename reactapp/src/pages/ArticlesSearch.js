import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticlePlaceholder from "../components/ArticlePlaceholder"

export default function Topics() {
    const [originalTopics, setOriginalTopics] = useState([]); // State for original topics
    const [filteredTopics, setFilteredTopics] = useState([]); // State for filtered topics

    useEffect(() => {
        async function getTopic() {
            const req = await fetch("/all-topics.json");
            const data = await req.json();

            setOriginalTopics(data["topics"]);
            setFilteredTopics(data["topics"]);
        }
        getTopic();
    }, []);

    function handleFillForm(e) {
        const searchValue = e.target.value.toLowerCase().trim(); // Convert to lower case for case-insensitive search
        const newFilteredTopics = originalTopics.filter(tp => (
            tp["description"].toLowerCase().includes(searchValue) || tp["title"].toLowerCase().trim().includes(searchValue)
        ));
        setFilteredTopics(newFilteredTopics); // Update filtered topics
    }

    return (
        <section className="container mx-auto">
            <h1 className="text-6xl text-center mb-4 mt-8 font-semibold">Explore The Topics</h1>
            <p className="text-2xl text-center mb-8 font-light">Search through the various topics available, through the interactive menu</p>
            <div className="w-3/4 mx-auto relative text-gray-400 mb-28">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6 absolute left-6 top-1/2 -translate-y-1/2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <form>
                    <input onChange={handleFillForm} type="text" className="border ps-16 border-gray-300 text-gray-500 rounded-sm h-10 w-full" />
                </form>
            </div>
            <section className="flex-grow">
                {filteredTopics.length !== 0 && (
                    <p className="text-start text-xl text-gray-500 my-6">{ filteredTopics.length } articles found</p>
                )}
                    <div className="flex flex-col justify-center gap-5">
                        {
                            filteredTopics.length !== 0 ? (
                                filteredTopics.map(article => (
                                    <ArticlePlaceholder key={article.title} article={article}/>
                                ))
                            ) : (
                                <p className="text-center text-xl text-gray-500">No topics found matching your search. Please try a different keyword.</p>                            
                            )
                        }
                   
                    </div>
                </section>
        </section>
    );
}
