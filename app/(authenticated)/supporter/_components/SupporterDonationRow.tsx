'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, RefreshCw, Zap } from 'lucide-react'
import { formatDate } from '@/lib/utils/date-utils'
import { formatCurrency } from '@/lib/utils/currency.utils'

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

export const SupporterDonationRow = ({ donation }) => {
  return (
    <motion.li variants={itemVariants}>
      <motion.div
        className="group flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 dark:bg-neutral-900/30 dark:border-neutral-800 dark:hover:border-neutral-700 bg-neutral-50 border-neutral-200 hover:border-neutral-300 border rounded-xl transition-all duration-200"
        whileHover={{ x: 2 }}
        role="row"
      >
        {/* Icon */}
        <div
          className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${
            donation.status === 'CANCELLED' ? 'dark:bg-red-500/10 bg-red-50' : 'dark:bg-sky-500/10 bg-sky-50'
          }`}
          aria-hidden="true"
        >
          {donation.type === 'RECURRING_DONATION' ? (
            <RefreshCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${donation.status === 'CANCELLED' ? 'text-red-400' : 'text-sky-500'}`}
            />
          ) : (
            <Zap
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${donation.status === 'CANCELLED' ? 'text-red-400' : 'text-sky-500'}`}
            />
          )}
        </div>

        {/* Amount + type + date — stacked on mobile */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="dark:text-white text-neutral-900 font-bold text-sm tabular-nums">
              {formatCurrency(donation.totalAmount)}
            </p>
            <p className="text-xs dark:text-neutral-500 text-neutral-400">
              {donation.type === 'ONE_TIME_DONATION' ? (
                'One-time'
              ) : (
                <span className="capitalize">{donation.recurringFrequency}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <time
              dateTime={new Date(donation.createdAt).toISOString()}
              className="text-xs dark:text-neutral-600 text-neutral-400"
            >
              {formatDate(donation.createdAt)}
            </time>
            {donation.campaign && (
              <>
                <span className="dark:text-neutral-700 text-neutral-300 text-xs" aria-hidden="true">
                  ·
                </span>
                <p className="text-xs dark:text-neutral-500 text-neutral-500 truncate max-w-30 sm:max-w-none">
                  {donation.campaign.name}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="shrink-0">
          <span
            role="status"
            className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide ${
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
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {donation.type === 'RECURRING_DONATION' && donation.stripeSubscriptionId && (
            <Link
              href={`/supporter/donations/${donation.stripeSubscriptionId}`}
              aria-label="Manage subscription"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400 dark:bg-purple-500/10 bg-purple-50 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 whitespace-nowrap"
            >
              <RefreshCw className="w-3 h-3" aria-hidden="true" />
              <span className="hidden sm:inline">Manage</span>
            </Link>
          )}
          <Link
            href={`/order-confirmation/${donation.id}`}
            aria-label={`View receipt for ${formatCurrency(donation.totalAmount)} donation`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold dark:text-neutral-400 text-neutral-600 dark:bg-neutral-800 bg-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 whitespace-nowrap"
          >
            <span className="hidden sm:inline">Receipt</span>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </motion.div>
    </motion.li>
  )
}
