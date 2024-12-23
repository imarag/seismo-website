import Link from "next/link"
export default function CTAButton({ href, label }) {
    return (
        <div className="text-center my-8">
            <Link href={href} className="btn btn-primary">
                { label }
            </Link>
        </div>
    )
}