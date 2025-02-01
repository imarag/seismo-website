import Link from "next/link"

export default function LinkTag({external=false, button=false, large=false, children, ...props}) {
    const tagClassName=`${button ? `btn btn-primary ${large ? "btn-lg" : ""}` : "link link-info"} mt-2 inline-flex items-center gap-2`
    
    const tagElement = external ? (
        <a className={tagClassName} {...props}>{ children }</a>
    ) : (
        <Link className={tagClassName} {...props}>{ children }</Link>
    )

    return tagElement 
}