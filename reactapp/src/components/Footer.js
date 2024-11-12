import { Link } from 'react-router-dom'
import { allArticles, allTools } from "../all-topics"
import { navLinks } from "../data"
import FooterItem from "../components/FooterItem"
import SocialMedia from "../components/SocialMedia"
import Logo from "../img/logo.png"

export default function Footer() {
  return (
    <div className="container-lg py-4">
        <div className="text-center">
            <img src={Logo}/>
        </div>
        <h1 className="text-center fs-4 my-3">A Journey Into Seismology</h1>
        <div className="text-center">
            <Link to="donation" className="btn btn-warning">Donate</Link>
        </div>
        <SocialMedia />
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
            {
                navLinks.map(item => (
                    <Link key={item.title} className="link-dark" to={item.to}>
                        {item.title}
                    </Link>
                ))
            }
        </div>
    </div>
  )
}
