import { useState } from "react"
import { Link } from "react-router-dom"
import { allArticles, allTools } from "../all-topics.js"

export default function NavSearchInput() {

    const [searchText, setSearchText] = useState("")

  return (
    <div className="w-72 relative text-gray-400">
        <form method="get" action="topics-search">
            <input 
                type="text" 
                name="q"
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
                className="ps-4 pr-20 rounded-lg bg-gray-100 h-10 w-full" 
                required
            />
            <button type="button" onClick={(e) => setSearchText("")} className="rounded p-1 hover:bg-gray-200 absolute right-12 top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <button type="submit" className="rounded p-1 hover:bg-gray-200 absolute right-4 top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
        </form>
    </div>
  )
}
