export default function ToolTip({ text, children }) {
    return (
        <span className="tooltip tooltip-secondary" data-tip={text}>
            {children}
        </span>
    )
}