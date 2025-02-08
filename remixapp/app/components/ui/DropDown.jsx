import { MdArrowDropDown } from "react-icons/md";

export default function DropDown({ label="", position="start", children }) {
    return (
        <div className={`dropdown dropdown-${position}`}>
            <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                { label }
                <MdArrowDropDown />
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                { children }
            </ul>
        </div>
    )
}