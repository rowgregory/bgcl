import { motion } from 'framer-motion'

const IMPACT = [
  { amount: '$25', label: 'A week of after-school snacks' },
  { amount: '$50', label: 'Supplies for a STEM session' },
  { amount: '$100', label: 'A youth field trip' },
  { amount: '$250', label: 'A month of programming for a kid' }
] as const

export function DonateFormLeftColumn() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-1 order-2 lg:order-1 lg:sticky lg:top-24 self-start"
    >
      <h2 className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">What your gift does</h2>

      <dl className="divide-y divide-neutral-100 dark:divide-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
        {IMPACT.map(({ amount, label }) => (
          <div key={amount} className="flex items-baseline gap-5 py-4">
            <dt className="shrink-0 w-14 text-xl font-semibold text-neutral-900 dark:text-white tabular-nums">
              {amount}
            </dt>
            <dd className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{label}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-xs text-neutral-400 dark:text-neutral-600 leading-relaxed">
        The Boys &amp; Girls Club of Lynn is a 501(c)(3) nonprofit. Your donation is tax deductible.
      </p>
    </motion.aside>
  )
}
