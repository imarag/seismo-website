import Link from "next/link";
import SocialMedia from "@/components/utils/SocialMedia"
import Container from "../utils/Container";
import { navLinks } from "@/utils/static"
import { articles, tools } from "@/utils/topics";
import { IoIosArrowRoundForward } from "react-icons/io";

export default function Footer() {
    const completedTools = tools.filter(el => el.completed)
    const completedArticles = articles.filter(el => el.completed)

    return (
        <footer className="text-sm text-base-content/60 bg-base-200 py-12">
            <Container className="flex flex-wrap flex-col items-start md:flex-row md:justify-around md:items-start gap-y-8">
                <aside className="self-center md:self-auto md:w-full lg:w-auto flex flex-col items-center justify-center gap-3 text-center">
                    <img src="/images/logo.svg" alt="logo of the website" className="w-24" />;
                    <p className="text-lg font-semibold text-primary">
                        A JOURNEY INTO SEISMOLOGY
                    </p>
                    <p className="text-base max-w-md mx-auto">Read, explore and interact</p>
                    <SocialMedia />
                </aside>
                <nav>
                    <h6 className="uppercase text-primary font-bold mb-2">Sitemap</h6>
                    <ul className="space-y-2">
                        {
                            navLinks.map(item => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className={`link link-hover`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </nav>
                <nav>
                    <h6 className="uppercase text-primary font-bold mb-2">Articles</h6>
                    <ul className="space-y-2">
                        {
                            completedArticles.map(item => (
                                <li key={item.title}>
                                    <Link
                                        href={`/articles/${item.slug}`}
                                        className={`link link-hover`}
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))
                        }
                        <li>
                            <Link href="/articles" className="underline group inline-flex items-center gap-2 mt-3">
                                <span>All articles</span>
                                <span className="group-hover:translate-x-2 transition-all"><IoIosArrowRoundForward /></span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <nav>
                    <h6 className="uppercase text-primary font-bold mb-2">Tools</h6>
                    <ul className="space-y-2">
                        {
                            completedTools.map(item => (
                                <li key={item.title}>
                                    <Link
                                        href={`/tools/${item.slug}`}
                                        className={`link link-hover`}
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))
                        }
                        <li>
                            <Link href="/tools" className="underline group inline-flex items-center gap-2 mt-3">
                                <span>All tools</span>
                                <span className="group-hover:translate-x-2 transition-all"><IoIosArrowRoundForward /></span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </Container>
        </footer >
    )
}
