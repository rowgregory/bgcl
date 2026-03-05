import { FC } from 'react'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { splitUTCToDateTime } from '@/app/lib/utils/date-utils'
import { militaryToRegularTime } from '@/app/lib/utils/time-utils'

interface IKeyEventInfo {
  event: any
}

export const KeyEventInfo: FC<IKeyEventInfo> = ({ event }) => {
  const { timeString } = splitUTCToDateTime(event.date)

  return (
    <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="p-2 bg-white/20 rounded-lg shrink-0" aria-hidden="true">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <dt className="text-xs text-white/70 font-medium">Date</dt>
          <dd className="font-bold text-white">
            <time dateTime={new Date(event.date).toISOString()}>
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </dd>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="p-2 bg-white/20 rounded-lg shrink-0" aria-hidden="true">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <dt className="text-xs text-white/70 font-medium">Time</dt>
          <dd className="font-bold text-white">
            <time dateTime={timeString}>{militaryToRegularTime(timeString)}</time>
          </dd>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="p-2 bg-white/20 rounded-lg shrink-0" aria-hidden="true">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-white/70 font-medium">Location</dt>
          <dd className="font-bold text-white truncate">{event.location}</dd>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="p-2 bg-white/20 rounded-lg shrink-0" aria-hidden="true">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <dt className="text-xs text-white/70 font-medium">Capacity</dt>
          <dd className="font-bold text-white">
            <span aria-label={`${event.attendeeCount} of ${event.maxAttendees} spots filled`}>
              {event.attendeeCount} / {event.maxAttendees}
            </span>
          </dd>
        </div>
      </div>
    </dl>
  )
}
