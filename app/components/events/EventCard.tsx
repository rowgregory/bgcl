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
      className="group dark:bg-neutral-800/50 dark:backdrop-blur dark:border-neutral-700/50 bg-white border-neutral-200 border rounded-lg overflow-hidden dark:hover:border-neutral-600 hover:border-neutral-300 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold dark:text-white text-neutral-900 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors">
                {event.title}
              </h3>
              {event.featured && (
                <span className="inline-block mt-2 px-2 py-1 dark:bg-sky-600/20 dark:border-sky-600/50 dark:text-sky-300 bg-sky-100 border-sky-300 text-sky-700 rounded text-xs font-medium border">
                  Featured
                </span>
              )}
            </div>
          </div>

          <p className="text-sm dark:text-neutral-400 text-neutral-600 line-clamp-2 mb-4">{event.description}</p>

          {/* Event Details */}
          <div className="space-y-2 text-sm dark:text-neutral-400 text-neutral-600">
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
        <div className="px-6 py-3 dark:border-neutral-700/50 border-neutral-200 border-t">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="dark:text-neutral-400 text-neutral-600">Capacity</span>
            <span className="dark:text-neutral-300 text-neutral-700 font-medium">
              {event.attendeeCount} / {event.capacity}
            </span>
          </div>
          <div className="w-full dark:bg-neutral-700 bg-neutral-300 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${capacityPercent}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-linear-to-r from-sky-600 to-sky-500 rounded-full"
            />
          </div>
        </div>

        {/* Tickets */}
        {hasTickets && (
          <div className="px-6 py-3 dark:border-neutral-700/50 border-neutral-200 border-t">
            {(() => {
              const publishedTickets = event.tickets.filter((t) => t.isPublished)
              const hasPublished = publishedTickets.length > 0

              return (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium dark:text-neutral-400 text-neutral-600 uppercase">
                      Tickets Available
                    </span>
                    <span className="text-xs dark:text-neutral-500 text-neutral-500">
                      {hasPublished
                        ? `${publishedTickets.length} type${publishedTickets.length !== 1 ? 's' : ''}`
                        : 'None available'}
                    </span>
                  </div>

                  {hasPublished ? (
                    <div className="space-y-2">
                      {publishedTickets.slice(0, 2).map((ticket) => (
                        <div key={ticket.id} className="flex items-center justify-between text-sm">
                          <span className="dark:text-neutral-400 text-neutral-600 truncate">{ticket.name}</span>
                          <span className="font-semibold dark:text-sky-400 text-sky-600 shrink-0 ml-2">
                            ${Number(ticket.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {publishedTickets.length > 2 && (
                        <p className="text-xs dark:text-neutral-500 text-neutral-500 pt-2">
                          +{publishedTickets.length - 2} more
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs dark:text-neutral-500 text-neutral-500">
                      Ticket sales are not currently open.
                    </p>
                  )}
                </>
              )
            })()}
          </div>
        )}
      </div>
      {/* CTA Button */}
      <div className="px-6 py-4 dark:border-neutral-700/50 dark:bg-neutral-900/50 border-neutral-200 bg-neutral-50 border-t">
        <Link
          href={`/events/${event.id}`}
          className="block w-full px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors text-center"
        >
          {hasTickets && event.tickets.every((t) => !t.isPublished) ? 'View Event' : 'Buy Tickets'}
        </Link>
      </div>
    </motion.div>
  )
}
