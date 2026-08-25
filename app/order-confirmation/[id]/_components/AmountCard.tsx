import { motion } from 'framer-motion'
import { formatLongDate } from '../_formatters'

interface AmountCardProps {
  order: any
  isDonation: boolean
  isRecurring: boolean
}

export const AmountCard = ({ order, isDonation, isRecurring }: AmountCardProps) => {
  const label = isDonation
    ? isRecurring
      ? `${order.recurringFrequency} Donation`
      : 'One-Time Donation'
    : 'Ticket Purchase'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 mb-8 bg-neutral-50 dark:bg-neutral-800/50"
    >
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">
            {label}
          </p>
          <h2 className="text-5xl font-black text-sky-600 dark:text-sky-400">
            ${order?.totalAmount?.toLocaleString()}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-1">Date</p>
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {formatLongDate(order?.paidAt || order?.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
