'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Ticket, Tag } from 'lucide-react'
import { IOrder } from '@/types/entities/order'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { formatDate } from '@/lib/utils/date-utils'
import StatChip from '../_shared/StatChip'
import { setOpenTicketOrderDrawer } from '@/lib/store/slices/adminSlice'
import { store } from '@/lib/store/store'

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    PENDING: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    CANCELLED: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
    REFUNDED: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400',
    FAILED: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
  }
  return (
    <span
      role="status"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ${map[status] ?? map.PENDING}`}
    >
      {status.toLowerCase()}
    </span>
  )
}

// ── Table row ─────────────────────────────────────────────────────────────────
const TicketOrderRow = ({ order, index }: { order: IOrder; index: number }) => {
  const totalQuantity = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  const eventName = order.orderItems?.[0]?.ticket?.event?.title ?? '—'

  return (
    <motion.tr
      onClick={() => store.dispatch(setOpenTicketOrderDrawer(order))}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors group cursor-pointer"
    >
      {/* Amount */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm font-black dark:text-white text-neutral-900 tabular-nums">
          {formatCurrency(order.totalAmount)}
        </span>
      </td>

      {/* Customer name */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm font-semibold dark:text-neutral-200 text-neutral-800">{order.customerName}</span>
      </td>

      {/* Customer email */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xs dark:text-neutral-400 text-neutral-600 font-mono">{order.customerEmail}</span>
      </td>

      {/* Event */}
      <td className="px-4 py-3 whitespace-nowrap max-w-40">
        <span className="text-xs font-semibold dark:text-sky-400 text-sky-600 truncate block">{eventName}</span>
      </td>

      {/* Quantity */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="inline-flex items-center gap-1 text-xs font-semibold dark:text-neutral-400 text-neutral-600">
          <Ticket className="w-3 h-3" aria-hidden="true" />
          {totalQuantity}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <time
          dateTime={new Date(order.createdAt).toISOString()}
          className="text-xs dark:text-neutral-500 text-neutral-500"
        >
          {formatDate(order.createdAt)}
        </time>
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>
    </motion.tr>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export const EventsTransactionsClient = ({ data }: { data: IOrder[] }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [eventFilter, setEventFilter] = useState<string>('all')

  // Derive unique events from orders
  const events = useMemo(() => {
    const map = new Map<string, string>()
    data.forEach((o) => {
      const id = o.eventId
      const name = o.event?.title
      if (id && name) map.set(id, name)
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [data])

  const filtered = useMemo(
    () =>
      data.filter((o) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          if (
            !o.customerEmail?.toLowerCase().includes(q) &&
            !o.customerName?.toLowerCase().includes(q) &&
            !o.id?.toLowerCase().includes(q) &&
            !o.paymentIntentId?.toLowerCase().includes(q)
          )
            return false
        }
        if (eventFilter !== 'all' && o.eventId !== eventFilter) return false
        return true
      }),
    [data, searchQuery, eventFilter]
  )

  const totalRevenue = filtered.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalTickets = filtered.reduce((sum, o) => sum + (o.orderItems?.reduce((s, i) => s + i.quantity, 0) ?? 0), 0)

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col min-w-0">
      <div className="flex-1 overflow-y-auto px-3 sm:px-8 pb-6 pt-4">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Stats */}
          <div className="overflow-x-auto pb-1">
            <div className="flex items-center gap-4 min-w-max">
              <StatChip label="Orders" value={filtered.length.toString()} />
              <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />
              <StatChip label="Revenue" value={formatCurrency(totalRevenue)} color="emerald" />
              <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />
              <StatChip label="Tickets" value={totalTickets.toString()} color="sky" />
            </div>
          </div>

          {/* Filters + search */}
          <div className="space-y-2">
            <div className="overflow-x-auto pb-1">
              <div className="flex items-center gap-2 min-w-max">
                {/* Event filter */}
                {events.length > 0 && (
                  <div className="flex items-center gap-0.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => setEventFilter('all')}
                      aria-pressed={eventFilter === 'all'}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                        eventFilter === 'all'
                          ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                    >
                      <Tag className="w-3 h-3" aria-hidden="true" /> All Events
                    </button>
                    {events.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setEventFilter(e.id)}
                        aria-pressed={eventFilter === e.id}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all max-w-36 truncate whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                          eventFilter === e.id
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                      >
                        {e.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search ticket orders by name, email, or ID"
                placeholder="Search by name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
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
              <Ticket className="w-12 h-12 mb-3 opacity-30" aria-hidden="true" />
              <p className="text-lg font-medium">No ticket orders found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
              <table className="w-full min-w-160 border-collapse" aria-label="Ticket purchase orders">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                    {['Amount', 'Name', 'Email', 'Event', 'Qty', 'Date', 'Status'].map((col) => (
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
                    {filtered.map((order, i) => (
                      <TicketOrderRow key={order.id} order={order} index={i} />
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

export default EventsTransactionsClient
