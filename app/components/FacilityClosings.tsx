'use client'

import { motion } from 'framer-motion'

const closingDates = [
  { holiday: "New Year's Day", date: 'January 1, 2025' },
  { holiday: 'Martin Luther King Day', date: 'January 20, 2025' },
  { holiday: "President's Day", date: 'February 17, 2025' },
  { holiday: 'Good Friday', date: 'April 18, 2025' },
  { holiday: 'Patriots Day', date: 'April 21, 2025' },
  { holiday: 'Juneteenth', date: 'June 19, 2025' },
  { holiday: 'Independence Day', date: 'July 4, 2025' },
  { holiday: 'Labor Day', date: 'September 1, 2025' },
  { holiday: 'Columbus Day', date: 'October 13, 2025' },
  { holiday: "Veteran's Day", date: 'November 11, 2025' },
  { holiday: 'Thanksgiving', date: 'November 27, 2025' },
  { holiday: 'Day After Thanksgiving', date: 'November 28, 2025' },
  { holiday: 'Christmas Week', date: 'December 23 - 26, 2025' }
]

const FacilityClosings = () => {
  return (
    <section className="dark:bg-neutral-900/50 bg-neutral-50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black dark:text-white text-neutral-900 mb-4">Facility Closings</h2>
          <p className="text-lg dark:text-neutral-400 text-neutral-600">
            Please note the following dates when the Boys & Girls Club will be closed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {closingDates.map((closing, index) => (
            <motion.div
              key={index}
              className="dark:bg-neutral-800 bg-white dark:border-neutral-700 border-neutral-200 p-6 rounded-lg border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <h3 className="text-lg font-bold dark:text-white text-neutral-900 mb-2">{closing.holiday}</h3>
              <p className="text-sm dark:text-neutral-400 text-neutral-600">{closing.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FacilityClosings
