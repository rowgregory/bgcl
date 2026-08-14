import { containerVariants, itemVariants } from '@/lib/constants/motion'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export function Stats({ dashboard }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" custom={1}>
      <dl className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {dashboard?.stats.map((stat, index) => (
          <motion.div
            key={index}
            className="group relative dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-50 border-neutral-200 backdrop-blur-sm border rounded-xl p-4 overflow-hidden dark:hover:border-neutral-700 hover:border-neutral-300 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ y: -3 }}
          >
            <div
              className="absolute inset-0 dark:bg-linear-to-br dark:from-sky-500/5 dark:to-transparent bg-linear-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <div className="relative space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <dt className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-1.5 truncate">
                    {stat.label}
                  </dt>
                  <dd className="text-xl lg:text-2xl font-black dark:text-white text-neutral-900">{stat.value}</dd>
                </div>
                <div
                  className="shrink-0 w-8 h-8 rounded-lg dark:bg-neutral-800/50 dark:group-hover:bg-sky-500/20 bg-neutral-200 group-hover:bg-sky-500/20 flex items-center justify-center transition-colors duration-300"
                  aria-hidden="true"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                </div>
              </div>
              <p className="text-xs dark:text-neutral-600 text-neutral-500">{stat.subtext}</p>
            </div>
          </motion.div>
        ))}
      </dl>
    </motion.div>
  )
}
