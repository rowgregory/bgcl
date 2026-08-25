import { useMemo, useState } from 'react'
import { EventGroup } from '../_types/event-manifest.types'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, ChevronDown, ChevronUp, Ticket, Users } from 'lucide-react'
import { AttendeeRow } from './AttendeeRow'

export function EventSection({ group, searchQuery }: { group: EventGroup; searchQuery: string }) {
  const [collapsed, setCollapsed] = useState(false)

  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) return group.attendees
    const q = searchQuery.toLowerCase()
    return group.attendees.filter((a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
  }, [group.attendees, searchQuery])

  if (filteredAttendees.length === 0) return null

  const totalGuests = filteredAttendees.reduce((sum, a) => sum + (a.guestCount ?? 0), 0)
  const notAttending = filteredAttendees.filter((a) => !a.attendingEvent).length
  const totalTickets = filteredAttendees.reduce((sum, a) => sum + a.totalTickets, 0)

  return (
    <motion.section
      aria-labelledby={`event-heading-${group.eventId}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border dark:border-neutral-800 border-neutral-200 overflow-hidden"
    >
      {/* Event header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-controls={`event-table-${group.eventId}`}
        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 dark:bg-neutral-900/50 bg-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="shrink-0 w-8 h-8 rounded-lg dark:bg-sky-500/10 bg-sky-50 flex items-center justify-center"
            aria-hidden="true"
          >
            <Calendar className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-left min-w-0">
            <h2
              id={`event-heading-${group.eventId}`}
              className="text-sm font-black dark:text-white text-neutral-900 truncate"
            >
              {group.eventName}
            </h2>
            {group.eventDate && (
              <time
                dateTime={new Date(group.eventDate).toISOString()}
                className="text-xs dark:text-neutral-500 text-neutral-500"
              >
                {new Date(group.eventDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Stats */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 dark:text-neutral-500 text-neutral-400" aria-hidden="true" />
              <span className="text-xs font-semibold dark:text-neutral-400 text-neutral-600">
                {filteredAttendees.length} buyer{filteredAttendees.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="w-px h-3 dark:bg-neutral-700 bg-neutral-200" aria-hidden="true" />
            <div className="flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 dark:text-neutral-500 text-neutral-400" aria-hidden="true" />
              <span className="text-xs font-semibold dark:text-neutral-400 text-neutral-600">
                {totalTickets} ticket{totalTickets !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="w-px h-3 dark:bg-neutral-700 bg-neutral-200" aria-hidden="true" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                {totalGuests} guests attending
              </span>
            </div>
            {notAttending > 0 && (
              <>
                <div className="w-px h-3 dark:bg-neutral-700 bg-neutral-200" aria-hidden="true" />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {notAttending} not attending
                  </span>
                </div>
              </>
            )}
          </div>

          {collapsed ? (
            <ChevronDown className="w-4 h-4 dark:text-neutral-500 text-neutral-400" aria-hidden="true" />
          ) : (
            <ChevronUp className="w-4 h-4 dark:text-neutral-500 text-neutral-400" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Attendee table */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            id={`event-table-${group.eventId}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-120 border-collapse" aria-label={`Attendees for ${group.eventName}`}>
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800">
                    {['Name', 'Email', 'Purchased', 'Tickets', 'Guests', 'Attending'].map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="text-left px-4 py-2.5 text-xs font-semibold dark:text-neutral-500 text-neutral-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {filteredAttendees.map((attendee, i) => (
                      <AttendeeRow key={attendee.orderId} attendee={attendee} index={i} />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
