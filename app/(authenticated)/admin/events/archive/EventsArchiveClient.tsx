'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Archive, Calendar, MapPin, Ticket, Users } from 'lucide-react'
import { IEvent } from '@/types/entities/event'
import { formatCurrency } from '@/lib/utils/currency.utils'
import StatChip from '../../../../../components/_shared/StatChip'

type ArchivedEventOrder = {
  totalAmount: number
  orderItems: { quantity: number }[]
}

export type ArchivedEvent = Omit<IEvent, 'orders'> & {
  orders: ArchivedEventOrder[]
  _count: { attendees: number }
}

// ── Event row ─────────────────────────────────────────────────────────────────
const ArchiveEventRow = ({ event, index }: { event: ArchivedEvent; index: number }) => {
  const ticketsSold =
    event.orders?.reduce((sum, o) => sum + (o.orderItems?.reduce((s, i) => s + i.quantity, 0) ?? 0), 0) ??
    event.attendeeCount ??
    0

  const revenue = event.orders?.reduce((sum, o) => sum + o.totalAmount, 0) ?? 0
  const attendees = event._count?.attendees ?? event.attendeeCount ?? 0

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
    >
      {/* Event name */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
            aria-hidden="true"
          >
            <Archive className="w-4 h-4 dark:text-neutral-500 text-neutral-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold dark:text-neutral-200 text-neutral-800 truncate max-w-56">{event.title}</p>
            {event.category && (
              <p className="text-xs dark:text-neutral-600 text-neutral-400 capitalize mt-0.5">{event.category}</p>
            )}
          </div>
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-xs dark:text-neutral-400 text-neutral-600">
          <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <time dateTime={new Date(event.date).toISOString()}>
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </time>
        </div>
      </td>

      {/* Location */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-xs dark:text-neutral-400 text-neutral-600 max-w-40">
          <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{event.location ?? '—'}</span>
        </div>
      </td>

      {/* Tickets sold */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Ticket className="w-3.5 h-3.5 dark:text-neutral-600 text-neutral-400 shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold dark:text-neutral-300 text-neutral-700 tabular-nums">
            {ticketsSold}
          </span>
        </div>
      </td>

      {/* Revenue */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
          {formatCurrency(revenue)}
        </span>
      </td>

      {/* Attendees */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 dark:text-neutral-600 text-neutral-400 shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold dark:text-neutral-300 text-neutral-700 tabular-nums">{attendees}</span>
        </div>
      </td>
    </motion.tr>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export const EventsArchiveClient = ({ data }: { data: ArchivedEvent[] }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return data
    const q = searchQuery.toLowerCase()
    return data.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q)
    )
  }, [data, searchQuery])

  const totalRevenue = data.reduce((sum, e) => sum + (e.orders?.reduce((s, o) => s + o.totalAmount, 0) ?? 0), 0)
  const totalTickets = data.reduce(
    (sum, e) =>
      sum +
      (e.orders?.reduce((s, o) => s + (o.orderItems?.reduce((si, i) => si + i.quantity, 0) ?? 0), 0) ??
        e.attendeeCount ??
        0),
    0
  )

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col min-w-0">
      <div className="flex-1 overflow-y-auto px-3 sm:px-8 pb-6 pt-4">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Stats */}
          <div className="overflow-x-auto pb-1">
            <div className="flex items-center gap-4 min-w-max">
              <StatChip label="Archived" value={data.length.toString()} />
              <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />
              <StatChip label="Total Revenue" value={formatCurrency(totalRevenue)} color="emerald" />
              <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />
              <StatChip label="Tickets Sold" value={totalTickets.toString()} color="sky" />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search archived events by name, location, or category"
              placeholder="Search by name, location, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400"
              role="status"
              aria-live="polite"
            >
              <Archive className="w-12 h-12 mb-3 opacity-30" aria-hidden="true" />
              <p className="text-lg font-medium">No archived events</p>
              <p className="text-sm">
                {searchQuery ? 'Try adjusting your search' : 'Archived events will appear here'}
              </p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
              <table className="w-full min-w-160 border-collapse" aria-label="Archived events">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                    {['Event', 'Date', 'Location', 'Tickets Sold', 'Revenue', 'Attendees'].map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {filtered.map((event, i) => (
                      <ArchiveEventRow key={event.id} event={event} index={i} />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventsArchiveClient
