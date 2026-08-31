'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { SupporterDonationRow } from './_components/SupporterDonationRow'
import { containerVariants } from '@/lib/constants/motion'
import CancelSubscriptionDrawer from './_components/CancelSubscriptionDrawer'

export default function SupporterDonationsClient({ donations }) {
  const lifetimeTotal = donations.reduce((sum, d) => sum + (d.lifetimeAmount ?? 0), 0)
  const activeRecurring = donations.filter((d) => d.type === 'RECURRING_DONATION' && d.status === 'CONFIRMED').length

  return (
    <>
      <CancelSubscriptionDrawer />

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

              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Your donations</h1>

              {donations.length > 0 && (
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 tabular-nums">
                  {formatCurrency(lifetimeTotal)} given
                  {activeRecurring > 0 && (
                    <>
                      {' · '}
                      {activeRecurring} active recurring {activeRecurring === 1 ? 'donation' : 'donations'}
                    </>
                  )}
                </p>
              )}
            </motion.div>

            {donations.length > 0 ? (
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                role="list"
                className="mt-8 divide-y divide-neutral-100 dark:divide-neutral-900 border-t border-neutral-200 dark:border-neutral-800 list-none p-0"
              >
                {donations.map((donation) => (
                  <SupporterDonationRow key={donation.id} donation={donation} />
                ))}
              </motion.ul>
            ) : (
              <div className="mt-8 py-16 text-center border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">You have not made a donation yet.</p>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                >
                  Make your first donation
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
