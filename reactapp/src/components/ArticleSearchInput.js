import { CiSearch } from "react-icons/ci";


export default function ArticleSearchInput({ handleFillForm }) {
  return (
    <div className="position-relative mt-4 mb-5 col-lg-10 mx-auto">
        <CiSearch />
        <form role="search">
            <input onChange={handleFillForm} type="text" className="form-control py-2"  placeholder="Search" aria-label="Search" />
        </form>
    </div>
  )
}
