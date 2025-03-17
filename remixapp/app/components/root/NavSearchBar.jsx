import { useState } from "react";

import { FormElement } from "@/components/ui/UIElements";
import LinkTag from "@/components/ui/LinkTag";
import HRLine from "@/components/utils/HRLine";

import { articles } from "@/utils/topics";
import { tools } from "@/utils/topics";

import { IoIosLink } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

export default function NavSearchBar({ setShowNavbar }) {

    const [filteredTopics, setFilteredTopics] = useState([])

    function handleSearchBarChange(e) {
        const searchValue = e.target.value.toLowerCase();
        const topics = [...articles, ...tools];

        searchValue ? (
            setFilteredTopics(
                topics.filter(el => (
                    el.description.toLowerCase().includes(searchValue) || el.title.toLowerCase().includes(searchValue)
                ))
            )
        ) : (
            setFilteredTopics([])
        )
    }

    function handleLinkClick() {
        setShowNavbar(false);
        setFilteredTopics([]);
    }

    return (
        <section className="relative">
            <FormElement
                type="search" 
                placeholder="search a topic..."
                className="input-md w-36 md:w-auto"
                onChange={handleSearchBarChange}
            />
            {filteredTopics.length !== 0 && (
                <div className="bg-base-100 border border-neutral-500/50 rounded-lg px-8 pt-5 pb-14 shadow-2xl w-80 h-80 absolute start-1/2 -translate-x-1/2 top-full mt-3">
                    <button className="btn btn-sm btn-ghost absolute top-2 end-2" onClick={() => setFilteredTopics([])}>
                        <IoMdClose className="text-lg" />
                    </button>
                    <h1 className="font-semibold text-start text-lg">Search Results</h1>
                    <HRLine className="my-3" />
                    <div className="h-full overflow-scroll ">
                        {
                            filteredTopics.map(tp => (
                                <div key={tp.title}>
                                    <div className={`badge badge-xs` + (tp.type === "tool" ? " badge-primary" : " badge-primary")}>seismic {tp.type === "tool" ? "tool" : "article"}</div>
                                    <h1 className="font-semibold text-md ">
                                        {tp.title}
                                    </h1>
                                    <p className="font-light">
                                        {`/${tp.type === "article" ? "article" : "tool"}/${tp.slug}`}
                                    </p>                 
                                    <LinkTag 
                                        href={`/${tp.type === "article" ? "article" : "tool"}/${tp.slug}`} 
                                        onClick={handleLinkClick}
                                    >
                                        <IoIosLink />
                                        <span>go to page</span>
                                    </LinkTag>
                                    <HRLine />
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </section>

    )
}


