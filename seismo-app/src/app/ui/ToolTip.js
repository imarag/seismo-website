export default function ToolTip({ text, children }) {
    return (
        <div className="tooltip tooltip-secondary" data-tip={text}>
            {children}
        </div>
    )
}