import { motion } from 'framer-motion'

export function DonationFormLeftColumn() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1 space-y-6 order-2 lg:order-1"
    >
      <div className="space-y-5">
        <h2 className="text-2xl font-bold dark:text-white text-neutral-900">Your Impact</h2>
        <div className="space-y-5">
          {[
            { amount: '$25', label: 'Provides a week of after-school snacks' },
            { amount: '$50', label: 'Supports STEM program supplies' },
            { amount: '$100', label: 'Funds a youth field trip' },
            { amount: '$250+', label: 'Transforms a life this year' }
          ].map(({ amount, label }, i) => (
            <div key={amount} className="flex items-start gap-4">
              <span className="shrink-0 text-2xl font-black dark:text-sky-400 text-sky-600 w-16 tabular-nums leading-tight">
                {amount}
              </span>
              <div className="flex-1 pt-1 border-t dark:border-neutral-800 border-neutral-200">
                <p className="text-sm dark:text-neutral-400 text-neutral-600 leading-relaxed">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
