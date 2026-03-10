'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, ChevronRight, RefreshCw, Zap } from 'lucide-react'
import { formatDate } from '@/app/lib/utils/date-utils'
import { formatCurrency } from '@/app/lib/utils/currency.utils'

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

export const SupporterDonationRow = ({ donation }) => {
  return (
    <motion.li variants={itemVariants}>
      <motion.div
        className="group flex items-center gap-4 px-4 py-3.5 dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 border rounded-xl transition-all duration-200 cursor-pointer"
        whileHover={{ x: 3 }}
        role="row"
      >
        {/* Icon */}
        <div
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
            donation.status === 'CANCELLED' ? 'dark:bg-red-500/10 bg-red-50' : 'dark:bg-sky-500/10 bg-sky-50'
          }`}
          aria-hidden="true"
        >
          {donation.type === 'RECURRING_DONATION' ? (
            <RefreshCw className={`w-4 h-4 ${donation.status === 'CANCELLED' ? 'text-red-400' : 'text-sky-500'}`} />
          ) : (
            <Zap className={`w-4 h-4 ${donation.status === 'CANCELLED' ? 'text-red-400' : 'text-sky-500'}`} />
          )}
        </div>

        {/* Amount */}
        <div className="w-28 shrink-0">
          <p className="dark:text-white text-neutral-900 font-bold text-sm tabular-nums">
            {formatCurrency(donation.totalAmount)}
          </p>
          {donation.recurringFrequency && (
            <p className="text-xs dark:text-neutral-500 text-neutral-400 capitalize mt-0.5">
              {donation.recurringFrequency}
            </p>
          )}
        </div>

        {/* Type */}
        <div className="hidden sm:block w-24 shrink-0">
          <p className="text-xs font-semibold dark:text-neutral-400 text-neutral-600">
            {donation.type === 'ONE_TIME_DONATION' ? 'One-time' : 'Recurring'}
          </p>
        </div>

        {/* Date */}
        <div className="hidden md:flex items-center gap-1.5 w-32 shrink-0">
          <Calendar className="w-3.5 h-3.5 dark:text-neutral-600 text-neutral-400 shrink-0" aria-hidden="true" />
          <time
            dateTime={new Date(donation.createdAt).toISOString()}
            className="text-xs dark:text-neutral-500 text-neutral-500"
          >
            {formatDate(donation.createdAt)}
          </time>
        </div>

        {/* Campaign */}
        <div className="flex-1 min-w-0 hidden lg:block">
          {donation.campaign ? (
            <p className="text-xs dark:text-neutral-400 text-neutral-600 truncate font-medium">
              {donation.campaign.name}
            </p>
          ) : (
            <p className="text-xs dark:text-neutral-700 text-neutral-300">—</p>
          )}
        </div>

        {/* Status */}
        <div className="shrink-0">
          <span
            role="status"
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
              donation.status === 'CONFIRMED'
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                : donation.status === 'CANCELLED'
                  ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                  : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
            }`}
          >
            {donation.status === 'CONFIRMED' ? 'Confirmed' : donation.status === 'CANCELLED' ? 'Cancelled' : 'Pending'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {donation.type === 'RECURRING_DONATION' && donation.stripeSubscriptionId && (
            <Link
              href={`/supporter/donations/${donation.stripeSubscriptionId}`}
              aria-label="Manage subscription"
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 dark:bg-purple-500/10 bg-purple-50 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 whitespace-nowrap"
            >
              <RefreshCw className="w-3 h-3" aria-hidden="true" />
              Manage
            </Link>
          )}
          <Link
            href={`/order-confirmation/${donation.id}`}
            aria-label={`View receipt for ${formatCurrency(donation.totalAmount)} donation`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold dark:text-neutral-400 text-neutral-600 dark:bg-neutral-800 bg-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 whitespace-nowrap"
          >
            Receipt
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </motion.div>
    </motion.li>
  )
}
