'use client'

import { badgeTone } from '../_events-overview.constants'

const saleDateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/New_York'
})

const plural = (n: number) => (n === 1 ? '' : 's')

type Sale = {
  status: string
  opensAt: Date | null
  closesAt: Date | null
  daysUntilOpen: number | null
  daysUntilClose: number | null
}

export function SaleWindowBadge({ sale, compact = false }: { sale: Sale; compact?: boolean }) {
  if (sale.status === 'always') return null

  const { status, opensAt, closesAt, daysUntilOpen, daysUntilClose } = sale

  const closingSoon = status === 'open' && daysUntilClose !== null && daysUntilClose <= 7
  const tone = closingSoon ? 'closing' : status

  let label = ''
  let detail = ''

  if (status === 'open') {
    label = 'On sale now'

    if (closesAt && daysUntilClose !== null) {
      detail =
        daysUntilClose === 0
          ? `closes today at ${saleDateFormat.format(closesAt)}`
          : `closes in ${daysUntilClose} day${plural(daysUntilClose)}, ${saleDateFormat.format(closesAt)}`
    } else if (opensAt) {
      detail = `open since ${saleDateFormat.format(opensAt)}`
    }
  }

  if (status === 'scheduled' && opensAt && daysUntilOpen !== null) {
    label = daysUntilOpen === 0 ? 'On sale today' : `On sale in ${daysUntilOpen} day${plural(daysUntilOpen)}`

    detail = closesAt
      ? `${saleDateFormat.format(opensAt)} to ${saleDateFormat.format(closesAt)}`
      : `opens ${saleDateFormat.format(opensAt)}`
  }

  if (status === 'closed') {
    label = 'Sales closed'
    detail = closesAt ? `closed ${saleDateFormat.format(closesAt)}` : ''
  }

  if (compact) {
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${badgeTone[tone]}`} title={detail || undefined}>
        {label}
      </span>
    )
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${badgeTone[tone]}`}>{label}</span>
      {detail && <span className="text-xs dark:text-neutral-500 text-neutral-600">{detail}</span>}
    </div>
  )
}
