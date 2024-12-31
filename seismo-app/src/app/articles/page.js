'use client';
import Title from "@/components/Title";
import { allArticles } from "@/utils/all-topics";
import SubTitle from "@/components/SubTitle";
import { useState } from "react";
import ListArticles from "@/components/ListArticles";
import ArticleSearchInput from "@/components/ArticleSearchInput";

export default function ToolsPage() {
    const [searchInputValue, setSearchInputValue] = useState("");
    const filteredArticle = allArticles.filter(art => (
        art.description.includes(searchInputValue.toLowerCase()) || art.title.includes(searchInputValue.toLowerCase()) 
    ))
    return (
        <section className="container mx-auto">
            <Title text1="Seismic Articles" />
            <SubTitle text="Search through the available articles to delve into seismological concepts" />
            <div className="max-w-3xl mx-auto">
                <ArticleSearchInput setSearchInputValue={setSearchInputValue} />
            </div>
            <p className="mt-20 mb-2">
                {filteredArticle.length !== 0 ? filteredArticle.length : "No"} articles found
            </p>
            <ListArticles articles={filteredArticle} />
        </section>
    );
}
