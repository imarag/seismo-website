'use client';
import { CiSearch } from "react-icons/ci";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { allArticles } from "@/utils/all-topics";

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
        <div className="my-10 max-w-3xl mx-auto">
            <label className="input input-bordered flex items-center gap-2">
                <input 
                    onChange={(e) => handleSeachInputValue(e.target.value)} 
                    defaultValue={searchParams.get("query")?.toString()}
                    type="text" 
                    className="grow" 
                    placeholder="Search" 
                />
                <CiSearch />
            </label>
        </div>
    )
}
