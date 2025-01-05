import Link from "next/link"
export default function CTAButton({ href, label, linkIcon, link=false  }) {
    return (
        <div className="text-center my-8">
            <Link 
                href={href} 
                className={link ? "link link-primary flex flex-row items-center justify-center gap-2" : "btn btn-primary"}
            >
                { label }
                {linkIcon}
            </Link>
        </div>
    )
}