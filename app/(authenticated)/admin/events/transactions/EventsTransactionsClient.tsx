'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { IOrder } from '@/types/entities/order'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'
import { TicketOrderDrawer } from '@/app/(authenticated)/admin/events/transactions/_components/TicketOrderDrawer'
import { TicketOrderRow } from './_components/TicketOrderRow'

const thCls = 'text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-wider py-2 pr-4'

export default function EventsTransactionsClient({ data }: { data: IOrder[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [eventFilter, setEventFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [order, setOrder] = useState<IOrder | null>(null)

  const events = useMemo(() => {
    const map = new Map<string, string>()
    data.forEach((o) => {
      if (o.eventId && o.event?.title) map.set(o.eventId, o.event.title)
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [data])

  const filtered = useMemo(
    () =>
      data.filter((o) => {
        if (eventFilter !== 'all' && o.eventId !== eventFilter) return false

        const q = searchQuery.trim().toLowerCase()
        if (!q) return true

        return (
          o.customerEmail?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.id?.toLowerCase().includes(q) ||
          o.paymentIntentId?.toLowerCase().includes(q)
        )
      }),
    [data, searchQuery, eventFilter]
  )

  const totalRevenue = filtered.reduce((sum, o) => sum + Number(o.totalAmount), 0)
  const totalTickets = filtered.reduce((sum, o) => sum + (o.orderItems?.reduce((s, i) => s + i.quantity, 0) ?? 0), 0)

  const isFiltered = eventFilter !== 'all' || searchQuery.trim().length > 0

  return (
    <>
      <TicketOrderDrawer order={order} open={open} onClose={() => setOpen(false)} />

      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <AdminPageHeader
          title="Ticket Transactions"
          meta={`${filtered.length} ${filtered.length === 1 ? 'order' : 'orders'} · ${formatCurrency(totalRevenue)} · ${totalTickets} tickets`}
        />

        <div className="px-6 py-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search ticket orders by name, email, or ID"
                placeholder="Search name, email, or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>

            {events.length > 0 && (
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                aria-label="Filter by event"
                className="py-1.5 pl-2.5 pr-8 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 max-w-56 truncate"
              >
                <option value="all">All events</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            )}

            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setEventFilter('all')
                }}
                className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-sm" aria-label="Ticket purchase orders">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th scope="col" className={`text-right ${thCls}`}>
                    Amount
                  </th>
                  {['Name', 'Email', 'Event', 'Qty', 'Date', 'Status'].map((col) => (
                    <th key={col} scope="col" className={`text-left ${thCls}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600"
                      role="status"
                      aria-live="polite"
                    >
                      {isFiltered ? 'No orders match these filters.' : 'Ticket orders will appear here.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((order, i) => (
                    <TicketOrderRow key={order.id} order={order} index={i} onOpen={setOpen} setOrder={setOrder} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
