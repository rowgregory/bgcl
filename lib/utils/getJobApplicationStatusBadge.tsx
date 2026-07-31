export const getJobApplicationStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
    case 'REVIEW':
      return 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
    case 'APPROVED':
      return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
    case 'REJECTED':
      return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
    default:
      return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
  }
}
