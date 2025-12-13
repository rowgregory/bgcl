import { EventWithTickets } from '@/types/entities/event'
import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Edit, MapPin, Ticket } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenEventDrawer, setOpenEventTicketDrawer } from '@/app/redux/features/eventSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import getEventStatusBadge from '@/app/lib/utils/events/getEventStatusBadge'

interface IUpcomingEvent {
  event: EventWithTickets
  index: number
}

const UpcomingEvent: FC<IUpcomingEvent> = ({ event, index }) => {
  const progress = (event.attendeeCount / event.capacity) * 100
  const badge = getEventStatusBadge(event.status)
  const dispatch = useAppDispatch()
  const hasTickets = event.tickets && event.tickets.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      className="p-5 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-all border border-zinc-700/50 hover:border-zinc-600"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-bold text-lg">{event.title}</h3>
            <span className={`px-2 py-1 border rounded-full text-xs font-medium ${badge.color}`}>{badge.text}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-zinc-400">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(event.date).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {event.time}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {event.location}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              dispatch(setOpenEventDrawer())
              const { tickets, ...eventData } = event
              dispatch(setInputs({ formName: 'eventForm', data: { ...eventData, isUpdating: true } }))
            }}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors group"
            title="Edit Event"
          >
            <Edit className="w-4 h-4 text-zinc-400 group-hover:text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              dispatch(setOpenEventTicketDrawer())
              dispatch(
                setInputs({
                  formName: 'eventTicketForm',
                  data: { id: event.id, title: event.title, tickets: event.tickets }
                })
              )
            }}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors group relative"
            title="Manage Tickets"
          >
            <Ticket className="w-4 h-4 text-zinc-400 group-hover:text-purple-400" />
            {hasTickets && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-zinc-800" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Capacity</span>
          <span className="font-medium">
            {event.attendeeCount} / {event.capacity} attendees
          </span>
        </div>

        <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            className={`h-full bg-linear-to-r from-purple-600 to-blue-600 rounded-full`}
          />
        </div>

        {/* Tickets Section */}
        {hasTickets && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="pt-3 border-t border-zinc-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400 uppercase">Available Tickets</span>
              <span className="text-xs text-zinc-500">
                {event.tickets.length} type{event.tickets.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-2">
              {event.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => {
                    dispatch(
                      setInputs({
                        formName: 'eventTicketForm',
                        data: { tickets: event.tickets, ...ticket, isUpdating: true }
                      })
                    )
                    dispatch(setOpenEventTicketDrawer())
                  }}
                  className="flex items-center justify-between p-2 bg-zinc-700/30 rounded-lg border border-zinc-700/50 cursor-pointer transition-all hover:bg-zinc-700/50 hover:border-zinc-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                      {ticket.name}
                    </p>
                    <p className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      {ticket.quantitySold} / {ticket.totalQuantity} sold
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
                      ${ticket.price.toFixed(2)}
                    </p>
                    {!ticket.isAvailable && <p className="text-xs text-red-400">Unavailable</p>}
                  </div>
                </div>
              ))}
              {event.tickets.length > 2 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch(setOpenEventTicketDrawer())
                    dispatch(
                      setInputs({
                        formName: 'eventTicketForm',
                        data: { id: event.id, title: event.title, tickets: event.tickets }
                      })
                    )
                  }}
                  className="w-full text-xs text-zinc-400 hover:text-purple-400 py-1 transition-colors"
                >
                  +{event.tickets.length - 2} more ticket{event.tickets.length - 2 !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default UpcomingEvent
