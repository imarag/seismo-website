import Link from "next/link"
import { navLinks } from "@/utils/static"
import SocialMedia from "@/components/SocialMedia"
import Logo from "@/components/Logo"

export default function Footer() {
  return (
    <div className="container-lg py-4">
        <div className="text-center">
            <Logo />
        </div>
        <h1 className="text-center fs-4 my-3">A Journey Into Seismology</h1>
        <div className="text-center">
            <Link href="/donation" className="btn btn-warning">Donate</Link>
        </div>
        <SocialMedia />
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
            {
                navLinks.map(item => (
                    <Link key={item.label} className="link-dark" href={item.href}>
                        {item.label}
                    </Link>
                ))
            }
        </div>
    </div>
  )
}
