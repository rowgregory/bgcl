'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Heart } from 'lucide-react'
import Picture from '../common/Picture'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}

export default function SupporterDonationsClient({ donations }) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 pb-4 pt-6 md:pt-8 dark:border-neutral-800 border-neutral-200 border-b bg-neutral-50 dark:bg-neutral-900/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/supporter/overview"
            className="inline-flex items-center space-x-1 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Overview</span>
          </Link>
          <Link href="/" className="flex space-x-3 w-28 h-auto">
            <Picture
              src="/images/vertical-logo-light.png"
              alt="Boys & Girls Club"
              className="dark:hidden block w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
              priority={true}
            />
            <Picture
              src="/images/vertical-logo-dark.png"
              alt="Boys & Girls Club"
              className="dark:block hidden w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
              priority={true}
            />
          </Link>
          <div className="w-16" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-2">
              My Donations
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">View all your contributions</p>
          </motion.div>

          {donations.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {donations.map((donation) => (
                <motion.div key={donation.id} variants={itemVariants}>
                  <Link href={`/order-confirmation/${donation.id}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="h-full bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 cursor-pointer"
                    >
                      {/* Header Background */}
                      <div className="h-24 bg-linear-to-br from-sky-500 to-sky-600 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-4 -mb-4" />

                        <div className="relative z-10 h-full flex items-center justify-between px-6">
                          <Heart className="w-8 h-8 text-white fill-white" />
                          <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                            {donation.type === 'ONE_TIME_DONATION' ? 'One-Time' : 'Recurring'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Amount */}
                        <div>
                          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                            Amount
                          </p>
                          <p className="text-3xl font-black text-sky-600 dark:text-sky-400">
                            {formatCurrency(donation.totalAmount)}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <p className="text-sm">{formatDate(donation.createdAt)}</p>
                        </div>

                        {/* Donor Name */}
                        <div>
                          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                            Name
                          </p>
                          <p className="text-neutral-900 dark:text-white font-semibold truncate">
                            {donation.customerName}
                          </p>
                        </div>

                        {/* Campaign (if exists) */}
                        {donation.campaign && (
                          <div>
                            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                              Campaign
                            </p>
                            <p className="text-neutral-900 dark:text-white font-semibold truncate">
                              {donation.campaign.name}
                            </p>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="pt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400">
                            {donation.status}
                          </span>
                        </div>

                        {/* Frequency (if recurring) */}
                        {donation.recurringFrequency && (
                          <div>
                            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                              Frequency
                            </p>
                            <p className="text-neutral-900 dark:text-white capitalize text-sm">
                              {donation.recurringFrequency}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer CTA */}
                      <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">View Details →</p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-neutral-400 dark:text-neutral-500" />
              </div>
              <h3 className="text-2xl font-black dark:text-white text-neutral-900 mb-3">No Donations Yet</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto text-lg">
                Start making a difference by making your first donation
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-all"
              >
                <Heart className="w-5 h-5" />
                Donate Now
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
