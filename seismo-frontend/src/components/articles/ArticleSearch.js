import { FormElement } from "../ui/UIElements"
import { useState } from "react";
import { articles } from "@/utils/topics"

export default function ArticleSearch() {

    const [articlesList, setArticlesList] = useState(articles);
    const [filteredArticlesList, setFilteredArticlesList] = useState(articles);

    function handleSearchInputChange(e) {
        const searchParam = e.target.value;
        if (searchParam) {
            const lowerSearchParam = searchParam.toLowerCase();
            const newArticles = articlesList.filter(article => {
                const articleTitle = article.title.toLowerCase();
                const articleDescription = article.description.toLowerCase();
                return articleTitle.includes(lowerSearchParam) || articleDescription.includes(lowerSearchParam);
            })
            setFilteredArticlesList(newArticles)
        }
        else {
            setFilteredArticlesList(articles)
        }
    }


    return (
        <FormElement
            type="search"
            id="q"
            name="q"
            placeholder="Search"
            onChange={handleSearchInputChange}
            className="w-full"
        />
    )
}