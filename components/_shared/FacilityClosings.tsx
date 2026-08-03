'use client'

import { Closing } from '@/types/closing.types'
import { motion } from 'framer-motion'

export default function FacilityClosings({ closings }: { closings: Closing[] }) {
  return (
    <section
      aria-labelledby="facility-closings-heading"
      className="dark:bg-neutral-900/50 bg-neutral-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12"
    >
      <div className="max-w-334 mx-auto">
        <motion.div
          className="mb-8 sm:mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="facility-closings-heading"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4"
          >
            Facility Closings
          </h2>
          <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
            Please note the following dates when the Boys &amp; Girls Club will be closed.
          </p>
        </motion.div>

        <ul
          role="list"
          aria-label="Upcoming facility closings"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 list-none p-0 m-0"
        >
          {closings?.map((closing, index) => (
            <motion.li
              key={index}
              className="dark:bg-neutral-800 bg-white dark:border-neutral-700 border-neutral-200 p-4 sm:p-6 rounded-lg border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <h3 className="text-base sm:text-lg font-bold dark:text-white text-neutral-900 mb-1.5 sm:mb-2">
                {closing.title}
              </h3>
              <time
                dateTime={closing.date ?? undefined}
                className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-600"
              >
                {closing.date}
              </time>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
