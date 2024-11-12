import { SearchIcon } from "../SvgIcons"
export default function ArticleSearchInput({ handleFillForm }) {
  return (
    <div className="position-relative mt-4 mb-5 col-lg-10 mx-auto">
        <SearchIcon className="position-absolute top-50 end-0 me-4 translate-middle-y"/>
        <form role="search">
            <input onChange={handleFillForm} type="text" className="form-control py-2"  placeholder="Search" aria-label="Search" />
        </form>
    </div>
  )
}
