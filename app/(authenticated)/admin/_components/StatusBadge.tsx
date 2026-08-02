export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    PENDING: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    CANCELLED: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
    REFUNDED: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400',
    FAILED: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
  }
  return (
    <span
      role="status"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${map[status] ?? map.PENDING}`}
    >
      {status.toLowerCase()}
    </span>
  )
}
