'use client'

import { IProgram } from '@/types/entities/program'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Picture from '../common/Picture'

const ProgramsClient = ({ programs }: { programs: IProgram[] }) => {
  return (
    <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
              Our Offerings
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              Our Programs
            </h1>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
              Discover a wide range of programs designed to inspire, challenge, and empower youth in our community.
            </p>
          </div>
        </motion.div>

        {/* Programs Grid */}
        <>
          {programs.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <p className="dark:text-neutral-400 text-neutral-600 text-base sm:text-lg">
                No programs available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {programs.map((program: IProgram, index: number) => {
                return (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/programs/${program.id}`}>
                      <div className="group h-full cursor-pointer">
                        {/* Card Container */}
                        <div className="relative dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-sky-500/50 bg-white border-neutral-200 border hover:border-sky-500/50 rounded-lg overflow-hidden transition-all h-full flex flex-col">
                          {/* Image/Icon Area */}
                          <div className="relative h-96 overflow-hidden bg-cover bg-center">
                            <Picture
                              priority={true}
                              src={program.image ?? '/images/vertical-logo-light.png'}
                              alt={program.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 dark:bg-black/20 dark:group-hover:bg-black/10 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                          </div>

                          {/* Content */}
                          <div className="p-4 sm:p-6 flex-1 flex flex-col">
                            <h3 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900 mb-2">
                              {program.name}
                            </h3>

                            <p className="dark:text-neutral-400 text-neutral-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-1 line-clamp-3">
                              {program.descriptions[0]}
                            </p>

                            {/* CTA */}
                            <div className="flex items-center gap-2 dark:text-sky-400 text-sky-600 font-semibold group-hover:gap-3 transition-all text-xs sm:text-sm">
                              Learn More
                              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 py-12 sm:py-16 md:py-20 mt-12 sm:mt-16 md:mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 flex items-center justify-center flex-col">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold dark:text-white text-neutral-900">
                Register for our Summer Programs
              </h2>
            </div>

            <a
              href="https://parentportal.bgcl.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-6 sm:px-8 py-2.5 sm:py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors w-fit text-sm sm:text-base"
            >
              Register
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default ProgramsClient
