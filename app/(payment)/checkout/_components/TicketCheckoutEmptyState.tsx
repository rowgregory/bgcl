import Link from 'next/link'

export function EmptyState() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Your cart is empty</h1>

        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Add tickets to an event and they will show up here.
        </p>

        <Link
          href="/events"
          className="inline-block mt-6 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
        >
          Browse events
        </Link>
      </div>
    </div>
  )
}
