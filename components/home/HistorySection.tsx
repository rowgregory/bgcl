'use client'

import { motion } from 'framer-motion'
import Picture from '../_shared/Picture'

export const HistorySection = ({ history }) => {
  const historyImages = [
    {
      src: '/images/history-2.jpg',
      alt: 'Club Building',
      gridSpan: 'lg:col-span-2'
    },
    {
      src: '/images/history-3.jpg',
      alt: 'Bowling Activity',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: '/images/history-4.jpg',
      alt: 'Basketball',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: '/images/history-5.jpg',
      alt: 'Billiards Room',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: '/images/history-6.jpg',
      alt: 'Hockey Program',
      gridSpan: 'lg:col-span-1'
    },
    {
      src: '/images/history-7.jpg',
      alt: 'Boxing Program',
      gridSpan: 'lg:col-span-2'
    }
  ]

  return (
    <section
      id="history"
      className="dark:bg-neutral-950 bg-white py-12 sm:py-16 md:py-20 lg:py-32"
      role="region"
      aria-labelledby="history-heading"
    >
      <div className="max-w-334 mx-auto">
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
              {history?.subheading}
            </p>
          </div>

          <h2
            id="history-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 mb-4 sm:mb-6"
          >
            {history?.heading1}{' '}
            <span className="font-light dark:text-neutral-400 text-neutral-600">{history?.heading2}</span>
          </h2>

          <div className="space-y-3 sm:space-y-4 max-w-4xl">
            {[history?.paragraph1, history?.paragraph2, history?.paragraph3, history?.paragraph4].map((para, idx) => (
              <p key={idx} className="text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                {para}
              </p>
            ))}
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
            <motion.figure
              key={index}
              className={`${image.gridSpan} rounded-lg sm:rounded-xl overflow-hidden dark:border-neutral-800 border-neutral-200 border group bg-neutral-100 dark:bg-neutral-800 relative`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Picture
                src={image.src}
                alt={image.alt || `History image ${index + 1}`}
                className="w-full h-full object-cover"
                priority={false}
              />

              <figcaption className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-black/20 dark:from-black/90 dark:to-black/30 p-3 sm:p-4 text-sky-300 dark:text-sky-400 font-bold text-xs sm:text-sm line-clamp-2">
                {image.alt}
              </figcaption>
            </motion.figure>
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
          {[
            {
              label: history?.statOne_value2,
              value: history?.statOne_value1,
              note: history?.statOne_value3
            },
            {
              label: history?.statTwo_value2,
              value: history?.statTwo_value1,
              note: history?.statTwo_value3
            },
            {
              label: history?.statThree_value2,
              value: history?.statThree_value1,
              note: history?.statThree_value3
            }
          ].map((stat, idx) => (
            <motion.article
              key={idx}
              className="text-center space-y-2"
              whileHover={{ scale: 1.05 }}
              aria-label={`${stat.label}: ${stat.value}. ${stat.note}`}
            >
              <p className="text-3xl sm:text-4xl md:text-5xl font-black dark:text-sky-500 text-sky-600">{stat.value}</p>
              <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm">{stat.label}</p>
              <p className="dark:text-neutral-500 text-neutral-500 text-[10px] sm:text-xs">{stat.note}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
