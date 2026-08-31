'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency.utils'

const fmtDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York'
  })

export default function SupporterTicketsClien({ data }) {
  const orders = data ?? []

  // One section per event; a supporter can buy across several orders
  const grouped: any[] = Object.values(
    orders.reduce((acc, order) => {
      const event = order.event ?? order.orderItems[0]?.ticket?.event ?? null
      const key = event?.id ?? 'no-event'

      if (!acc[key]) {
        acc[key] = { event, orders: [], totalTickets: 0, totalSpent: 0 }
      }

      acc[key].orders.push(order)
      acc[key].totalTickets += order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      acc[key].totalSpent += Number(order.totalAmount)

      return acc
    }, {})
  )

  const totalTickets = orders.reduce((sum, o) => sum + o.orderItems.reduce((s, i) => s + i.quantity, 0), 0)
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0)

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <main className="p-6 md:p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Link
              href="/supporter/overview"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 mb-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to overview
            </Link>

            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Your tickets</h1>

            {orders.length > 0 && (
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 tabular-nums">
                {totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'} · {formatCurrency(totalSpent)}
              </p>
            )}
          </motion.div>

          {orders.length === 0 ? (
            <div className="mt-8 py-16 text-center border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">You have not bought any tickets yet.</p>
              <Link
                href="/events"
                className="inline-block mt-4 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
              >
                Browse events
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              {grouped.map((group) => (
                <section key={group.event?.id ?? 'no-event'} aria-labelledby={`event-${group.event?.id ?? 'no-event'}`}>
                  <div className="flex items-baseline justify-between gap-4 pb-2.5 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="min-w-0">
                      <h2
                        id={`event-${group.event?.id ?? 'no-event'}`}
                        className="text-sm font-semibold text-neutral-900 dark:text-white truncate"
                      >
                        {group.event?.title ?? 'Other tickets'}
                      </h2>

                      {group.event?.date && (
                        <time
                          dateTime={new Date(group.event.date).toISOString()}
                          className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums"
                        >
                          {fmtDate(group.event.date)}
                        </time>
                      )}
                    </div>

                    <span className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums shrink-0">
                      {group.totalTickets} {group.totalTickets === 1 ? 'ticket' : 'tickets'} ·{' '}
                      {formatCurrency(group.totalSpent)}
                    </span>
                  </div>

                  <ul role="list" className="divide-y divide-neutral-100 dark:divide-neutral-900 list-none p-0 m-0">
                    {group.orders.map((order) => (
                      <li key={order.id} className="py-4">
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                            Ordered {fmtDate(order.createdAt)}
                            {order.status !== 'CONFIRMED' && ` · ${order.status.toLowerCase()}`}
                          </p>

                          <span className="text-[13px] font-medium text-neutral-900 dark:text-white tabular-nums shrink-0">
                            {formatCurrency(Number(order.totalAmount))}
                          </span>
                        </div>

                        <ul role="list" aria-label="Tickets in this order" className="mt-2 space-y-1.5 list-none p-0">
                          {order.orderItems.map((item) => (
                            <li key={item.id} className="flex items-baseline justify-between gap-4 text-[13px]">
                              <span className="text-neutral-500 dark:text-neutral-400 truncate">{item.ticketName}</span>

                              <span className="flex items-baseline gap-3 shrink-0 tabular-nums">
                                <span className="text-neutral-400 dark:text-neutral-600">
                                  ×{item.quantity} @ {formatCurrency(Number(item.pricePerUnit ?? 0))}
                                </span>
                                <span className="text-neutral-500 dark:text-neutral-400 w-20 text-right">
                                  {formatCurrency(Number(item.totalPrice ?? 0))}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
