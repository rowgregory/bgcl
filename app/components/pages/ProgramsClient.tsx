'use client'

import { IProgram } from '@/types/entities/program'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ProgramsClient = ({ programs }) => {
  return (
    <div className="">
      {/* Hero Section */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <p className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Our Offerings</p>
            <h1 className="text-5xl font-bold text-white">Our Programs</h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Discover a wide range of programs designed to inspire, challenge, and empower youth in our community.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {programs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">No programs available at the moment.</p>
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
                      <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-sky-500/50 transition-all h-full flex flex-col">
                        {/* Image/Icon Area */}
                        <div className="relative h-48 overflow-hidden bg-cover bg-center">
                          <img
                            src={program.image}
                            alt={program.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-white mb-2">{program.name}</h3>

                          <p className="text-zinc-400 text-sm mb-4 flex-1 line-clamp-3">{program.description1}</p>

                          {/* Quick Info */}
                          <div className="space-y-2 mb-6 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-sky-400 font-semibold">Age:</span>
                              <span className="text-zinc-300">{program.ageGroup}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sky-400 font-semibold">Frequency:</span>
                              <span className="text-zinc-300">{program.frequency}</span>
                            </div>
                            {program.datesAvailable && (
                              <div className="flex items-center gap-2">
                                <span className="text-sky-400 font-semibold">Dates:</span>
                                <span className="text-zinc-300">{program.datesAvailable}</span>
                              </div>
                            )}
                          </div>

                          {/* CTA */}
                          <div className="flex items-center gap-2 text-sky-400 font-semibold group-hover:gap-3 transition-all text-sm">
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
      </div>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-zinc-900 border-t border-zinc-800 py-20 mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 flex items-center justify-center flex-col">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Ready to Get Started?</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Enroll your child in Boys & Girls Club programs and watch them grow.
            </p>
          </div>
          <a
            href="https://parentportal.bgcl.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors w-fit"
          >
            Parent Portal
          </a>
        </div>
      </motion.section>
    </div>
  )
}

export default ProgramsClient
