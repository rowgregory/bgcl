const STATUS_DOT: Record<string, string> = {
  CONFIRMED: 'bg-emerald-500',
  COMPLETED: 'bg-emerald-500',
  PENDING: 'bg-amber-500',
  PROCESSING: 'bg-amber-500',
  PENDING_CANCELLATION: 'bg-amber-500',
  FAILED: 'bg-red-500',
  CANCELLED: 'bg-neutral-300 dark:bg-neutral-700',
  REFUNDED: 'bg-neutral-300 dark:bg-neutral-700',

  UPCOMING: 'bg-sky-500',
  ONGOING: 'bg-emerald-500',
  DRAFT: 'bg-neutral-300 dark:bg-neutral-700'
}

const label = (status: string) =>
  status
    .toLowerCase()
    .split('_')
    .join(' ')
    .replace(/^./, (c) => c.toUpperCase())

export const StatusBadge = ({ status }: { status: string }) => (
  <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
    <span
      className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[status] ?? 'bg-neutral-300 dark:bg-neutral-700'}`}
      aria-hidden="true"
    />
    {label(status)}
  </span>
)
