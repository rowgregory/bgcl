import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { EventGroup } from '../_types/event-manifest.types'
import { AttendeeRow } from './AttendeeRow'

const thCls =
  'text-left py-2 pr-4 text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-wider whitespace-nowrap'

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
    <section aria-labelledby={`event-heading-${group.eventId}`}>
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-controls={`event-table-${group.eventId}`}
        className="w-full flex items-baseline justify-between gap-4 pb-2.5 border-b border-neutral-200 dark:border-neutral-800 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
      >
        <div className="flex items-baseline gap-3 min-w-0">
          <ChevronRight
            className={`w-3.5 h-3.5 shrink-0 self-center text-neutral-400 dark:text-neutral-600 transition-transform ${
              collapsed ? '' : 'rotate-90'
            }`}
            aria-hidden="true"
          />

          <h2
            id={`event-heading-${group.eventId}`}
            className="text-sm font-semibold text-neutral-900 dark:text-white truncate"
          >
            {group.eventName}
          </h2>

          {group.eventDate && (
            <time
              dateTime={new Date(group.eventDate).toISOString()}
              className="text-xs text-neutral-400 dark:text-neutral-600 whitespace-nowrap tabular-nums"
            >
              {new Date(group.eventDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'America/New_York'
              })}
            </time>
          )}
        </div>

        <div className="hidden sm:flex items-baseline gap-3 shrink-0 text-xs tabular-nums">
          <span className="text-neutral-500 dark:text-neutral-400">
            {filteredAttendees.length} {filteredAttendees.length === 1 ? 'buyer' : 'buyers'}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">
            ·
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">
            ·
          </span>
          <span className="font-medium text-neutral-900 dark:text-white">{totalGuests} attending</span>

          {notAttending > 0 && (
            <>
              <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">
                ·
              </span>
              <span className="text-amber-600 dark:text-amber-400">{notAttending} not attending</span>
            </>
          )}
        </div>
      </button>

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
              <table className="w-full min-w-120 text-sm" aria-label={`Attendees for ${group.eventName}`}>
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-900">
                    {['Name', 'Email', 'Purchased', 'Tickets', 'Guests', 'Attending'].map((col) => (
                      <th key={col} scope="col" className={thCls}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {filteredAttendees.map((attendee, i) => (
                    <AttendeeRow key={attendee.orderId} attendee={attendee} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
