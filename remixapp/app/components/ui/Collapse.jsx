
export default function Accordion({ label, children }) {

    return (
        <div className="collapse collapse-arrow bg-base-100 border rounded-md border-gray-250 text-lg">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">
                { label }
            </div>
            <div className="collapse-content font-light">
                { children }
            </div>
        </div>
    )
}

