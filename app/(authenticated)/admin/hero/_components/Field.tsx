export const Field = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  hint,
  rows
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  hint?: string
  rows?: number
}) => (
  <div className="space-y-1.5">
    <label
      htmlFor={id}
      className="block text-xs font-semibold dark:text-neutral-400 text-neutral-500 uppercase tracking-wider"
    >
      {label}
    </label>
    {rows ? (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 placeholder:dark:text-neutral-600 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 dark:bg-neutral-900 bg-white dark:border-neutral-700 border-neutral-200 border rounded-lg text-sm dark:text-white text-neutral-900 placeholder:dark:text-neutral-600 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
      />
    )}
    {hint && <p className="text-xs dark:text-neutral-500 text-neutral-400">{hint}</p>}
  </div>
)
