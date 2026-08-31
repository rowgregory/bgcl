import { useCountdown } from '@/lib/hooks/useCountdown'

export function TicketCheckoutSalesCountdown({ target }: { target: Date | string }) {
  const t = useCountdown(target)

  return (
    <div className="flex items-baseline gap-4">
      {[
        { v: t.days, l: 'days' },
        { v: t.hours, l: 'hrs' },
        { v: t.minutes, l: 'min' },
        { v: t.seconds, l: 'sec' }
      ].map(({ v, l }) => (
        <div key={l} className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold tabular-nums text-neutral-900 dark:text-white">
            {String(v).padStart(2, '0')}
          </span>
          <span className="text-xs text-neutral-400 dark:text-neutral-600">{l}</span>
        </div>
      ))}
    </div>
  )
}
