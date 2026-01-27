'use client'

import { motion } from 'framer-motion'
import Picture from '../common/Picture'

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
    <section className="dark:bg-neutral-950 bg-white py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <motion.div
              className="h-px w-6 sm:w-8 dark:bg-sky-500 bg-sky-600"
              animate={{ scaleX: [0, 1, 1] }}
              transition={{ duration: 0.8 }}
              style={{ originX: 0 }}
            />
            <p className="text-xs sm:text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">
              {pageContent?.history?.subheading}
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 mb-4 sm:mb-6">
            {pageContent?.history?.heading1}{' '}
            <span className="font-light dark:text-neutral-400 text-neutral-600">{pageContent?.history?.heading2}</span>
          </h2>
          <div className="space-y-3 sm:space-y-4 max-w-4xl">
            <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {pageContent?.history?.paragraph1}
            </p>

            <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {pageContent?.history?.paragraph2}
            </p>

            <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {pageContent?.history?.paragraph3}
            </p>

            <p className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {pageContent?.history?.paragraph1}
            </p>
          </div>
        </motion.div>

        {/* Image Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 auto-rows-max"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {historyImages.map((image, index) => (
            <motion.div
              key={index}
              className={`${image.gridSpan} rounded-lg sm:rounded-xl overflow-hidden dark:border-neutral-800 border-neutral-200 border group bg-neutral-100 dark:bg-neutral-800`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative overflow-hidden w-full h-full">
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" loading="lazy" />

                {/* Label on image */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-black/20 dark:from-black/90 dark:to-black/30 p-3 sm:p-4"
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sky-300 dark:text-sky-400 font-bold text-xs sm:text-sm line-clamp-2">
                    {image.alt}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 pt-12 sm:pt-16 dark:border-t dark:border-neutral-800 border-t border-neutral-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <p className="text-3xl sm:text-4xl md:text-5xl font-black dark:text-sky-500 text-sky-600">
              {pageContent?.history?.statOne?.value1}
            </p>
            <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">
              {pageContent?.history?.statOne?.value2}
            </p>
            <p className="dark:text-neutral-500 text-neutral-500 text-[10px] sm:text-xs">
              {pageContent?.history?.statOne?.value3}
            </p>
          </motion.div>

          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <p className="text-3xl sm:text-4xl md:text-5xl font-black dark:text-sky-500 text-sky-600">
              {pageContent?.history?.statTwo?.value1}
            </p>
            <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">
              {pageContent?.history?.statTwo?.value2}
            </p>
            <p className="dark:text-neutral-500 text-neutral-500 text-[10px] sm:text-xs">
              {pageContent?.history?.statTwo?.value3}
            </p>
          </motion.div>

          <motion.div className="text-center space-y-2" whileHover={{ scale: 1.05 }}>
            <p className="text-3xl sm:text-4xl md:text-5xl font-black dark:text-sky-500 text-sky-600">
              {pageContent?.history?.statThree?.value1}
            </p>
            <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">
              {pageContent?.history?.statThree?.value2}
            </p>
            <p className="dark:text-neutral-500 text-neutral-500 text-[10px] sm:text-xs">
              {pageContent?.history?.statThree?.value3}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
