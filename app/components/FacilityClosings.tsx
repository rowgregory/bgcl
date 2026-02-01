'use client'

import { IClosing } from '@/types/entities/closing'
import { motion } from 'framer-motion'

const FacilityClosings = ({ closings }: { closings: IClosing[] }) => {
  return (
    <section className="dark:bg-neutral-900/50 bg-neutral-50 py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-334 mx-auto">
        <motion.div
          className="mb-8 sm:mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4">
            Facility Closings
          </h2>
          <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
            Please note the following dates when the Boys & Girls Club will be closed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {closings?.map((closing, index) => (
            <motion.div
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
              <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-600">{closing.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FacilityClosings
