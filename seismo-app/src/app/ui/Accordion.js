
export default function Accordion({ label, children }) {

    return (
        <div className="collapse bg-base-200 mt-8 mb-14 text-lg">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
                { label }
            </div>
            <div className="collapse-content font-light">
                { children }
            </div>
        </div>
    )
}

