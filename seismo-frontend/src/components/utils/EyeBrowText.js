export default function EyeBrowText({ text, className = null }) {
    return (
        <p className={`inline-block px-4 py-2 bg-base-200 rounded-full span-2 text-xs text-base-content/80 uppercase ${className || ""}`}>
            {text}
        </p>
    )
}