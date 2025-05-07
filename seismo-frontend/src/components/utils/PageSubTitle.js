export default function PageSubTitle({ text, className = null }) {
    return (
        <p className={`text-lg font-light max-w-2xl mx-auto ${className || ""}`}>
            {text}
        </p>
    )
}