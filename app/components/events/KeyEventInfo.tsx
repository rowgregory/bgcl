import { FC } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { formatDate, splitUTCToDateTime } from '@/app/lib/utils/date-utils'
import { IEvent } from '@/types/entities/event'

export const KeyEventInfo: FC<{ event: IEvent }> = ({ event }) => {
  const { timeString } = splitUTCToDateTime(event?.date)

  const items = [
    {
      icon: Calendar,
      label: 'Date',
      value: <time dateTime={new Date(event?.date).toISOString()}>{formatDate(event?.date)}</time>
    },
    {
      icon: Clock,
      label: 'Time',
      value: <time dateTime={timeString}>{timeString}</time>
    },
    {
      icon: MapPin,
      label: 'Venue',
      value: <span className="truncate">{event?.location}</span>
    }
  ]

  return (
    <dl className="flex flex-wrap gap-6 sm:gap-10">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3 min-w-0">
          <div
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.25)' }}
            aria-hidden="true"
          >
            <Icon className="w-4 h-4" style={{ color: '#d4af37' }} />
          </div>
          <div className="min-w-0">
            <dt
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'rgba(212,175,55,0.5)', fontFamily: 'Oswald, sans-serif' }}
            >
              {label}
            </dt>
            <dd className="font-semibold text-sm text-white/80 mt-0.5 truncate">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
