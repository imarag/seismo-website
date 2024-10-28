import Logo from "../img/logo.png"
import { Link, Outlet } from 'react-router-dom'

export default function RootLayout() {

    function handleSidebar() {
        document.querySelector(".offnav").classList.toggle("active")
    }

  return (
    <>
        <header className="flex flex-row justify-between items-center py-5 mx-auto container">
            <div>
                <Link to="/">
                    <img src={Logo} className="w-20"/>
                </Link>
            </div>
            <nav className="hidden lg:flex">
                <ul className="flex flex-row gap-x-6 text-lg">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="about">About</Link>
                    </li>
                    <li>
                        <Link to="articles-search">Articles</Link>
                    </li>
                    <li>
                        <Link to="tools-search">Tools</Link>
                    </li>
                    <li>
                        <Link to="donation">Donate</Link>
                    </li>
                    <li>
                        <Link to="contact">Contact</Link>
                    </li>
                </ul>
            </nav>
            <div className="hidden lg:flex">
                <form>
                    <div className="flex items-center justify-evenly gap-x-4 bg-gray-100 border-gray-100 border pe-4 rounded-lg">
                        <input className="bg-gray-100 py-1 rounded-lg" id="search" type="search" />
                        <label htmlFor="search">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="size-4 stroke-1 stroke-gray-800" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                        </label>
                    </div>
                </form>
            </div>
            <button className="lg:hidden" onClick={handleSidebar}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="size-7" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
            </button>
            

        </header>
        <main className="text-lg font-normal">
            <Outlet />
        </main>
        <footer>

        </footer>
    </>
  )
}
