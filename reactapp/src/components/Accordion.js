import { useState } from "react"
import { ArrowUp } from "../SvgIcons"
import { ArrowDown } from "../SvgIcons"

export default function Accordion({ label, description }) {

    const [accordionActive, setAccordionActive] = useState(false)
    return (
        <div className="my-5 border rounded hover:bg-gray-100">
            <div className="d-flex flex-row justify-content-between align-items-center py-2 px-5" onClick={() => setAccordionActive(!accordionActive)}>
                <span>{label}</span>
                {accordionActive ? <ArrowUp /> : <ArrowDown />}
            </div>
            {
                accordionActive && (
                    <div className="p-5">
                        <p>{description}</p>
                    </div>
                )
            }
        </div>
    )
}

