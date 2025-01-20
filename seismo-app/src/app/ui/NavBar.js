"use client";
import { navLinks } from "@/utils/static"
import Link from 'next/link'
import Logo from "@/components/Logo"
import NavSearchBar from "@/components/NavSearchBar"
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
 
export default function NavBar() {
    const [showNavBar, setShowNavbar] = useState(false)

    return (
        <nav className="container mx-auto">
            <div className="navbar flex flex-row relative">
                <Link href="/">
                    <Logo />
                </Link>
                <div className="navbar-center hidden lg:flex ms-4">
                    <ul className="menu menu-horizontal px-1">
                        {
                            navLinks.map(item => (
                                <li key={item.label}>
                                    <Link 
                                        href={item.href} 
                                        className={`text-lg`} 
                                        onClick={() => setShowNavbar(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <button className="ms-auto btn text-xl btn-ghost lg:hidden" onClick={() => setShowNavbar(true)}>
                    <AiOutlineMenu />
                </button>

                <div className="ms-auto hidden lg:flex">
                    <NavSearchBar setShowNavbar={setShowNavbar} />    
                </div>
                {
                    showNavBar && (
                        <div className="fixed end-0 top-0 bottom-0 w-full sm:w-96 bg-base-200 shadow-lg lg:hidden z-50">
                            <button className="btn btn-ghost absolute top-4 start-4 " onClick={() => setShowNavbar(false)}>
                                <IoMdClose className="text-xl" />
                            </button>
                            <div className="absolute top-20 start-1/2 -translate-x-1/2">
                                <NavSearchBar setShowNavbar={setShowNavbar} />
                            </div>
                            <div className="flex flex-col items-center justify-center h-full w-full gap-1">
                                {
                                    navLinks.map(item => (
                                        <Link 
                                            key={item.label} 
                                            href={item.href} 
                                            onClick={() => setShowNavbar(false)} 
                                            className="btn btn-ghost text-lg"
                                        >
                                            {item.label}
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </nav>
    )
}
