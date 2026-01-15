'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, Clock, Users, Calendar, MapPin, FileText } from 'lucide-react'
import Link from 'next/link'

const ProgramDetailsClient = ({ program }) => {
  if (!program) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Program Not Found</h1>
          <Link href="/programs">
            <button className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg">
              Back to Programs
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden py-40 bg-cover bg-top"
        style={{
          backgroundImage: `url(${program.image})`
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Programs
            </Link>
            <h1 className="text-5xl font-bold text-white">{program.name}</h1>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">About This Program</h2>
              <p className="text-zinc-300 text-lg leading-relaxed">{program.description1}</p>
              {program.description2 && <p className="text-zinc-300 text-lg leading-relaxed">{program.description2}</p>}
              {program.description3 && <p className="text-zinc-300 text-lg leading-relaxed">{program.description3}</p>}
              {program.description4 && <p className="text-zinc-300 text-lg leading-relaxed">{program.description4}</p>}
              {program.description5 && <p className="text-zinc-300 text-lg leading-relaxed">{program.description5}</p>}
            </div>

            {/* Program Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-sky-400" />
                  <h3 className="text-lg font-bold text-white">Age Group</h3>
                </div>
                <p className="text-zinc-300 text-lg font-semibold">{program.ageGroup} years</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-sky-400" />
                  <h3 className="text-lg font-bold text-white">Frequency</h3>
                </div>
                <p className="text-zinc-300 text-lg font-semibold">{program.frequency}</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-sky-400" />
                  <h3 className="text-lg font-bold text-white">Location</h3>
                </div>
                <p className="text-zinc-300 text-lg font-semibold">{program.location}</p>
              </div>

              {program.datesAvailable && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-sky-400" />
                    <h3 className="text-lg font-bold text-white">Available Dates</h3>
                  </div>
                  <p className="text-zinc-300 text-lg font-semibold">{program.datesAvailable}</p>
                </div>
              )}

              {program.license && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-sky-400" />
                    <h3 className="text-lg font-bold text-white">Licensing</h3>
                  </div>
                  <p className="text-zinc-300 text-lg font-semibold">{program.license}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Schedule & CTA */}
          <div className="space-y-6">
            {/* Drop-Off Times */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4 sticky top-8"
            >
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                Schedule
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sky-400 text-sm font-semibold mb-1">Drop-Off</p>
                  <p className="text-white font-semibold">
                    {program.dropOffStart} - {program.dropOffEnd}
                  </p>
                </div>

                <div className="border-t border-zinc-700 pt-4">
                  <p className="text-sky-400 text-sm font-semibold mb-1">Pick-Up</p>
                  <p className="text-white font-semibold">
                    {program.pickUpStart} - {program.pickUpEnd}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <a href="https://parentportal.bgcl.org/" target="_blank" rel="noopener noreferrer" className="block">
                <button className="w-full px-6 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-colors">
                  Enroll Now
                </button>
                <p className="text-xs text-neutral-400 mt-2">Opens in new window</p>
              </a>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3 text-center"
            >
              <h4 className="text-white font-bold">Questions?</h4>
              <div className="space-y-2 text-sm">
                <a href="tel:781-593-1772" className="text-sky-400 hover:text-sky-300 font-semibold block">
                  (781) 593-1772
                </a>
                <a href="mailto:info@bgcl.org" className="text-sky-400 hover:text-sky-300 font-semibold block">
                  info@bgcl.org
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Other Programs */}
      {/* {programs.length > 1 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='bg-zinc-900 border-t border-zinc-800 py-20'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12'>
            <div className='text-center space-y-4'>
              <h2 className='text-3xl font-bold text-white'>Other Programs</h2>
              <p className='text-zinc-400'>Explore more opportunities</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {programs
                .filter(p => p.id !== program.id)
                .slice(0, 3)
                .map(prog => {
                  const progIcon = programIcons[prog.id] || '📚'
                  return (
                    <Link key={prog.id} href={`/programs/${prog.id}`}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        className='bg-zinc-800 border border-zinc-700 rounded-lg p-6 cursor-pointer hover:border-sky-500/50 transition-colors group'
                      >
                        <div className='text-5xl mb-3'>{progIcon}</div>
                        <h3 className='text-lg font-bold text-white group-hover:text-sky-400 transition-colors'>
                          {prog.name}
                        </h3>
                        <p className='text-zinc-400 text-sm mt-2 line-clamp-2'>
                          {prog.description}
                        </p>
                      </motion.div>
                    </Link>
                  )
                })}
            </div>
          </div>
        </motion.section>
      )} */}
    </div>
  )
}

export default ProgramDetailsClient
