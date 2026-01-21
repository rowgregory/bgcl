'use client'

import { motion } from 'framer-motion'

export const HistorySection = ({ pageContent }) => {
  const historyImages = [
    {
      src: '/images/history-2.jpg',
      alt: 'Club Building',
      gridSpan: 'lg:col-span-2'
    },
    {
      src: '/images/history-3.jpg',
      alt: 'Boxing Program',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: '/images/history-4.jpg',
      alt: 'Bowling Activity',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: '/images/history-5.jpg',
      alt: 'Basketball',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: '/images/history-6.jpg',
      alt: 'Billiards Room',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: '/images/history-7.jpg',
      alt: 'Hockey Program',
      gridSpan: 'lg:col-span-2'
    }
  ]

  return (
    <section className="dark:bg-neutral-950 bg-white py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="h-px w-8 dark:bg-sky-500 bg-sky-600"
              animate={{ scaleX: [0, 1, 1] }}
              transition={{ duration: 0.8 }}
              style={{ originX: 0 }}
            />
            <p className="text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">
              {pageContent?.history?.subheading}
            </p>
          </div>
          <h2 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 mb-6">
            {pageContent?.history?.heading1}{' '}
            <span className="font-light dark:text-neutral-400 text-neutral-600">{pageContent?.history?.heading1}</span>
          </h2>
          <div className="space-y-4 max-w-4xl">
            <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {pageContent?.history?.paragraph1}
            </p>

            <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {pageContent?.history?.paragraph2}
            </p>

            <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {pageContent?.history?.paragraph3}
            </p>

            <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {pageContent?.history?.paragraph1}
            </p>
          </div>
        </motion.div>

        {/* Image Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {historyImages.map((image, index) => (
            <motion.div
              key={index}
              className={`${image.gridSpan} rounded-xl overflow-hidden dark:border-neutral-800 border-neutral-200 border group cursor-pointer`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-64 lg:h-80 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay on hover */}
                <motion.div
                  className="absolute inset-0 dark:bg-black/50 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.div animate={{ scale: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                    <div className="w-12 h-12 rounded-full dark:bg-sky-500 bg-sky-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Label on image */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 dark:bg-linear-to-t dark:from-black/90 bg-linear-to-t from-neutral-900/90 p-4"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="dark:text-sky-400 text-sky-300 font-bold text-sm">{image.alt}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 dark:border-t dark:border-neutral-800 border-t border-neutral-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <p className="text-5xl font-black dark:text-sky-500 text-sky-600">
              {' '}
              {pageContent?.history?.statOne?.value1}
            </p>
            <p className="dark:text-neutral-400 text-neutral-600 text-sm">{pageContent?.history?.statOne?.value2}</p>
            <p className="dark:text-neutral-500 text-neutral-500 text-xs">{pageContent?.history?.statOne?.value3}</p>
          </motion.div>

          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <p className="text-5xl font-black dark:text-sky-500 text-sky-600">
              {pageContent?.history?.statTwo?.value1}
            </p>
            <p className="dark:text-neutral-400 text-neutral-600 text-sm">{pageContent?.history?.statTwo?.value2}</p>
            <p className="dark:text-neutral-500 text-neutral-500 text-xs">{pageContent?.history?.statTwo?.value3}</p>
          </motion.div>

          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <p className="text-5xl font-black dark:text-sky-500 text-sky-600">
              {pageContent?.history?.statThree?.value1}
            </p>
            <p className="dark:text-neutral-400 text-neutral-600 text-sm">{pageContent?.history?.statThree?.value2}</p>
            <p className="dark:text-neutral-500 text-neutral-500 text-xs">{pageContent?.history?.statThree?.value3}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
