export function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold mb-5">{title}</h2>
      {children}
    </section>
  )
}
