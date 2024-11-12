import { useEffect, useState } from "react";
import ArticlePlaceholder from "../components/ArticlePlaceholder"
import {allArticles} from "../all-topics";
import Title from "../components/Title"
import Subtitle from "../components/Subtitle"
import ArticleSearchInput from "../components/ArticleSearchInput";

export default function ArticlesSearch() {
    const [originalTopics, setOriginalTopics] = useState(allArticles); // State for original topics
    const [filteredTopics, setFilteredTopics] = useState(allArticles); // State for filtered topics

    function handleFillForm(e) {
        const searchValue = e.target.value.toLowerCase().trim(); // Convert to lower case for case-insensitive search
        const newFilteredTopics = originalTopics.filter(tp => (
            tp["description"].toLowerCase().includes(searchValue) || tp["title"].toLowerCase().trim().includes(searchValue)
        ));
        setFilteredTopics(newFilteredTopics); // Update filtered topics
    }

    return (
        <section className="container mx-auto">
            <Title text1="Seismic Articles" />
            <Subtitle text="Search through the various topics available, through the interactive menu" />
            <ArticleSearchInput handleFillForm={handleFillForm} />
            <section>
                {filteredTopics.length !== 0 && (
                    <p className="text-start mt-5">{ filteredTopics.length } articles found</p>
                )}
                {
                    filteredTopics.length !== 0 ? (
                        <div>
                            {
                                filteredTopics.map(article => (
                                    <section key={article.title} className="my-5">
                                        <ArticlePlaceholder  article={article}/>
                                    </section>
                                ))
                            }
                        </div>
                    ) : (
                        <p className="text-center">No topics found matching your search. Please try a different keyword.</p>                            
                    )
                }
                   
                </section>
        </section>
    );
}
