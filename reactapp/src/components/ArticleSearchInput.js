
export default function ArticleSearchInput({ handleFillForm }) {
  return (
    <div className="w-3/4 mx-auto relative text-gray-400 mt-14 mb-28">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6 absolute left-6 top-1/2 -translate-y-1/2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <form>
            <input onChange={handleFillForm} type="text" className="border ps-16 border-gray-300 text-gray-500 rounded-sm h-10 w-full" />
        </form>
    </div>
  )
}
