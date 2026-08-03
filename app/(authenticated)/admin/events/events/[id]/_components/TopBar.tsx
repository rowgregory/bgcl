import { AlertCircle, ArrowLeft, Layers, Save } from 'lucide-react'
import Link from 'next/link'
import { EventStatus } from '@prisma/client'
import { StatusBadge } from '@/app/(authenticated)/admin/_components/StatusBadge'

export function TopBar({ isNew, watchedTitle, setShowTemplates, pending, watchedStatus, saveError }) {
  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/events/events"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Back to events"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </Link>
        <div>
          <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-sky-600 dark:text-sky-400">
            {isNew ? 'New Event' : 'Event Editor'}
          </p>
          <h1 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
            {watchedTitle || 'Untitled Event'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isNew && (
          <button
            type="button"
            onClick={() => setShowTemplates((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-semibold rounded-lg transition-colors border border-neutral-200 dark:border-neutral-700"
          >
            <Layers className="w-4 h-4" aria-hidden="true" />
            Templates
          </button>
        )}

        {!isNew && <StatusBadge status={watchedStatus as EventStatus} />}

        {saveError && (
          <span role="alert" className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" /> {saveError}
          </span>
        )}

        <button
          type="submit"
          form="event-form"
          disabled={pending}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          {pending ? 'Saving...' : isNew ? 'Create Event' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
