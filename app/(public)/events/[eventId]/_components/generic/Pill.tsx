export function Pill({ children, tone = 'default' }) {
  const tones = {
    default:
      'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
    accent: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/30',
    warn: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
    muted:
      'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500 border-neutral-200 dark:border-neutral-700'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${tones[tone]}`}>
      {children}
    </span>
  )
}
