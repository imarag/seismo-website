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
            <Title text1="Explore the various articles" />
            <SubTitle text="Search through the available articles" />
            <ArticleSearchInput setSearchInputValue={setSearchInputValue} />
            <ListArticles articles={filteredArticle} />
        </section>
    );
}
