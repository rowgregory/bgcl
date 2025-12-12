import { EventWithTickets } from '@/types/entities/event'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import React, { FC } from 'react'

interface IKeyEventInfo {
  event: EventWithTickets
}

const KeyEventInfo: FC<IKeyEventInfo> = ({ event }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="p-2 bg-white/20 rounded-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-white/70 font-medium">Date</p>
          <p className="font-bold text-white">
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="p-2 bg-white/20 rounded-lg">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-white/70 font-medium">Time</p>
          <p className="font-bold text-white">{event.time}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="p-2 bg-white/20 rounded-lg">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-white/70 font-medium">Location</p>
          <p className="font-bold text-white truncate">{event.location}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="p-2 bg-white/20 rounded-lg">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-white/70 font-medium">Capacity</p>
          <p className="font-bold text-white">
            {event.attendeeCount} / {event.capacity}
          </p>
        </div>
      </div>
    </div>
  )
}

export default KeyEventInfo
