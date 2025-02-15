export default function AlignVertical({ align="center", children }) {
    return (
        <div className={`flex flex-col items-${align} gap-8`}>
            { children }
        </div>
    )
}