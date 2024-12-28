'use client';
import { SearchInputElement } from "@/components/UIElements"
import { allArticles } from "@/utils/all-topics";
import { allTools } from "@/utils/all-topics";
import { useState } from "react";
import Link from "next/link";
import { IoIosLink } from "react-icons/io";

export default function NavSearchBar() {

    const [filteredTopics, setFilteredTopics] = useState([])

    function handleSearchBarChange(e) {
        const searchValue = e.target.value.toLowerCase();
        const allTopics = [...allArticles, ...allTools];

        searchValue ? (
            setFilteredTopics(
                allTopics.filter(el => (
                    el.description.toLowerCase().includes(searchValue) || el.title.toLowerCase().includes(searchValue)
                ))
            )
        ) : (
            setFilteredTopics([])
        )
    }

    return (
        <section>
            <SearchInputElement 
                placeholder="Search"
                className="input input-bordered input-md w-24 md:w-auto"
                onChange={handleSearchBarChange}
            />
            {filteredTopics.length !== 0 && (
                <div className="absolute bg-base-200 rounded-3xl p-10 shadow-2xl w-80 h-80 overflow-scroll">
                {
                    filteredTopics.map(tp => (
                        <div>
                            <div className={`badge badge-sm` + (tp.type === "tool" ? " badge-primary" : " badge-warning")}>seismic {tp.type === "tool" ? "tool" : "article"}</div>
                            <p className="font-normal text-md">
                                {tp.title}
                            </p>
                            <Link href="/" className="link link-primary flex flex-row items-center gap-2">
                                <IoIosLink />
                                <span>go to page</span>
                            </Link>
                            <hr className="my-2" />
                        </div>
                    ))
                }
            </div>
            )}
        </section>

    )
}


