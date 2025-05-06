export default function AlignVertical({ align = "center", children }) {
    return (
        <div className={`space-y-8`}>
            {children}
        </div>
    )
}