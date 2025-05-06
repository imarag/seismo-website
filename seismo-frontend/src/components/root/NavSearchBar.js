'use client';
import { useState, useEffect } from "react";
import Link from "next/link";

import { FormElement } from "@/components/ui/UIElements";
import { MdArticle } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { articles } from "@/utils/topics";
import { tools } from "@/utils/topics";
import { FaArrowRight } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

export default function NavSearchBar({ setShowNavbar }) {

    const [filteredTopics, setFilteredTopics] = useState([]);
    const [showSearchMenu, setShowSearchMenu] = useState(false)

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setShowSearchMenu(false);
            }
        };
        document.addEventListener('keydown', handleEsc, true);
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    useEffect(() => {
        if (showSearchMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showSearchMenu]);

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

    function handleShowSearchMenu() {
        setShowSearchMenu(!showSearchMenu)
        setFilteredTopics([])
    }

    function handleLinkClick() {
        setShowSearchMenu(false);
    }

    return (
        <section>
            <button onClick={handleShowSearchMenu} data-bs-toggle="modal" data-bs-target="#seismic-topics-modal">
                <FormElement
                    type="search"
                    placeholder="search a topic..."
                    className="input-md w-full"
                    onChange={handleSearchBarChange}
                    readOnly={true}
                />
            </button>
            {showSearchMenu && (
                <>
                    <div className="fixed inset-0 bg-black/80 z-40"></div>
                    <div id="seismic-topics-modal" tabIndex="-1" aria-labelledby="seismic-topics-modal" className="flex flex-col gap-4 text-base-content bg-base-300 border border-neutral-500/50 rounded-lg p-12 shadow-2xl h-96 fixed start-2 end-2 md:start-1/6 md:end-1/6 lg:start-1/4 lg:end-1/4 top-20 z-50">
                        <div className="shrink-0 grow-0">
                            <FormElement
                                type="search"
                                placeholder="search a topic..."
                                className="input-md w-full"
                                onChange={handleSearchBarChange}
                            />
                        </div>
                        <button className="btn btn-sm btn-ghost absolute top-2 end-2" onClick={() => setShowSearchMenu(false)}>
                            <IoMdClose className="text-lg" />
                        </button>
                        <div className="grow overflow-scroll">
                            {
                                filteredTopics.length === 0 ? (
                                    <p className="text-center mt-8 italic">No topics found...</p>
                                ) : (
                                    <>
                                        <ul>
                                            {
                                                filteredTopics.map(tp => (
                                                    <li key={tp.title} className="bg-base-200 hover:bg-base-100 p-4 my-2 rounded-md">
                                                        <Link onClick={handleLinkClick} href={`/${tp.type === "article" ? "articles" : "tools"}/${tp.slug}`} className="flex items-center gap-2 size-full">
                                                            {
                                                                tp.type === "tool" ? (
                                                                    <FaGear className="size-6 text-primary/60" />
                                                                ) : (
                                                                    <MdArticle className="size-6 text-primary/60" />
                                                                )
                                                            }
                                                            <h1 className="font-light text-sm ">
                                                                {tp.title}
                                                            </h1>
                                                            <p className="ms-auto">
                                                                <FaArrowRight className="size-6 text-primary/60" />
                                                            </p>
                                                        </Link>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </>
            )}
        </section>

    )
}


