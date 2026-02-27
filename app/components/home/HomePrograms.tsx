'use client'

import { motion } from 'framer-motion'
import { IProgram } from '@/types/entities/program'
import Picture from '../common/Picture'
import Link from 'next/link'

interface CarouselProps {
  programText?: any
  programs?: IProgram[]
}

export const HomePrograms: React.FC<CarouselProps> = ({ programText, programs }) => {
  return (
    <section aria-labelledby="programs-heading" className="py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 md:px-12">
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
            <div aria-hidden="true" className="h-px w-6 sm:w-8 dark:bg-sky-500 bg-sky-600" />
            <p className="text-xs sm:text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">
              {programText?.subheading}
            </p>
          </div>
          <h2
            id="programs-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900"
          >
            {programText?.heading1}{' '}
            <span className="font-light dark:text-neutral-400 text-neutral-600">{programText?.heading2}</span>
          </h2>
        </motion.div>

        {/* Programs Grid */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 list-none p-0"
          aria-label="Programs list"
        >
          {programs?.map((program, index) => {
            const gradients = [
              'from-sky-500 to-blue-600',
              'from-purple-500 to-indigo-600',
              'from-green-500 to-emerald-600',
              'from-orange-500 to-red-500'
            ]
            const gradient = gradients[index % gradients.length]

            const colors = [
              {
                bg: 'bg-sky-600',
                border: 'border-sky-500',
                glow: 'bg-sky-500/20',
                overlay: 'from-sky-600/40 via-sky-500/20'
              },
              {
                bg: 'bg-purple-600',
                border: 'border-purple-500',
                glow: 'bg-purple-500/20',
                overlay: 'from-purple-600/40 via-purple-500/20'
              },
              {
                bg: 'bg-green-500',
                border: 'border-green-500',
                glow: 'bg-green-500/20',
                overlay: 'from-green-600/40 via-green-500/20'
              },
              {
                bg: 'bg-orange-500',
                border: 'border-orange-500',
                glow: 'bg-orange-500/20',
                overlay: 'from-orange-600/40 via-orange-500/20'
              }
            ]
            const color = colors[index % colors.length]

            return (
              <motion.li
                key={program.id ?? index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/programs/${program.id}`}
                  aria-label={`Explore ${program.name} program`}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl"
                >
                  <motion.div
                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    {/* Card Content */}
                    <div className="relative aspect-4/5 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-900 group">
                      {/* Image */}
                      <Picture
                        src={program.image}
                        alt={program.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        priority={index < 3}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Gradient Overlay */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                      />

                      {/* Hover Overlay */}
                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 bg-linear-to-t ${color.overlay} to-transparent z-15 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
                        <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{program.name}</h3>

                          {/* Animated Line */}
                          <div
                            aria-hidden="true"
                            className="relative h-0.5 w-10 sm:w-12 bg-white/30 rounded-full overflow-hidden mb-2 sm:mb-3"
                          >
                            <motion.div
                              className={`absolute inset-y-0 left-0 bg-linear-to-r ${gradient} rounded-full`}
                              initial={{ width: '0%' }}
                              whileInView={{ width: '100%' }}
                              transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                              aria-hidden="true"
                            />
                          </div>

                          {/* CTA */}
                          <div
                            aria-hidden="true"
                            className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors duration-300"
                          >
                            <span className="text-xs sm:text-sm font-medium">Explore</span>
                            <motion.svg
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </motion.svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
