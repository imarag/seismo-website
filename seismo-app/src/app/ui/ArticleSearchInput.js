'use client';
import { CiSearch } from "react-icons/ci";


export default function ArticleSearchInput({ setSearchInputValue }) {
  return (
    <div className="my-10">
      <label className="input input-bordered flex items-center gap-2">
      <input onChange={(e) => setSearchInputValue(e.target.value)} type="text" className="grow" placeholder="Search" />
      <CiSearch />
    </label>
    </div>
  )
}
