export default function Section({ className=null, children }) {
    return (
        <section className={`py-14 ${className || ""}`}>
            {children}
        </section>
    )
}