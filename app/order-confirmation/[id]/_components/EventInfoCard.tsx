import { Calendar, MapPin } from 'lucide-react'
import { DetailCard } from './DetailCard'
import { formatEventDateTime } from '../_formatters'

export const EventInfoCard = ({ event }: { event: any }) => {
  if (!event) return null

  return (
    <DetailCard title="Event" delay={0.65}>
      <div className="space-y-3">
        <p className="font-semibold text-neutral-900 dark:text-white">{event.title}</p>

        <div className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Calendar className="w-4 h-4 shrink-0 mt-0.5 text-sky-500" aria-hidden="true" />
          <span>{formatEventDateTime(event.date)}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-sky-500" aria-hidden="true" />
          <span>{event.location}</span>
        </div>
      </div>
    </DetailCard>
  )
}
