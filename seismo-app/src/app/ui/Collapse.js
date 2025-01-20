
export default function Accordion({ label, children }) {

    return (
        <div className="collapse collapse-arrow bg-white border border-gray-200 text-lg">
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

