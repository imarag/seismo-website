import { IoLocationOutline } from "react-icons/io5";

export default function CoordContainer({ children, label }) {
    return (
        <div>
            <h1 className="fs-4 text-start d-flex flex-row align-items-center gap-2 mb-1">
                <IoLocationOutline />
                <span>{ label }</span>
            </h1>
            <hr className="border-1"/>
            <div className="d-flex flex-row flex-wrap gap-2 mt-4">
                { children }
            </div>
        </div>
    )
}