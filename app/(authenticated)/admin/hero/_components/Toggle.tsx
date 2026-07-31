import { ToggleLeft, ToggleRight } from 'lucide-react'

export const Toggle = ({
  enabled,
  onChange,
  label
}: {
  enabled: boolean
  onChange: (v: boolean) => void
  label: string
}) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    aria-pressed={enabled}
    aria-label={label}
    className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
  >
    {enabled ? (
      <ToggleRight className="w-8 h-8 text-sky-500 transition-colors" aria-hidden="true" />
    ) : (
      <ToggleLeft className="w-8 h-8 dark:text-neutral-600 text-neutral-400 transition-colors" aria-hidden="true" />
    )}
    <span
      className={`text-sm font-medium transition-colors ${enabled ? 'dark:text-white text-neutral-900' : 'dark:text-neutral-500 text-neutral-400'}`}
    >
      {label}
    </span>
  </button>
)
