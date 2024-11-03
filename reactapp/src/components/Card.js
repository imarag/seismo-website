import { Link } from "react-router-dom"

export default function Card({ title, description, imgURL, pageURL, imgWidth, imgHeight}) {
  return (
    <div>
        <img src={imgURL} className={imgWidth + " " + imgHeight + " block mx-auto mb-4"} />
        <h1 className="text-center text-2xl font-semibold mb-2">{ title }</h1>
        <p className="text-center font-light">{ description }</p>
        <div className="text-center mt-8">
            <Link to={pageURL} className="bg-green-700 text-green-50 px-4 py-2 text-lg rounded">
                Go to page
            </Link>
        </div>
    </div>
  )
}
