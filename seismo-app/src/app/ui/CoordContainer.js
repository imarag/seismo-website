import { IoLocationOutline } from "react-icons/io5";

export default function CoordContainer({ children, label }) {
    return (
        <div>
            <h1 className="text-start flex flex-row align-center justify-center md:justify-start gap-2 mb-1">
                <IoLocationOutline />
                <span>{ label }</span>
            </h1>
            <hr className="border-1"/>
            <div className="flex flex-row md:flex-nowrap justify-center gap-2 mt-4">
                { children }
            </div>
        </div>
    )
}