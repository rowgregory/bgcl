export function Fact({ icon, label, children }) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 mt-0.5 text-sky-600 dark:text-sky-400">{icon}</span>
      <div className="text-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-1">
          {label}
        </p>
        <p className="font-medium">{children}</p>
      </div>
    </div>
  )
}
