import Link from "next/link"
import { navLinks } from "@/utils/static"
import SocialMedia from "@/components/SocialMedia"
import Logo from "@/components/Logo"

export default function Footer() {
  return (
    <div className="footer bg-base-200 text-base-content p-10">
        <aside className="flex flex-col items-center justify-center gap-3">
            <Logo />
            <p className="text-center text-xl font-semibold">
                Introduction To Seismology
            </p>
            <SocialMedia />
        </aside>
        <nav>
            <h6 className="footer-title">Services</h6>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
            <h6 className="footer-title">Sitemap</h6>
            {
                navLinks.map(item => (
                    <a key={item.label} href={item.href} className="link link-hover">{item.label}</a>
                ))
            }
        </nav>
        <nav>
            <h6 className="footer-title">Articles</h6>
            <a className="link link-hover">Introduction To Seismology</a>
            <a className="link link-hover">Python Obspy</a>
            <a className="link link-hover">Site Effect</a>
            <a className="link link-hover">All articles</a>
        </nav>
        <nav>
            <h6 className="footer-title">Tools</h6>
            <a className="link link-hover">Arrival Time Selection</a>
            <a className="link link-hover">Fourier Spectra Calculation</a>
            <a className="link link-hover">Signal Processing</a>
            <a className="link link-hover">All tools</a>
        </nav>
    </div>
  )
}
