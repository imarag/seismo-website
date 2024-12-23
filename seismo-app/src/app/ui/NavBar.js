import { navLinks } from "@/utils/static"
import Link from 'next/link'
import Logo from "@/components/Logo"

export default function NavBar() {
  return (
    <div className="navbar">
        <div className="navbar-start">
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h8m-8 6h16" 
                        />
                    </svg>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    {
                        navLinks.map(item => (
                            <li key={item.label}>
                                <Link href={item.href} className="text-xl">{item.label}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <a className="btn btn-ghost text-xl">
                <Logo />
            </a>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
                {
                    navLinks.map(item => (
                        <li key={item.label}>
                            <Link href={item.href} className="text-xl">{item.label}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
        <div className="navbar-end hidden lg:flex">
            <input type="text" placeholder="Search" className="input input-bordered input-md w-24 md:w-auto" />
        </div>
    </div>
  )
}
