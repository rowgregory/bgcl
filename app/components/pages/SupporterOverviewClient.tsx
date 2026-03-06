'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ArrowRight, Calendar, ChevronRight, CreditCard, Heart, Rocket, Ticket, TrendingUp } from 'lucide-react'
import { MotionLink } from '../common/MotionLink'
import Picture from '../common/Picture'
import LogoutButton from '../buttons/LogoutButton'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

const SupporterOverviewClient = ({ data }) => {
  const hasActivity = data.recentDonations.length > 0 || data.upcomingEvents.length > 0
  const session = useSession()

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white">
      {/* Header */}
      <header className="px-6 md:px-8 lg:px-12 pb-4 pt-6 md:pt-8 dark:border-neutral-800 border-neutral-200 border-b">
        <div className="max-w-334 mx-auto flex items-center justify-between">
          <MotionLink
            href="/"
            aria-label="Boys & Girls Club of Lynn — home"
            className="flex space-x-3 w-28 h-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            <Picture
              src="/images/vertical-logo-light.png"
              alt="Boys & Girls Club of Lynn"
              className="dark:hidden block w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
              priority
            />
            <Picture
              src="/images/vertical-logo-dark.png"
              alt="Boys & Girls Club of Lynn"
              className="dark:block hidden w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
              priority
            />
          </MotionLink>
          <div className="flex items-center gap-x-3">
            {/* Profile */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-100 border-neutral-200 border rounded-lg">
              <div
                className="shrink-0 w-6 h-6 rounded-full bg-sky-600 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-white text-xs font-bold leading-none">
                  {(session.data?.user?.email?.[0] ?? '?').toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-medium dark:text-neutral-400 text-neutral-600 max-w-40 truncate">
                {session.data?.user?.email}
              </p>
            </div>
            {(session?.data?.user?.role === 'ADMIN' ||
              session?.data?.user?.role === 'PROGRAM' ||
              session?.data?.user?.role === 'SUPERUSER') && (
              <MotionLink
                href="/auth/login"
                aria-label="Go to admin dashboard"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 bg-neutral-200 border-neutral-300 hover:bg-neutral-300 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Rocket className="w-5 h-5 dark:text-zinc-400 text-neutral-700" aria-hidden="true" />
              </MotionLink>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="p-6 md:p-8 lg:p-12 space-y-10">
        <div className="max-w-334 mx-auto space-y-10">
          {/* Page header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-500 uppercase tracking-widest mb-2">
                  Your Impact
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black dark:text-white text-neutral-900 leading-tight">
                  Welcome, {session.data?.user?.name ?? session.data?.user?.email}
                </h1>
                <p className="dark:text-neutral-500 text-neutral-600 text-base mt-2">
                  {hasActivity
                    ? `Here's what you've accomplished with Boys & Girls Club of Lynn`
                    : 'Start making a difference with a donation or event registration'}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
                <Link
                  href="/supporter/saved-cards"
                  className="dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <CreditCard className="w-4 h-4" aria-hidden="true" />
                  Saved Cards
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {data.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="group relative dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-4 overflow-hidden dark:hover:border-neutral-700 hover:border-neutral-300 transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                >
                  <div
                    className="absolute inset-0 dark:bg-linear-to-br dark:from-sky-500/5 dark:to-transparent bg-linear-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />
                  <div className="relative space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <dt className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-1.5 truncate">
                          {stat.label}
                        </dt>
                        <dd className="text-xl lg:text-2xl font-black dark:text-white text-neutral-900">
                          {stat.value}
                        </dd>
                      </div>
                      <div
                        className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800/50 dark:group-hover:bg-sky-500/20 bg-neutral-200 group-hover:bg-sky-500/20 flex items-center justify-center transition-colors duration-300"
                        aria-hidden="true"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                    </div>
                    <p className="text-xs dark:text-neutral-600 text-neutral-500">{stat.subtext}</p>
                  </div>
                </motion.div>
              ))}
            </dl>
          </motion.div>

          {/* Compact CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/donate"
              aria-label="Make a donation to Boys & Girls Club of Lynn"
              className="flex-1 flex items-center justify-between gap-3 px-5 py-4 bg-sky-600 hover:bg-sky-500 rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Make a Donation</p>
                  <p className="text-sky-100 text-xs">Support our mission</p>
                </div>
              </div>
              <ArrowRight
                className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/events"
              aria-label="Browse upcoming events"
              className="flex-1 flex items-center justify-between gap-3 px-5 py-4 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-200 border rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg dark:bg-neutral-700 bg-neutral-200 flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Calendar className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <p className="dark:text-neutral-200 text-neutral-800 font-bold text-sm">Explore Events</p>
                  <p className="dark:text-neutral-400 text-neutral-500 text-xs">Browse & register</p>
                </div>
              </div>
              <ChevronRight
                className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform shrink-0"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          {/* Activity Grid */}
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
                      Donation History
                    </h2>
                    <p className="text-xs dark:text-neutral-600 text-neutral-500 mt-0.5">Your contributions</p>
                  </div>
                  {data.recentDonations.length > 0 && (
                    <Link
                      href="/supporter/donations"
                      className="inline-flex items-center gap-1.5 dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-500 font-semibold text-sm transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                    >
                      View All
                      <ChevronRight
                        className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  )}
                </div>

                {data.recentDonations.length === 0 ? (
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
                    {data.recentDonations.map((donation) => (
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

                {data.upcomingEvents.length === 0 ? (
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
                    {data.upcomingEvents.map((order) => {
                      const event = order.event ?? order.orderItems[0]?.ticket?.event
                      return (
                        <li key={order.id}>
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
                                  {event?.title || 'Event'}
                                </p>
                                {event?.date ? (
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
                                ) : (
                                  <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-0.5">Date TBA</p>
                                )}
                              </div>
                            </div>

                            {/* Tickets */}
                            <ul
                              role="list"
                              aria-label={`Tickets for ${event?.name || 'this event'}`}
                              className="space-y-1.5 list-none p-0 m-0 border-t dark:border-neutral-800 border-neutral-200 pt-3"
                            >
                              {order.orderItems.map((item) => (
                                <li key={item.id} className="flex items-center justify-between">
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
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </motion.div>
            </motion.section>
          </div>

          {/* Ticket Orders */}
          {data.ticketOrders?.length > 0 && (
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
                    <ChevronRight
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                <ul role="list" className="space-y-4 list-none p-0 m-0">
                  {data.ticketOrders.map((order) => {
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
                                <p className="dark:text-white text-neutral-900 font-bold text-sm truncate">
                                  {event.title}
                                </p>
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
                                      year: 'numeric'
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
                            {order.orderItems.map((item) => (
                              <li key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-sky-400" aria-hidden="true" />
                                  <p className="text-sm dark:text-neutral-300 text-neutral-700 truncate">
                                    {item.ticketName}
                                  </p>
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
          )}
        </div>
      </main>
    </div>
  )
}

export default SupporterOverviewClient
