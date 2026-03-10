'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDate } from '@/app/lib/utils/date-utils'
import { IOrder } from '@/types/entities/order'

// ── Grouped event type ────────────────────────────────────────────────────────
type EventGroup = {
  eventId: string
  eventName: string
  eventDate: Date | null
  attendees: {
    orderId: string
    name: string
    email: string
    purchasedAt: Date
    totalTickets: number
  }[]
}

// ── Single attendee row ───────────────────────────────────────────────────────
const AttendeeRow = ({ attendee, index }: { attendee: EventGroup['attendees'][number]; index: number }) => (
  <motion.tr
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15, delay: index * 0.02 }}
    className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
  >
    <td className="px-4 py-3 whitespace-nowrap">
      <div className="flex items-center gap-2.5">
        <div className="shrink-0 w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center" aria-hidden="true">
          <span className="text-white text-xs font-bold leading-none">{attendee.name?.[0]?.toUpperCase() ?? '?'}</span>
        </div>
        <span className="text-sm font-semibold dark:text-neutral-200 text-neutral-800">{attendee.name}</span>
      </div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap">
      <span className="text-xs font-mono dark:text-neutral-400 text-neutral-600">{attendee.email}</span>
    </td>
    <td className="px-4 py-3 whitespace-nowrap">
      <time
        dateTime={new Date(attendee.purchasedAt).toISOString()}
        className="text-xs dark:text-neutral-500 text-neutral-500"
      >
        {formatDate(attendee.purchasedAt)}
      </time>
    </td>
    <td className="px-4 py-3 whitespace-nowrap">
      <span className="inline-flex items-center gap-1 text-xs font-semibold dark:text-sky-400 text-sky-600 dark:bg-sky-500/10 bg-sky-50 px-2 py-0.5 rounded-full">
        {attendee.totalTickets} ticket{attendee.totalTickets !== 1 ? 's' : ''}
      </span>
    </td>
  </motion.tr>
)

// ── Event section ─────────────────────────────────────────────────────────────
const EventSection = ({ group, searchQuery }: { group: EventGroup; searchQuery: string }) => {
  const [collapsed, setCollapsed] = useState(false)

  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) return group.attendees
    const q = searchQuery.toLowerCase()
    return group.attendees.filter((a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
  }, [group.attendees, searchQuery])

  if (filteredAttendees.length === 0) return null

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
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1.5 text-xs font-semibold dark:text-neutral-400 text-neutral-600">
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            {filteredAttendees.length} attendee{filteredAttendees.length !== 1 ? 's' : ''}
          </span>
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
                    {['Name', 'Email', 'Purchased', 'Tickets'].map((col) => (
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

// ── Main component ────────────────────────────────────────────────────────────
export const CapsuleManifestClient = ({ data }: { data: IOrder[] }) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Group orders by event
  const eventGroups = useMemo<EventGroup[]>(() => {
    const map = new Map<string, EventGroup>()

    data.forEach((order) => {
      const event = order.event ?? order.orderItems?.[0]?.ticket?.event ?? null
      const eventId = order.eventId ?? event?.id ?? 'unknown'
      const eventName = event?.title ?? 'Unknown Event'
      const eventDate = event?.date ?? null
      const totalTickets = order.orderItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

      if (!map.has(eventId)) {
        map.set(eventId, { eventId, eventName, eventDate, attendees: [] })
      }

      map.get(eventId)!.attendees.push({
        orderId: order.id,
        name: order.customerName,
        email: order.customerEmail,
        purchasedAt: order.createdAt,
        totalTickets
      })
    })

    // Sort groups by event date descending, attendees by purchase date descending
    return Array.from(map.values())
      .sort((a, b) => {
        if (!a.eventDate) return 1
        if (!b.eventDate) return -1
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      })
      .map((g) => ({
        ...g,
        attendees: g.attendees.sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
      }))
  }, [data])

  const totalAttendees = eventGroups.reduce((sum, g) => sum + g.attendees.length, 0)
  const totalEvents = eventGroups.length

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col min-w-0">
      <div className="flex-1 overflow-y-auto px-3 sm:px-8 pb-6 pt-4">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Stats */}
          <div className="overflow-x-auto pb-1">
            <div className="flex items-center gap-4 min-w-max">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Events
                </span>
                <span className="text-sm font-black dark:text-white text-neutral-900">{totalEvents}</span>
              </div>
              <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Attendees
                </span>
                <span className="text-sm font-black text-sky-600 dark:text-sky-400">{totalAttendees}</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search attendees by name or email"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Event groups */}
          {eventGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400"
              role="status"
              aria-live="polite"
            >
              <Users className="w-12 h-12 mb-3 opacity-30" aria-hidden="true" />
              <p className="text-lg font-medium">No attendees yet</p>
              <p className="text-sm">Ticket purchases will appear here</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {eventGroups.map((group) => (
                <EventSection key={group.eventId} group={group} searchQuery={searchQuery} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CapsuleManifestClient
