'use client'

import { Calendar, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { splitUTCToDateTime } from '@/app/lib/utils/date-utils'
import { Event, Ticket } from '@prisma/client'

interface EventCardProps {
  event: Event & { tickets: Ticket[] }
}

export function EventCard({ event }: EventCardProps) {
  const { dateString, timeString } = splitUTCToDateTime(event.date)
  const capacityPercent = (event.attendeeCount / event.capacity) * 100
  const hasTickets = event.tickets && event.tickets.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-lg overflow-hidden hover:border-zinc-600 transition-all"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">{event.title}</h3>
            {event.featured && (
              <span className="inline-block mt-2 px-2 py-1 bg-sky-600/20 border border-sky-600/50 rounded text-xs font-medium text-sky-300">
                Featured
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{event.description}</p>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-zinc-400">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{dateString}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>
              {timeString} • {event.duration}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="px-6 py-3 border-t border-zinc-700/50">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-zinc-400">Capacity</span>
          <span className="text-zinc-300 font-medium">
            {event.attendeeCount} / {event.capacity}
          </span>
        </div>
        <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${capacityPercent}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-linear-to-r from-sky-600 to-blue-600 rounded-full"
          />
        </div>
      </div>

      {/* Tickets */}
      {hasTickets && (
        <div className="px-6 py-3 border-t border-zinc-700/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400 uppercase">Tickets Available</span>
            <span className="text-xs text-zinc-500">
              {event.tickets.length} type{event.tickets.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-2">
            {event.tickets.slice(0, 2).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{ticket.name}</span>
                <span className="font-semibold text-sky-400">${(ticket.price / 100).toFixed(2)}</span>
              </div>
            ))}
            {event.tickets.length > 2 && <p className="text-xs text-zinc-500 pt-2">+{event.tickets.length - 2} more</p>}
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="px-6 py-4 border-t border-zinc-700/50 bg-zinc-900/50">
        <Link
          href={`/events/${event.id}`}
          className="block w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors text-center"
        >
          View Details & Register
        </Link>
      </div>
    </motion.div>
  )
}
