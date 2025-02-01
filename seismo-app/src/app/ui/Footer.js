import Link from "next/link";
import SocialMedia from "@/components/SocialMedia"
import Logo from "@/components/Logo"
import { navLinks } from "@/utils/static"
import { allTools, allArticles } from "@/utils/all-topics";
import { IoIosArrowRoundForward } from "react-icons/io";


export default function Footer() {
    const completedTools = allTools.filter(el => el.completed)
    const completedArticles = allArticles.filter(el => el.completed)
    
  return (
    <div className="footer bg-base-200 p-10 mt-20">
        <aside className="flex flex-col items-center justify-center gap-3">
            <Logo />
            <p className="text-center text-xl font-semibold">
                Introduction To Seismology
            </p>
            <SocialMedia bg="base-300" hoverBg="base-100" />
        </aside>
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
            {
                completedArticles.map(el => (
                    <Link key={el.title} href={`/articles/${el.slug}`} className="link link-hover">{el.title}</Link>
                ))
            }
            <Link href="/articles" className="link link-hover flex flex-row items-center gap-2 underline mt-3">
                All articles
                <IoIosArrowRoundForward />
            </Link>
        </nav>
        <nav>
            <h6 className="footer-title">Tools</h6>
            {
                completedTools.map(el => (
                    <Link key={el.title} href={`/tools/${el.slug}`} className="link link-hover">{el.title}</Link>
                ))
            }
            <Link href="/tools" className="link link-hover flex flex-row items-center gap-2 underline mt-3">
                All tools
                <IoIosArrowRoundForward />
            </Link>
        </nav>
    </div>
  )
}
