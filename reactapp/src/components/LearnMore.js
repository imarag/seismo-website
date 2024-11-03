import { ArrowRightIcon } from "../SvgIcons"
import { Link } from "react-router-dom"

export default function LearnMore({ to }) {
  return (
    <p className="flex items-center justify-center gap-x-2 underline my-8">
        <Link to={to}>Learn More</Link>
        <ArrowRightIcon />
    </p>
  )
}
