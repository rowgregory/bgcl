import { useCountdown } from '@/lib/hooks/useCountdown'

const RED = '#e0355a'
const pad = (n) => String(n).padStart(2, '0')

export function CountdownCard({ event }) {
  const d = new Date(event.date)
  const dateLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const c = useCountdown(event.date)
  return (
    <div
      className="rounded-2xl p-8"
      style={{
        background: 'rgba(160,40,74,.20)',
        border: '1px solid rgba(224,53,90,.28)'
      }}
    >
      <h2 className="text-2xl font-bold mb-1">Save The Date</h2>
      <p className="text-sm mb-7" style={{ color: '#e3c3ca' }}>
        {dateLabel}
      </p>

      <div className="grid grid-cols-4 gap-3">
        {[
          { v: c.days, l: 'Days' },
          { v: c.hours, l: 'Hours' },
          { v: c.minutes, l: 'Minutes' },
          { v: c.seconds, l: 'Seconds' }
        ].map((u) => (
          <div key={u.l} className="text-center">
            <div
              className="rounded-xl py-5"
              style={{ background: 'rgba(18,3,8,.45)', border: '1px solid rgba(224,53,90,.2)' }}
            >
              <span className="block text-3xl sm:text-4xl font-extrabold tabular-nums">{pad(u.v)}</span>
            </div>
            <span className="block mt-2 text-xs font-medium" style={{ color: RED }}>
              {u.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
