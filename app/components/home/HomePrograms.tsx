'use client'

import { motion } from 'framer-motion'
import { IProgram } from '@/types/entities/program'
import Picture from '../common/Picture'
import Link from 'next/link'

interface CarouselProps {
  heading?: string
  subheading?: string
  title?: string
  items?: IProgram[]
}

export const HomePrograms: React.FC<CarouselProps> = ({
  title = 'Our Programs',
  heading = 'Programs',
  subheading = 'We Offer',
  items
}) => {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12">
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
            <div className="h-px w-8 dark:bg-sky-500 bg-sky-600" />
            <p className="text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">{title}</p>
          </div>
          <h2 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900">
            {heading} <span className="font-light dark:text-neutral-400 text-neutral-600">{subheading}</span>
          </h2>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {items.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/programs/${program.id}`}>
                <motion.div
                  className="relative aspect-square rounded-xl overflow-hidden border dark:border-neutral-800 border-neutral-200 group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image */}
                  <Picture
                    src={program.image}
                    alt={program.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={false}
                  />

                  {/* Base Overlay */}
                  <div className="absolute inset-0 dark:bg-linear-to-t dark:from-black/80 dark:via-black/40 dark:to-transparent bg-linear-to-t from-neutral-900/80 via-neutral-800/40 to-transparent z-10" />

                  {/* Hover Overlay - animated */}
                  <motion.div
                    className="absolute inset-0 dark:bg-linear-to-t dark:from-sky-600/40 dark:via-sky-500/20 dark:to-transparent bg-linear-to-t from-sky-600/40 via-sky-500/20 to-transparent z-20"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content - Always visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                    <motion.div
                      className="dark:bg-sky-600 bg-sky-600 px-4 py-3 rounded-lg inline-block"
                      whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(6, 182, 212, 0.3)' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-black text-white">{program.name}</h3>
                    </motion.div>

                    {/* Arrow - appears on hover */}
                    <motion.div
                      className="absolute bottom-6 right-6"
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Corner accent - rotates on hover */}
                  <motion.div
                    className="absolute -top-12 -right-12 w-24 h-24 dark:bg-sky-500/20 bg-sky-400/20 rounded-full blur-xl"
                    initial={{ rotate: 0, scale: 0.8 }}
                    whileHover={{ rotate: 45, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Animated border glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-xl dark:border-sky-500 border-sky-600"
                    style={{ borderWidth: '2px' }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
