'use client'

import type { LucideIcon } from 'lucide-react'

type Props = {
  checked: boolean
  onChange: (next: boolean) => void
  Icon?: LucideIcon
  title: string
  description?: string
}

export function ToggleCard({ checked, onChange, title, description }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 py-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
    >
      <span className="min-w-0">
        <span className="block text-[13px] text-neutral-900 dark:text-white truncate">{title}</span>

        {description && (
          <span className="block text-xs text-neutral-400 dark:text-neutral-600 truncate">{description}</span>
        )}
      </span>

      <span
        aria-hidden="true"
        className={`shrink-0 w-9 h-5 rounded-full p-0.5 transition-colors ${
          checked ? 'bg-sky-600' : 'bg-neutral-200 dark:bg-neutral-800'
        }`}
      >
        <span
          className={`block w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`}
        />
      </span>
    </button>
  )
}
