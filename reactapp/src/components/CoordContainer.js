import { LocationIcon } from "../SvgIcons"

export default function CoordContainer({ children, label }) {
    return (
        <div>
            <h1 className="fs-4 text-start d-flex flex-row align-items-center gap-2 mb-1">
                <LocationIcon />
                <span>{ label }</span>
            </h1>
            <hr className="border-1"/>
            <div className="d-flex flex-row flex-wrap gap-2 mt-4">
                { children }
            </div>
        </div>
    )
}