export default function StatChip({
  label,
  value,
  color
}: {
  label: string
  value: string
  color?: 'emerald' | 'indigo' | 'sky'
}) {
  const colorMap = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    sky: 'text-sky-600 dark:text-sky-400'
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
        {label}
      </span>
      <span className={`text-sm font-black ${color ? colorMap[color] : 'text-neutral-900 dark:text-white'}`}>
        {value}
      </span>
    </div>
  )
}
