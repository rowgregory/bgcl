'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Ticket, Tag } from 'lucide-react'
import { IOrder } from '@/types/entities/order'
import { formatCurrency } from '@/lib/utils/currency.utils'
import StatChip from '@/components/_shared/StatChip'
import { TicketOrderDrawer } from '@/app/(authenticated)/admin/events/transactions/_components/TicketOrderDrawer'
import { TicketOrderRow } from './_components/TicketOrderRow'

export default function EventsTransactionsClient({ data }: { data: IOrder[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [eventFilter, setEventFilter] = useState<string>('all')
  const [open, setOpen] = useState(false)
  const [order, setOrder] = useState<IOrder>(null)

  const onClose = () => setOpen(false)

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
    <>
      <TicketOrderDrawer order={order} open={open} onClose={onClose} />

      <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto px-3 sm:px-8 pb-6 pt-4">
          <div className="space-y-4">
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
                        <TicketOrderRow key={order.id} order={order} index={i} onOpen={setOpen} setOrder={setOrder} />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
