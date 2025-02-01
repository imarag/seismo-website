export default function Section({ className, children }) {
    return (
        <section className={className + " py-14"}>
            {children}
        </section>
    )
}