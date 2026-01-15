import { IUpcomingEvent } from '@/types/entities/event'
import { FC } from 'react'
import { Calendar, Clock, MapPin, Edit, Ticket } from 'lucide-react'
import { militaryToRegularTime } from '@/app/lib/utils/time-utils'

interface EventDetailsProps {
  dateString: string
  timeString: string
  location: string
}

interface IEventHeader {
  event: IUpcomingEvent['event']
  badge: any
  dateString: string
  timeString: string
  onEdit: (e: any) => void
  onManageTickets: (e: any) => void
  hasTickets: boolean
}

interface ActionButtonsProps {
  onEdit: (e: { stopPropagation: () => void }) => void
  onManageTickets: (e: { stopPropagation: () => void }) => void
  hasTickets: boolean
}

export const ActionButtons: FC<ActionButtonsProps> = ({ onEdit, onManageTickets, hasTickets }) => (
  <div className="flex items-center space-x-2">
    <button onClick={onEdit} className="p-2 hover:bg-zinc-700 rounded-lg transition-colors group" title="Edit Event">
      <Edit className="w-4 h-4 text-zinc-400 group-hover:text-white" />
    </button>
    <button
      onClick={onManageTickets}
      className="p-2 hover:bg-zinc-700 rounded-lg transition-colors group relative"
      title="Manage Tickets"
    >
      <Ticket className="w-4 h-4 text-zinc-400 group-hover:text-purple-400" />
      {hasTickets && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-zinc-800" />
      )}
    </button>
  </div>
)

export const EventDetails: FC<EventDetailsProps> = ({ dateString, timeString, location }) => (
  <div className="flex items-center space-x-4 text-sm text-zinc-400">
    <span className="flex items-center">
      <Calendar className="w-4 h-4 mr-1" />
      {dateString}
    </span>
    <span className="flex items-center">
      <Clock className="w-4 h-4 mr-1" />
      {militaryToRegularTime(timeString)}
    </span>
    <span className="flex items-center">
      <MapPin className="w-4 h-4 mr-1" />
      {location}
    </span>
  </div>
)

export const EventHeader: FC<IEventHeader> = ({
  event,
  badge,
  dateString,
  timeString,
  onEdit,
  onManageTickets,
  hasTickets
}) => (
  <div className="flex items-start justify-between mb-3">
    <div className="flex-1">
      <div className="flex items-center space-x-3 mb-2">
        <h3 className="font-bold text-lg">{event.title}</h3>
        <span className={`px-2 py-1 border rounded-full text-xs font-medium ${badge.color}`}>{badge.text}</span>
      </div>
      <EventDetails dateString={dateString} timeString={timeString} location={event.location} />
    </div>

    <ActionButtons onEdit={onEdit} onManageTickets={onManageTickets} hasTickets={hasTickets} />
  </div>
)
