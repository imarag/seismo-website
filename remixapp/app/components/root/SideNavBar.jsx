import { IoMdClose } from "react-icons/io";
import { navLinks } from "@/utils/static"
import { NavLink } from "@remix-run/react";
import NavSearchBar from "@/components/root/NavSearchBar";


export default function SideNavBar({ setShowNavbar }) {
    return (
        <nav className="fixed end-0 top-0 bottom-0 w-full sm:w-96 shadow-lg lg:hidden bg-white/80 backdrop-blur-md z-50"> 
            <button className="btn btn-ghost absolute top-4 start-4 " onClick={() => setShowNavbar(false)}>
                <IoMdClose className="text-xl" />
            </button>
            <div className="absolute top-20 start-1/2 -translate-x-1/2">
                <NavSearchBar setShowNavbar={setShowNavbar} />
            </div>
            <div className="flex flex-col items-center justify-center h-full w-full gap-1">
                {
                    navLinks.map(item => (
                        <NavLink 
                            key={item.label} 
                            to={item.href} 
                            onClick={() => setShowNavbar(false)} 
                            className="btn btn-ghost text-lg"
                        >
                            {item.label}
                        </NavLink>
                    ))
                }
            </div>
        </nav>
    )
}