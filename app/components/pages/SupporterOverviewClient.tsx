'use client'

import { motion } from 'framer-motion'
import { Heart, Calendar, ArrowRight, TrendingUp, ChevronRight, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { containerVariants, itemVariants } from '@/app/lib/constants/motion'
import { useSession } from 'next-auth/react'
import Picture from '../common/Picture'
import { MotionLink } from '../common/MotionLink'
import LogoutButton from '../buttons/LogoutButton'

const SupporterOverviewClient = ({ data }) => {
  const hasActivity = data.recentDonations.length > 0 || data.upcomingEvents.length > 0
  const session = useSession()

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white">
      {/* Logo Section */}
      <div className="px-6 md:px-8 lg:px-12 pb-4 pt-6 md:pt-8 dark:border-neutral-800 border-neutral-200 border-b">
        {/* Logo */}
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <MotionLink href="/" className="flex space-x-3 w-28 h-auto">
            <Picture
              src="/images/vertical-logo-light.png"
              alt="Boys & Girls Club"
              className="dark:hidden block w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
              priority
            />
            <Picture
              src="/images/vertical-logo-dark.png"
              alt="Boys & Girls Club"
              className="dark:block hidden w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
              priority
            />
          </MotionLink>
          <LogoutButton />
        </div>
      </div>
      <div className="p-6 md:p-8 lg:p-12 space-y-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-500 uppercase tracking-widest mb-3">
                  Your Impact
                </p>
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 leading-tight">
                    Welcome, {session.data?.user?.name ?? session.data?.user?.email}
                  </h1>
                  <p className="dark:text-neutral-500 text-neutral-600 text-lg">
                    {hasActivity
                      ? `Here's what you've accomplished with Boys & Girls Club of Lynn`
                      : 'Start making a difference with a donation or event registration'}
                  </p>
                </div>
              </div>

              {/* Saved Cards Link */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/supporter/saved-cards">
                  <button className="dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap">
                    <CreditCard className="w-4 h-4" />
                    Saved Cards
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {data.stats.map((stat, index) => (
              <motion.div
                key={index}
                className="group relative dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-5 overflow-hidden dark:hover:border-neutral-700 hover:border-neutral-300 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 dark:bg-linear-to-br dark:from-sky-500/5 dark:to-transparent bg-linear-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-2">
                        {stat.label}
                      </p>
                      <p className="text-2xl lg:text-3xl font-black dark:text-white text-neutral-900">{stat.value}</p>
                    </div>
                    <div className="shrink-0 w-9 h-9 rounded-lg dark:bg-neutral-800/50 dark:group-hover:bg-sky-500/20 bg-neutral-200 group-hover:bg-sky-500/20 flex items-center justify-center transition-colors duration-300">
                      <TrendingUp className="w-4 h-4 text-sky-400" />
                    </div>
                  </div>
                  <p className="text-xs dark:text-neutral-600 text-neutral-500">{stat.subtext}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State or Content */}
          {!hasActivity ? (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {/* Donation CTA */}
              <motion.div variants={itemVariants}>
                <div className="space-y-4 h-full">
                  <div>
                    <h2 className="text-2xl font-black dark:text-white text-neutral-900 mb-2">Make a Donation</h2>
                    <p className="dark:text-neutral-500 text-neutral-600">
                      Support our mission to inspire and enable young people to reach their full potential. Every
                      donation makes a difference.
                    </p>
                  </div>

                  <div className="flex-1" />

                  <Link
                    href="/donate"
                    className="block dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 rounded-xl p-6 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm dark:text-sky-100 text-white font-semibold">Get Started</p>
                        <p className="text-sm dark:text-sky-200 text-sky-100 mt-1">Donate now</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                </div>
              </motion.div>

              {/* Events CTA */}
              <motion.div variants={itemVariants}>
                <div className="space-y-4 h-full">
                  <div>
                    <h2 className="text-2xl font-black dark:text-white text-neutral-900 mb-2">Explore Events</h2>
                    <p className="dark:text-neutral-500 text-neutral-600">
                      Join us for community events, programs, and activities. Register for tickets to upcoming events.
                    </p>
                  </div>

                  <div className="flex-1" />

                  <Link
                    href="/events"
                    className="block dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300 border rounded-xl p-6 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm dark:text-neutral-300 text-neutral-700 font-semibold">Get Started</p>
                        <p className="text-sm dark:text-neutral-400 text-neutral-600 mt-1">Browse events</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-sky-400 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Donations */}
              <motion.div
                className="lg:col-span-2"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
              >
                <motion.div className="space-y-6" variants={itemVariants}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black dark:text-white text-neutral-900">Donation History</h2>
                      <p className="text-sm dark:text-neutral-600 text-neutral-500 mt-1">Your contributions</p>
                    </div>
                    {data.recentDonations.length > 0 && (
                      <Link
                        href="/supporter/donations"
                        className="inline-flex items-center gap-2 dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-500 font-semibold text-sm transition-colors group"
                      >
                        View All
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>

                  <div className="space-y-2">
                    {data.recentDonations.map((donation) => (
                      <motion.div
                        key={donation.id}
                        className="group/item dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="shrink-0 w-10 h-10 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center">
                              <Heart className="w-5 h-5 text-sky-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="dark:text-white text-neutral-900 font-semibold">
                                ${donation.totalAmount.toFixed(2)}
                              </p>
                              <p className="text-xs dark:text-neutral-600 text-neutral-500">
                                {new Date(donation.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs font-medium dark:text-neutral-600 dark:bg-neutral-800/50 text-neutral-700 bg-neutral-200 px-3 py-1 rounded-md">
                            {donation.type === 'ONE_TIME_DONATION'
                              ? 'One-time'
                              : donation.recurringFrequency === 'monthly'
                                ? 'Monthly'
                                : 'Yearly'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
              >
                <motion.div className="space-y-6" variants={itemVariants}>
                  <div>
                    <h2 className="text-2xl font-black dark:text-white text-neutral-900">Events</h2>
                    <p className="text-sm dark:text-neutral-600 text-neutral-500 mt-1">Your registrations</p>
                  </div>

                  <div className="space-y-3">
                    {data.upcomingEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        className="group/event dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 backdrop-blur-sm border rounded-lg p-4 transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ y: -2 }}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-sky-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="dark:text-white text-neutral-900 font-semibold text-sm truncate">
                                {event.event?.name || 'Event'}
                              </p>
                              <p className="text-xs dark:text-neutral-600 text-neutral-500 mt-1">
                                {event.event?.date
                                  ? new Date(event.event.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : 'Date TBA'}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs font-medium dark:text-sky-400 text-sky-600 dark:bg-neutral-800/50 bg-sky-100 px-2 py-1 rounded w-fit">
                            {event.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0)} ticket
                            {event.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0) !== 1
                              ? 's'
                              : ''}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupporterOverviewClient
