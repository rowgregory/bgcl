'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Event } from '@prisma/client'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'

type ArchivedEventOrder = {
  totalAmount: number
  orderItems: { quantity: number }[]
}

export type ArchivedEvent = Omit<Event, 'orders'> & {
  orders: ArchivedEventOrder[]
  _count: { attendees: number }
}

const thCls =
  'py-2 pr-4 text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-wider whitespace-nowrap'

const ticketsFor = (event: ArchivedEvent) =>
  event.orders?.reduce((sum, o) => sum + (o.orderItems?.reduce((s, i) => s + i.quantity, 0) ?? 0), 0) ??
  event.attendeeCount ??
  0

const revenueFor = (event: ArchivedEvent) => event.orders?.reduce((sum, o) => sum + Number(o.totalAmount), 0) ?? 0

function ArchiveEventRow({ event }: { event: ArchivedEvent }) {
  const attendees = event._count?.attendees ?? event.attendeeCount ?? 0

  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
      <td className="py-3 pr-4">
        <p className="text-neutral-900 dark:text-white truncate max-w-56">{event.title}</p>
        {event.category && (
          <p className="text-xs text-neutral-400 dark:text-neutral-600 capitalize mt-0.5">{event.category}</p>
        )}
      </td>

      <td className="py-3 pr-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400 tabular-nums">
        <time dateTime={new Date(event.date).toISOString()}>
          {new Date(event.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'America/New_York'
          })}
        </time>
      </td>

      <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 max-w-40 truncate">{event.location ?? '—'}</td>

      <td className="py-3 pr-4 text-right text-neutral-500 dark:text-neutral-400 tabular-nums">
        {ticketsFor(event).toLocaleString()}
      </td>

      <td className="py-3 pr-4 text-right text-neutral-500 dark:text-neutral-400 tabular-nums">
        {attendees.toLocaleString()}
      </td>

      <td className="py-3 text-right font-medium text-neutral-900 dark:text-white tabular-nums">
        {formatCurrency(revenueFor(event))}
      </td>
    </tr>
  )
}

export default function EventsArchiveClient({ data }: { data: ArchivedEvent[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return data

    return data.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q)
    )
  }, [data, searchQuery])

  const totalRevenue = filtered.reduce((sum, e) => sum + revenueFor(e), 0)
  const totalTickets = filtered.reduce((sum, e) => sum + ticketsFor(e), 0)

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader
        title="Archive"
        meta={`${filtered.length} ${filtered.length === 1 ? 'event' : 'events'} · ${totalTickets.toLocaleString()} tickets · ${formatCurrency(totalRevenue)}`}
      />

      <div className="px-6 py-6 lg:px-8">
        <div className="relative w-full sm:w-72 mb-5">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search archived events by name, location, or category"
            placeholder="Search name, location, or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-sm" aria-label="Archived events">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th scope="col" className={`text-left ${thCls}`}>
                  Event
                </th>
                <th scope="col" className={`text-left ${thCls}`}>
                  Date
                </th>
                <th scope="col" className={`text-left ${thCls}`}>
                  Location
                </th>
                <th scope="col" className={`text-right ${thCls}`}>
                  Tickets
                </th>
                <th scope="col" className={`text-right ${thCls}`}>
                  Attendees
                </th>
                <th scope="col" className={`text-right ${thCls} pr-0`}>
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600"
                    role="status"
                    aria-live="polite"
                  >
                    {searchQuery
                      ? 'No archived events match your search.'
                      : 'Past events will appear here once archived.'}
                  </td>
                </tr>
              ) : (
                filtered.map((event) => <ArchiveEventRow key={event.id} event={event} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
