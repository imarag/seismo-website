'use client';
import { navLinks } from "@/utils/static"
import Link from "next/link";
import Logo from "@/components/utils/Logo"
import NavSearchBar from "@/components/root/NavSearchBar"
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import ThemeControler from "@/components/root/ThemeControler";
import Container from "../utils/Container";

export default function NavBar() {
    const [showNavBar, setShowNavbar] = useState(false)

    return (
        <>
            <nav className={`md:bg-transparent ${showNavBar && "bg-base-200"}`}>
                <Container className={`flex flex-col md:flex-row items-stretch md:items-center gap-4 py-8 max-h-25 overflow-hidden transition-all duration-150 relative ${showNavBar && "max-h-96"}`}>
                    <div className="me-8 shrink-0">
                        <Link href="/">
                            <Logo />
                        </Link>
                    </div>
                    <ul className={`flex flex-col md:flex-row items-start md:items-center gap-2 size-full`}>
                        {
                            navLinks.map(item => (
                                <li key={item.label} className="w-full md:w-auto">
                                    <Link
                                        href={item.href}
                                        className={`text-sm rounded-lg font-medium btn btn-sm btn-ghost hover:bg-base-300`}
                                        onClick={() => setShowNavbar(false)}
                                    >
                                        {item.label}
                                    </Link>
                                    <hr className="w-full md:border-transparent border-0.5 border-gray-100/5" />
                                </li>
                            ))
                        }
                    </ul>
                    <div>
                        <NavSearchBar setShowNavbar={setShowNavbar} />
                    </div>
                    {
                        showNavBar ? (
                            <button className="md:hidden btn btn-md rounded-md text-xl btn-ghost absolute end-4" onClick={() => setShowNavbar(false)}>
                                <IoMdClose />
                            </button>
                        ) : (
                            <button className="md:hidden ms-auto btn btn-md rounded-md text-xl btn-ghost absolute end-4" onClick={() => setShowNavbar(!showNavBar)}>
                                <AiOutlineMenu />
                            </button>
                        )
                    }
                </Container>
            </nav>
        </>
    )
}
