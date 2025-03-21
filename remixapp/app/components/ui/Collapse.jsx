
export default function Collapse({ label, children }) {
    return (
        <div className="collapse collapse-arrow bg-base-100 border border-neutral-500/20 rounded-md border-gray-250 text-lg">
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

