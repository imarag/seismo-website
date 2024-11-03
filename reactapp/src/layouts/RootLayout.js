import { useState } from "react"
import NavMenu from "../components/NavMenu"
import NavSearchInput from "../components/NavSearchInput"
import Logo from "../img/logo.png"
import { Link, Outlet } from 'react-router-dom'

export default function RootLayout() {

    const [offNavActive, setOffnavActive] = useState(false);

  return (
    <>
        <header className="flex flex-row justify-start items-center px-5 py-5 mx-auto container">
            <div className="me-10">
                <Link to="/">
                    <img src={Logo} className="w-20"/>
                </Link>
            </div>
            <nav className="hidden lg:flex">
                <NavMenu classParameters="flex-row items-center justify-center" />
            </nav>
            {
                offNavActive && (
                    <nav className="flex fixed left-0 top-0 bottom-0 w-full sm:w-72 bg-emerald-50/95 shadow-lg overflow-hidden">
                        <NavMenu classParameters="flex-col items-center justify-center w-full" />
                        <button type="button" onClick={(e) => setOffnavActive(false)} className="rounded p-1 hover:bg-gray-200 absolute top-6 right-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </nav>
                )
            }
            <div className="ms-auto hidden lg:flex">
                <NavSearchInput />
            </div>
            <button className="lg:hidden ms-auto" onClick={() => setOffnavActive(!offNavActive)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="size-7" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
            </button>
        </header>
        <main className="text-xl font-normal">
            <Outlet />
        </main>
        <footer>

        </footer>
    </>
  )
}
