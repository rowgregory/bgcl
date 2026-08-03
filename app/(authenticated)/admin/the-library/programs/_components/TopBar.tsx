import { X } from 'lucide-react'

export default function TopBar({ isUpdating }: { isUpdating: boolean }) {
  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-neutral-900 dark:text-white font-semibold text-sm">
            {isUpdating ? 'Edit Program' : 'Create New Program'}
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">Configure your program details</p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="p-1 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
