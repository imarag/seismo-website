import { useState } from "react"
import { CiSearch } from "react-icons/ci";

export default function NavSearchInput() {

    const [searchText, setSearchText] = useState("")

  return (
    <div className="position-relative">
        <form method="get" action="topics-search" role="search">
            <input 
                type="search" 
                placeholder="Search" 
                aria-label="Search"
                name="q"
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
                className="form-control pe-5 bg-light border-0" 
                required
            />
            {/* <button type="button" onClick={(e) => setSearchText("")} className="rounded p-1 hover:bg-gray-200 position-absolute right-0 top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button> */}
            <button type="submit" className="border-0 pe-3 bg-transparent position-absolute top-50 end-0 translate-middle-y">
                <CiSearch />
            </button>
        </form>
    </div>
  )
}
