import { MotionLink } from '@/components/_shared/MotionLink'
import { containerVariants, itemVariants } from '@/lib/constants/motion'
import { motion } from 'framer-motion'
import { Calendar, ChevronRight, Link, Ticket } from 'lucide-react'

export function TicketOrders({ dashboard }) {
  if (dashboard?.ticketOrders?.length <= 0) return

  return (
    <motion.section
      aria-labelledby="tickets-heading"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <motion.div className="space-y-4" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h2 id="tickets-heading" className="text-xl font-black dark:text-white text-neutral-900">
              Ticket Orders
            </h2>
            <p className="text-xs dark:text-neutral-600 text-neutral-500 mt-0.5">Your purchased tickets</p>
          </div>
          <Link
            href="/supporter/tickets"
            className="inline-flex items-center gap-1.5 dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-500 font-semibold text-sm transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        <ul role="list" className="space-y-4 list-none p-0 m-0">
          {dashboard?.ticketOrders.map((order) => {
            // Fall back to ticket's event if order.event is null
            const event = order.event ?? order.orderItems[0]?.ticket?.event ?? null
            return (
              <li key={order.id}>
                <MotionLink
                  href={`/order-confirmation/${order.id}`}
                  aria-label={`Ticket order${event ? ` for ${event.name}` : ''}, $${order.totalAmount.toFixed(2)}, placed ${new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  className="group/item block dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                >
                  {/* Event header — shown when event is available */}
                  {event && (
                    <div className="flex items-start gap-3 mb-3 pb-3 border-b dark:border-neutral-800 border-neutral-200">
                      <div
                        className="shrink-0 w-9 h-9 rounded-lg dark:bg-sky-500/10 bg-sky-50 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <Calendar className="w-4 h-4 text-sky-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="dark:text-white text-neutral-900 font-bold text-sm truncate">{event.title}</p>
                        {event.date && (
                          <time
                            dateTime={new Date(event.date).toISOString()}
                            className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5 block"
                          >
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        )}
                      </div>
                      <span className="text-xs font-medium dark:text-sky-400 text-sky-600 dark:bg-sky-500/10 bg-sky-50 px-2.5 py-1 rounded-md shrink-0">
                        {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} ticket
                        {order.orderItems.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {/* Order meta row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="shrink-0 w-9 h-9 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <Ticket className="w-4 h-4 text-sky-400" />
                      </div>
                      <div>
                        <p className="dark:text-white text-neutral-900 font-semibold text-sm">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs dark:text-neutral-600 text-neutral-500">
                          <time dateTime={new Date(order.createdAt).toISOString()}>
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric'
                            })}
                          </time>
                        </p>
                      </div>
                    </div>
                    {/* Only show ticket count badge here if no event header above */}
                    {!event && (
                      <span className="text-xs font-medium dark:text-sky-400 text-sky-600 dark:bg-neutral-800/50 bg-sky-100 px-3 py-1 rounded-md shrink-0">
                        {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} ticket
                        {order.orderItems.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Ticket line items */}
                  <ul
                    role="list"
                    aria-label="Tickets in this order"
                    className="space-y-2 list-none p-0 m-0 border-t dark:border-neutral-800 border-neutral-200 pt-3"
                  >
                    {order?.orderItems.map((item) => (
                      <li key={item.id} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-sky-400" aria-hidden="true" />
                            <p className="text-sm dark:text-neutral-300 text-neutral-700 truncate">{item.ticketName}</p>
                            {order?.event?.showRaffleTicketNumbers &&
                              item.raffleTicketNumber &&
                              item.raffleTicketCode && (
                                <div className="pl-3.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400 bg-sky-50 border-sky-200 text-sky-700 border">
                                    #{String(item.raffleTicketNumber).padStart(4, '0')}
                                  </span>
                                </div>
                              )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <span
                              className="text-xs dark:text-neutral-500 text-neutral-500"
                              aria-label={`Quantity: ${item.quantity}`}
                            >
                              x{item.quantity}
                            </span>
                            <span className="text-sm font-semibold dark:text-white text-neutral-900 tabular-nums">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </MotionLink>
              </li>
            )
          })}
        </ul>
      </motion.div>
    </motion.section>
  )
}
