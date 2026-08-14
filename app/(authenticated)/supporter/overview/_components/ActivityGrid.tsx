import { MotionLink } from '@/components/_shared/MotionLink'
import { containerVariants, itemVariants } from '@/lib/constants/motion'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, ChevronRight, Heart } from 'lucide-react'
import Link from 'next/link'

export function ActivityGrid({ dashboard }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Donation History */}
      <motion.section
        aria-labelledby="donations-heading"
        className="lg:col-span-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h2 id="donations-heading" className="text-xl font-black dark:text-white text-neutral-900">
                Donations
              </h2>
              <p className="text-xs dark:text-neutral-600 text-neutral-500 mt-0.5">
                View history and manage recurring donations
              </p>
            </div>
            {dashboard?.recentDonations.length > 0 && (
              <Link
                href="/supporter/donations"
                className="inline-flex items-center gap-1.5 dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-500 font-semibold text-sm transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                Manage
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            )}
          </div>

          {dashboard?.recentDonations.length === 0 ? (
            <div className="dark:bg-neutral-900/30 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-8 text-center">
              <div
                className="w-10 h-10 rounded-full dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center mx-auto mb-3"
                aria-hidden="true"
              >
                <Heart className="w-5 h-5 dark:text-neutral-600 text-neutral-400" />
              </div>
              <p className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">No donations yet</p>
              <p className="dark:text-neutral-600 text-neutral-400 text-xs mt-1">
                Your donation history will appear here
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-1.5 mt-4 text-sky-600 dark:text-sky-400 hover:text-sky-500 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                Make your first donation
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <ul role="list" className="space-y-2 list-none p-0 m-0">
              {dashboard?.recentDonations.map((donation) => (
                <li key={donation.id}>
                  <MotionLink
                    href={`/order-confirmation/${donation.id}`}
                    aria-label={`${donation.type === 'ONE_TIME_DONATION' ? 'One-time' : donation.recurringFrequency === 'monthly' ? 'Monthly' : 'Yearly'} donation of $${donation.totalAmount.toFixed(2)} on ${new Date(donation.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                    className="group/item block dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="shrink-0 w-9 h-9 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <Heart className="w-4 h-4 text-sky-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="dark:text-white text-neutral-900 font-semibold text-sm">
                            ${donation.totalAmount.toFixed(2)}
                          </p>
                          <p className="text-xs dark:text-neutral-600 text-neutral-500">
                            <time dateTime={new Date(donation.createdAt).toISOString()}>
                              {new Date(donation.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </time>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium dark:text-neutral-500 dark:bg-neutral-800/50 text-neutral-600 bg-neutral-200 px-2.5 py-1 rounded-md shrink-0">
                        {donation.type === 'ONE_TIME_DONATION'
                          ? 'One-time'
                          : donation.recurringFrequency === 'monthly'
                            ? 'Monthly'
                            : 'Yearly'}
                      </span>
                    </div>
                  </MotionLink>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </motion.section>

      {/* Upcoming Events */}
      <motion.section
        aria-labelledby="events-heading"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div className="space-y-4" variants={itemVariants}>
          <div>
            <h2 id="events-heading" className="text-xl font-black dark:text-white text-neutral-900">
              Events
            </h2>
            <p className="text-xs dark:text-neutral-600 text-neutral-500 mt-0.5">Your registrations</p>
          </div>

          {dashboard?.upcomingEvents.length === 0 ? (
            <div className="dark:bg-neutral-900/30 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-8 text-center">
              <div
                className="w-10 h-10 rounded-full dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center mx-auto mb-3"
                aria-hidden="true"
              >
                <Calendar className="w-5 h-5 dark:text-neutral-600 text-neutral-400" />
              </div>
              <p className="dark:text-neutral-400 text-neutral-600 text-sm font-medium">No upcoming events</p>
              <p className="dark:text-neutral-600 text-neutral-400 text-xs mt-1">
                Events you register for will appear here
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 mt-4 text-sky-600 dark:text-sky-400 hover:text-sky-500 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                Browse events
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <ul role="list" className="space-y-3 list-none p-0 m-0">
              {dashboard?.upcomingEvents?.map((group) => (
                <li key={group.eventId}>
                  <motion.div
                    className="dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                  >
                    {/* Event info */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <Calendar className="w-4 h-4 text-sky-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="dark:text-white text-neutral-900 font-semibold text-sm truncate">
                          {group.event?.title || 'Event'}
                        </p>
                        {group.event?.date ? (
                          <time
                            dateTime={new Date(group.event.date).toISOString()}
                            className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5 block"
                          >
                            {new Date(group.event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        ) : (
                          <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">Date TBA</p>
                        )}
                      </div>
                    </div>

                    {/* Tickets */}
                    <ul
                      role="list"
                      aria-label={`Tickets for ${group.event?.title || 'this event'}`}
                      className="space-y-1.5 list-none p-0 m-0 border-t dark:border-neutral-800 border-neutral-200 pt-3"
                    >
                      {group.orderItems.map((item, i) => (
                        <li key={i} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-sky-400" aria-hidden="true" />
                              <p className="text-xs dark:text-neutral-400 text-neutral-600 truncate">
                                {item.ticketName}
                              </p>
                            </div>
                            <span
                              className="text-xs dark:text-neutral-500 text-neutral-500 shrink-0 ml-2"
                              aria-label={`${item.quantity} ticket${item.quantity !== 1 ? 's' : ''}`}
                            >
                              x{item.quantity}
                            </span>
                          </div>

                          {group.event.showRaffleTicketNumbers &&
                            item.raffleTickets &&
                            item.raffleTickets.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pl-3.5">
                                {item.raffleTickets
                                  .slice()
                                  .sort((a, b) => a.number - b.number)
                                  .map((rt) => (
                                    <span
                                      key={rt.code}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400 bg-sky-50 border-sky-200 text-sky-700 border"
                                    >
                                      #{String(rt.number).padStart(4, '0')}
                                    </span>
                                  ))}
                              </div>
                            )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </motion.section>
    </div>
  )
}
