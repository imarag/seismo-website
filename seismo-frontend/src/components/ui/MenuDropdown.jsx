import { useState } from "react"
import { MdArrowDropDown } from "react-icons/md";
import Button from "./Button";
import Symbol from "./Symbol";

export default function MenuDropdown({ label, icon, position = "left", children }) {
    const [showMenu, setShowMenu] = useState(false)
    const baseClass = "border border-white/20 rounded-md px-4 py-8 absolute top-full w-50  bg-base-300 z-50"
    const positionClass = {
        left: "right-1/2",
        center: "left-1/2 -translate-x-1/2",
        right: "left-1/2",
    }
    return (
        <div className="relative z-50">
            <Button style="ghost" size="small" onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2">
                <span>{label}</span>
                <span>{<Symbol IconComponent={icon} />}</span>
                <span>{<Symbol IconComponent={MdArrowDropDown} />}</span>
            </Button>
            {
                showMenu && (
                    <div className={`${baseClass} ${positionClass[position] || ""}`}>
                        {children}
                    </div>
                )
            }

        </div>
    )
}