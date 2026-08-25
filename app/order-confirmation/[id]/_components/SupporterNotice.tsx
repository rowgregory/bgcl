import { motion } from 'framer-motion'
import Link from 'next/link'

export const SupporterNotice = ({ isRecurring }: { isRecurring: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.85 }}
    className="p-4 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-xl mb-8"
  >
    <p className="text-sm text-sky-900 dark:text-sky-400">
      Your donations, tickets, payment methods, and account details are all available in your{' '}
      <Link
        href="/supporter/overview"
        className="font-semibold underline hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
      >
        Supporter Overview
      </Link>
      .{isRecurring && ' You can manage or cancel your subscription there at any time.'}
    </p>
  </motion.div>
)
