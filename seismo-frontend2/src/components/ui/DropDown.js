import { MdArrowDropDown } from "react-icons/md";

export default function DropDown({ label="", position="start", items }) {
    return (
        <div className={`dropdown dropdown-${position}`}>
            <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                { label }
                <MdArrowDropDown />
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 shadow">
                {
                    items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))
                }
            </ul>
        </div>
    )
}