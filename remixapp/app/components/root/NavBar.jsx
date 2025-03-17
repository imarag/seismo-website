
import { navLinks } from "@/utils/static"
import { NavLink } from "@remix-run/react";
import Logo from "@/components/utils/Logo"
import NavSearchBar from "@/components/root/NavSearchBar"
import { AiOutlineMenu } from "react-icons/ai";
import SideNavBar from "@/components/root/SideNavBar"
import { useState } from "react";
import Container from "@/components/utils/Container" 
import ThemeControler from "@/components/root/ThemeControler";

export default function NavBar() {
    const [showNavBar, setShowNavbar] = useState(false)

    return (
        <>
            <nav className="absolute left-0 right-0 h-20 bg-transparent backdrop-blur-md z-40">
                <Container>
                    <div className="navbar flex flex-row relative">
                        <NavLink to="/">
                            <Logo />
                        </NavLink>
                        <div className="navbar-center hidden lg:flex ms-4">
                            <ul className="menu menu-horizontal px-1">
                                {
                                    navLinks.map(item => (
                                        <li key={item.label}>
                                            <NavLink 
                                                to={item.href} 
                                                className={`text-lg rounded-lg hover:bg-base-300`} 
                                                onClick={() => setShowNavbar(false)}
                                            >
                                                {item.label}
                                            </NavLink>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="ms-12">
                            <ThemeControler />
                        </div>
                        <button className="ms-auto btn text-xl btn-ghost lg:hidden" onClick={() => setShowNavbar(true)}>
                            <AiOutlineMenu />
                        </button>
                        <div className="ms-auto hidden lg:flex">
                            <NavSearchBar setShowNavbar={setShowNavbar} />    
                        </div>
                    </div>
                </Container>
            </nav>
            {
                showNavBar && (
                    <SideNavBar setShowNavbar={setShowNavbar} />
                )
            }
        </>
    )
}
