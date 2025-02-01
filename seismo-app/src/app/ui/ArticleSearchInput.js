'use client';

import { useSearchParams, usePathname, useRouter } from "next/navigation";

import { SearchInputElement } from "@/components/UIElements";

import { CiSearch } from "react-icons/ci";


export default function ArticleSearchInput() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();


    function handleSeachInputValue(pattern) {
        const params = new URLSearchParams(searchParams);
        if (pattern) {
            params.set("query", pattern);
        }
        else {
            params.delete("query");
        }
        router.replace(`${pathname}?${params.toString()}`)
    }
    
    return (
        <div className="w-full mb-20">
            <SearchInputElement 
                id="search"
                name="search"
                block={true}
                placeholder="Search"
                onChange={(e) => handleSeachInputValue(e.target.value)} 
                className="max-w-3xl mx-auto"
            />
        </div>
    )
}
