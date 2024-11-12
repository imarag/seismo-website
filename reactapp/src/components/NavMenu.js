import { Link } from "react-router-dom"
import { navLinks } from "../data"
import Logo from "../img/logo.png"
import NavSearchInput from "./NavSearchInput"

export default function NavMenu() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-transparent container-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={Logo}/>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {
              navLinks.map((item) => (
                  <li className="nav-item" key={item.title}>
                    <Link className="nav-link" to={item.to}>{item.title}</Link>
                  </li>
              ))
            }
          </ul>
          <NavSearchInput />
        </div>
      </div>
    </nav>

  )
}
