import { Link } from "react-router-dom"

export default function NavMenu({ classParameters }) {
  return (
    <ul className={"flex gap-x-6 text-lg " + classParameters}>
        <li>
            <Link className="text-gray-500 hover:text-gray-950" to="/">Home</Link>
        </li>
        <li>
            <Link className="text-gray-500 hover:text-gray-950" to="about">About</Link>
        </li>
        <li>
            <Link className="text-gray-500 hover:text-gray-950" to="articles-search">Articles</Link>
        </li>
        <li>
            <Link className="text-gray-500 hover:text-gray-950" to="tools-search">Tools</Link>
        </li>
        <li>
            <Link className="text-gray-500 hover:text-gray-950" to="donation">Donate</Link>
        </li>
        <li>
            <Link className="text-gray-500 hover:text-gray-950" to="contact">Contact</Link>
        </li>
    </ul>
  )
}
