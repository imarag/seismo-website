import { NavLink } from "@remix-run/react";
import SocialMedia from "@/components/utils/SocialMedia"
import Logo from "@/components/utils/Logo"
import { navLinks } from "@/utils/static"
import { articles, tools } from "@/utils/topics";
import { IoIosArrowRoundForward } from "react-icons/io";
import FooterTitle from "@/components/root/FooterTitle"

export default function Footer() {
    const completedTools = tools.filter(el => el.completed)
    const completedArticles = articles.filter(el => el.completed)
    
  return (
    <div className="footer bg-base-100 p-10">
        <aside className="flex flex-col items-center justify-center gap-3">
            <Logo />
            <p className="text-center text-xl font-semibold">
                Introduction To Seismology
            </p>
            <SocialMedia bg="base-300" hoverBg="base-100" />
        </aside>
        <nav>
            <FooterTitle text="Sitemap" />
            {
                navLinks.map(item => (
                    <a key={item.label} href={item.href} className="link link-hover">{item.label}</a>
                ))
            }
        </nav>
        <nav>
            <FooterTitle text="Articles" />
            {
                completedArticles.map(el => (
                    <NavLink key={el.title} to={`/article/${el.slug}`} className="link link-hover">{el.title}</NavLink>
                ))
            }
            <NavLink to="/articles-search" className="link link-hover flex flex-row items-center gap-2 underline mt-3">
                All articles
                <IoIosArrowRoundForward />
            </NavLink>
        </nav>
        <nav>
            <FooterTitle text="Tools" />
            {
                completedTools.map(el => (
                    <NavLink key={el.title} to={`/tool/${el.slug}`} className="link link-hover">{el.title}</NavLink>
                ))
            }
            <NavLink to="/tools-search" className="link link-hover flex flex-row items-center gap-2 underline mt-3">
                All tools
                <IoIosArrowRoundForward />
            </NavLink>
        </nav>
    </div>
  )
}
