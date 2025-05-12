import { navLinks } from "../../assets/data/static";
import NavSearchBar from "./NavSearchBar";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import LogoSVG from "../../assets/images/logo.svg";

export default function NavBar() {
  const [showNavBar, setShowNavbar] = useState(false);

  return (
    <>
      <nav className={`md:bg-transparent ${showNavBar && "bg-base-200"}`}>
        <div
          className={`container flex flex-col md:flex-row items-stretch md:items-center gap-4 py-8 max-h-25 overflow-hidden transition-all duration-150 relative ${
            showNavBar && "max-h-96"
          }`}
        >
          <div className="me-8 shrink-0">
            <a href="/">
              <img
                src={LogoSVG.src}
                alt="logo of the website"
                className="w-24"
              />
            </a>
          </div>
          <ul
            className={`flex flex-col md:flex-row items-start md:items-center gap-2 size-full`}
          >
            {navLinks.map((item) => (
              <li key={item.label} className="w-full md:w-auto">
                <a
                  href={item.href}
                  className={`text-sm rounded-lg font-medium btn btn-sm btn-ghost hover:bg-base-300`}
                  onClick={() => setShowNavbar(false)}
                >
                  {item.label}
                </a>
                <hr className="w-full md:border-transparent border-0.5 border-gray-100/5" />
              </li>
            ))}
          </ul>
          <div>
            <NavSearchBar setShowNavbar={setShowNavbar} />
          </div>
          {showNavBar ? (
            <button
              className="md:hidden btn btn-md rounded-md text-xl btn-ghost absolute end-4"
              onClick={() => setShowNavbar(false)}
            >
              <IoMdClose />
            </button>
          ) : (
            <button
              className="md:hidden ms-auto btn btn-md rounded-md text-xl btn-ghost absolute end-4"
              onClick={() => setShowNavbar(!showNavBar)}
            >
              <AiOutlineMenu />
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
