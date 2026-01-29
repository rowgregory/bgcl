import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}

const MyDonationCard = ({ donation }) => {
  return (
    <motion.div key={donation.id} variants={itemVariants}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="h-full bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 cursor-pointer flex flex-col"
      >
        {/* Header Background */}
        <div className="h-24 bg-linear-to-br from-sky-500 to-sky-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-4 -mb-4" />

          <div className="relative z-10 h-full flex items-center justify-between px-6">
            <Picture src="/images/horizontal-logo-dark.png" className="w-48" priority={true} />
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
              {donation.type === 'ONE_TIME_DONATION' ? 'One-Time' : 'Recurring'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex-1">
          {/* Amount */}
          <div>
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
              Amount
            </p>
            <p className="text-3xl font-black text-sky-600 dark:text-sky-400">{formatCurrency(donation.totalAmount)}</p>
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
            <p className="text-neutral-900 dark:text-white font-semibold truncate">{donation.customerName}</p>
          </div>

          {/* Campaign (if exists) */}
          {donation.campaign && (
            <div>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Campaign
              </p>
              <p className="text-neutral-900 dark:text-white font-semibold truncate">{donation.campaign.name}</p>
            </div>
          )}

          {/* Status Badge */}
          <div className="pt-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                donation.status === 'CONFIRMED'
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400'
                  : donation.status === 'CANCELLED'
                    ? 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400'
                    : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400'
              }`}
            >
              {donation.status}
            </span>
          </div>

          {/* Frequency (if recurring) */}
          {donation.recurringFrequency && (
            <div>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Frequency
              </p>
              <p className="text-neutral-900 dark:text-white capitalize text-sm">{donation.recurringFrequency}</p>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-auto px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <Link
            href={`/order-confirmation/${donation.id}`}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400"
          >
            View Details →
          </Link>
          {donation.type === 'RECURRING_DONATION' && (
            <Link
              href={`/supporter/donations/${donation.stripeSubscriptionId}`}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400"
            >
              View Subscription
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MyDonationCard
