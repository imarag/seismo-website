import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

export default function Collapse({ label = "Collapse title", children }) {
    const [showContent, setShowContent] = useState(true);

    return (
        <div className="border border-neutral-500/20 rounded-md bg-base-100">
            <button
                type="button"
                onClick={() => setShowContent(!showContent)}
                className="flex w-full items-center justify-between px-4 py-2"
            >
                <span>{label}</span>
                {showContent ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>

            <div className={`${showContent ? "max-h-60" : "h-0 max-h-0"} px-4   overflow-auto transition-all duration-150`}>
                {children}
            </div>
        </div>
    );
}
