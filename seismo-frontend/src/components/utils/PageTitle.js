export default function PageTitle({ text, className = null }) {
    return (
        <h2 className={`text-primary text-3xl max-w-xl mx-auto md:text-5xl font-semibold ${className || ""}`}>
            {text}
        </h2>
    )
}