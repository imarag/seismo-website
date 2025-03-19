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
    <div className="footer sm:footer-horizontal bg-base-100 p-10">
        <aside className="flex flex-col items-center justify-center gap-3">
            <Logo />
            <p className="text-center text-xl font-semibold">
                Introduction To Seismology
            </p>
            <SocialMedia/>
        </aside>
        <nav>
            <FooterTitle text="Sitemap" />
            <ul className="flex flex-col gap-2">
                {
                    navLinks.map(item => (
                        <li key={item.label}>
                            <NavLink 
                                to={item.href} 
                                className={`link link-hover`} 
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))
                }
            </ul>
        </nav>
        <nav>
            <FooterTitle text="Articles" />
            <ul className="flex flex-col gap-2">
                {
                    completedArticles.map(item => (
                        <li key={item.title}>
                            <NavLink 
                                to={`/article/${item.slug}`} 
                                className={`link link-hover`} 
                            >
                                {item.title}
                            </NavLink>
                        </li>
                    ))
                }
                <li>
                    <NavLink to="/articles-search" className="link link-hover flex flex-row items-center gap-2 underline mt-3">
                        All articles
                        <IoIosArrowRoundForward />
                    </NavLink>
                </li>
            </ul>
        </nav>
        <nav>
            <FooterTitle text="Tools" />
            <ul className="flex flex-col gap-2">
                {
                    completedTools.map(item => (
                        <li key={item.title}>
                            <NavLink 
                                to={`/tool/${item.slug}`} 
                                className={`link link-hover`} 
                            >
                                {item.title}
                            </NavLink>
                        </li>
                    ))
                }
                <li>
                <NavLink to="/tools-search" className="link link-hover flex flex-row items-center gap-2 underline mt-3">
                    All tools
                    <IoIosArrowRoundForward />
                </NavLink>
                </li>
            </ul>
        </nav>
    </div>
  )
}
