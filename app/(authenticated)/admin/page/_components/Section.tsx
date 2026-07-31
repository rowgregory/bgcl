import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        )}
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white capitalize">{title}</h3>
      </button>
      {isOpen && <div className="p-4 pt-0 space-y-4">{children}</div>}
    </div>
  )
}
