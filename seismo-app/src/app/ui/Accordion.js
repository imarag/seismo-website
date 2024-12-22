import { useState } from "react"
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

export default function Accordion({ label, show=false, children }) {

    const [accordionActive, setAccordionActive] = useState(show)
    return (
        <div className="my-3 border rounded">
            <div className="d-flex flex-row justify-content-between align-items-center py-2 px-5" onClick={() => setAccordionActive(!accordionActive)}>
                <span>{label}</span>
                {accordionActive ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {
                accordionActive && (
                    <div className="p-4">
                        { children }
                    </div>
                )
            }
        </div>
    )
}

