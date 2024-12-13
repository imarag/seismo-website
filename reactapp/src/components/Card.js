import { Link } from "react-router-dom"
import "../styles/Card.css"

export default function Card({ title, description, imgURL, pageURL}) {
  return (
    <div className="card border-0">
      <div className="text-center">
        <img src={imgURL} className="card-image" />
      </div>
      <div className="card-body">
        <h5 className="card-title text-center fw-semibold fs-4">{ title }</h5>
        <p className="card-text fw-light">{ description }</p>
        <div className="text-center mt-3">
          <Link to={pageURL} className="btn btn-primary">
              Go to page
          </Link>
        </div>
      </div>
    </div>
  )
}
