'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, ChevronRight, Ticket } from 'lucide-react'
import { MotionLink } from '../../../../components/_shared/MotionLink'
import { containerVariants, itemVariants } from '@/lib/constants/motion'

const SupporterTicketsClient = ({ data }) => {
  // Group orders by event
  const grouped = Object.values(
    data.reduce((acc, order) => {
      const event = order.event ?? order.orderItems[0]?.ticket?.event ?? null
      const key = event?.id ?? 'no-event'

      if (!acc[key]) {
        acc[key] = {
          event,
          orders: [],
          totalTickets: 0,
          totalSpent: 0
        }
      }

      acc[key].orders.push(order)
      acc[key].totalTickets += order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      acc[key].totalSpent += order.totalAmount

      return acc
    }, {})
  )

  const totalTickets = data?.reduce((sum, o) => sum + o.orderItems.reduce((s, i) => s + i.quantity, 0), 0)
  const totalSpent = data?.reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white">
      <main className="p-6 md:p-8 lg:p-12 space-y-10">
        <div className="max-w-334 mx-auto space-y-10">
          {/* Page header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              href="/supporter/overview"
              className="inline-flex items-center gap-1.5 text-xs font-semibold dark:text-neutral-500 text-neutral-500 hover:text-sky-600 dark:hover:text-sky-400 mb-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to Overview
            </Link>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-500 uppercase tracking-widest mb-2">
                  Supporter Portal
                </p>
                <h1 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900 leading-tight">
                  Ticket Orders
                </h1>
                <p className="dark:text-neutral-500 text-neutral-600 text-base mt-2">
                  All tickets purchased across events
                </p>
              </div>

              {/* Summary stats */}
              {data?.length > 0 && (
                <div className="hidden sm:flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-xs dark:text-neutral-600 text-neutral-500 uppercase tracking-wider font-semibold">
                      Total Tickets
                    </p>
                    <p className="text-2xl font-black dark:text-white text-neutral-900">{totalTickets}</p>
                  </div>
                  <div className="w-px h-10 dark:bg-neutral-800 bg-neutral-200" aria-hidden="true" />
                  <div className="text-right">
                    <p className="text-xs dark:text-neutral-600 text-neutral-500 uppercase tracking-wider font-semibold">
                      Total Spent
                    </p>
                    <p className="text-2xl font-black dark:text-white text-neutral-900 tabular-nums">
                      $
                      {totalSpent?.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Empty state */}
          {data?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="dark:bg-neutral-900/30 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-16 text-center"
            >
              <div
                className="w-14 h-14 rounded-full dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center mx-auto mb-4"
                aria-hidden="true"
              >
                <Ticket className="w-7 h-7 dark:text-neutral-600 text-neutral-400" />
              </div>
              <p className="dark:text-neutral-300 text-neutral-700 font-bold text-lg">No ticket orders yet</p>
              <p className="dark:text-neutral-600 text-neutral-400 text-sm mt-1">
                Tickets you purchase will appear here
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
              >
                Browse Events
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          )}

          {/* Grouped by event */}
          {grouped.length > 0 && (
            <motion.div className="space-y-10" variants={containerVariants} initial="hidden" animate="visible">
              {grouped.map((group: any) => (
                <motion.section
                  key={group.event?.id ?? 'no-event'}
                  aria-labelledby={`event-heading-${group.event?.id ?? 'no-event'}`}
                  variants={itemVariants}
                  className="space-y-4"
                >
                  {/* Event header */}
                  <div className="flex items-start justify-between gap-4 pb-3 border-b dark:border-neutral-800 border-neutral-200">
                    <div className="flex items-start gap-3">
                      <div
                        className="shrink-0 w-10 h-10 rounded-xl dark:bg-sky-500/10 bg-sky-50 flex items-center justify-center mt-0.5"
                        aria-hidden="true"
                      >
                        <Calendar className="w-5 h-5 text-sky-500" />
                      </div>
                      <div>
                        <h2
                          id={`event-heading-${group.event?.id ?? 'no-event'}`}
                          className="text-lg font-black dark:text-white text-neutral-900"
                        >
                          {group.event?.title ?? 'Unknown Event'}
                        </h2>
                        {group.event?.date && (
                          <time
                            dateTime={new Date(group.event.date).toISOString()}
                            className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5 block"
                          >
                            {new Date(group.event.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        )}
                      </div>
                    </div>

                    {/* Event summary */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold dark:text-sky-400 text-sky-600 dark:bg-sky-500/10 bg-sky-50 px-3 py-1.5 rounded-lg">
                        {group.totalTickets} ticket{group.totalTickets !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs font-semibold dark:text-neutral-400 text-neutral-600 dark:bg-neutral-800 bg-neutral-100 px-3 py-1.5 rounded-lg tabular-nums">
                        $
                        {group.totalSpent?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Orders for this event */}
                  <ul role="list" className="space-y-3 list-none p-0 m-0">
                    {group.orders.map((order) => (
                      <li key={order.id}>
                        <MotionLink
                          href={`/order-confirmation/${order.id}`}
                          aria-label={`Order of $${order.totalAmount.toFixed(2)} placed on ${new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — view confirmation`}
                          className="group/item block dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                          variants={itemVariants}
                          whileHover={{ x: 4 }}
                        >
                          {/* Order meta */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
                                aria-hidden="true"
                              >
                                <Ticket className="w-4 h-4 text-sky-400" />
                              </div>
                              <div>
                                <p className="dark:text-white text-neutral-900 font-bold text-sm tabular-nums">
                                  $
                                  {order.totalAmount?.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })}
                                </p>
                                <p className="text-xs dark:text-neutral-600 text-neutral-500">
                                  Order placed{' '}
                                  <time dateTime={new Date(order.createdAt).toISOString()}>
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </time>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium dark:text-neutral-500 dark:bg-neutral-800/50 text-neutral-600 bg-neutral-200 px-2.5 py-1 rounded-md">
                                {order.status === 'CONFIRMED' ? 'Confirmed' : order.status}
                              </span>
                              <ChevronRight
                                className="w-4 h-4 dark:text-neutral-600 text-neutral-400 group-hover/item:text-sky-500 group-hover/item:translate-x-0.5 transition-all"
                                aria-hidden="true"
                              />
                            </div>
                          </div>

                          {/* Ticket line items */}
                          <ul
                            role="list"
                            aria-label="Tickets in this order"
                            className="space-y-2 list-none p-0 m-0 border-t dark:border-neutral-800 border-neutral-200 pt-3"
                          >
                            {order.orderItems.map((item) => (
                              <li key={item.id} className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2 min-w-0 flex-1">
                                  <div
                                    className="shrink-0 w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5"
                                    aria-hidden="true"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-sm dark:text-neutral-300 text-neutral-700 font-medium truncate">
                                      {item.ticketName}
                                    </p>
                                    {item.ticketDescription && (
                                      <p className="text-xs dark:text-neutral-600 text-neutral-400 mt-0.5 truncate">
                                        {item.ticketDescription}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                  <span
                                    className="text-xs dark:text-neutral-500 text-neutral-500"
                                    aria-label={`${item.quantity} ticket${item.quantity !== 1 ? 's' : ''} at $${item.pricePerUnit.toFixed(2)} each`}
                                  >
                                    x{item.quantity} @ $
                                    {item.pricePerUnit?.toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </span>
                                  <span className="text-sm font-bold dark:text-white text-neutral-900 tabular-nums min-w-15 text-right">
                                    $
                                    {item.totalPrice?.toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    })}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </MotionLink>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SupporterTicketsClient
