'use client'

import { IProgram } from '@/types/entities/program'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ProgramsClient = ({ programs }: { programs: IProgram[] }) => {
  return (
    <div className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
              Our Offerings
            </p>
            <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              Our Programs
            </h1>
            <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
              Discover a wide range of programs designed to inspire, challenge, and empower youth in our community.
            </p>
          </div>
        </motion.div>

        {/* Programs Grid */}
        <>
          {programs.length === 0 ? (
            <div className="text-center py-20">
              <p className="dark:text-neutral-400 text-neutral-600 text-lg">No programs available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                          <div className="relative h-48 overflow-hidden bg-cover bg-center">
                            <img
                              src={program.image}
                              alt={program.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 dark:bg-black/20 dark:group-hover:bg-black/10 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                          </div>

                          {/* Content */}
                          <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold dark:text-white text-neutral-900 mb-2">{program.name}</h3>

                            <p className="dark:text-neutral-400 text-neutral-600 text-sm mb-4 flex-1 line-clamp-3">
                              {program.description1}
                            </p>

                            {/* Quick Info */}
                            <div className="space-y-2 mb-6 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="dark:text-sky-400 text-sky-600 font-semibold">Age:</span>
                                <span className="dark:text-neutral-300 text-neutral-700">{program.ageGroup}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="dark:text-sky-400 text-sky-600 font-semibold">Frequency:</span>
                                <span className="dark:text-neutral-300 text-neutral-700">{program.frequency}</span>
                              </div>
                              {program.datesAvailable && (
                                <div className="flex items-center gap-2">
                                  <span className="dark:text-sky-400 text-sky-600 font-semibold">Dates:</span>
                                  <span className="dark:text-neutral-300 text-neutral-700">
                                    {program.datesAvailable}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* CTA */}
                            <div className="flex items-center gap-2 dark:text-sky-400 text-sky-600 font-semibold group-hover:gap-3 transition-all text-sm">
                              Learn More
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
          className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 py-20 mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 flex items-center justify-center flex-col">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold dark:text-white text-neutral-900">
                Register for our 2025-2026 Afterschool Programs
              </h2>
            </div>
            <a
              href="https://parentportal.bgcl.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-8 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors w-fit"
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
