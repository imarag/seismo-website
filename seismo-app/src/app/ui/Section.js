
export default function Section({ className, children }) {
  return (
    <section className={className + " py-14 container mx-auto flex flex-col gap-8"}>
        { children }
    </section>
  )
}
