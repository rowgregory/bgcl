'use client'

import { IProgram } from '@/types/entities/program'
import { motion } from 'framer-motion'
import { ChevronLeft, Clock, Users, Calendar, MapPin, FileText, Stamp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import FacilityClosings from '../FacilityClosings'

const ProgramDetailsClient = ({ program }: { program: IProgram }) => {
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
    <div className="dark:bg-neutral-950 bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-40 bg-linear-to-r from-sky-600 to-sky-600">
        {/* Background Image */}
        {program?.heroImage && (
          <Image src={program?.heroImage} alt={program?.name} fill priority className="object-cover object-top" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 dark:bg-black/60 bg-black/40" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Programs
            </Link>
            <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-2xl">{program?.name}</h1>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black dark:text-white text-neutral-900">About This Program</h2>
              <div className="space-y-4 text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                {program?.descriptions && Array.isArray(program.descriptions) && program.descriptions.length > 0 && (
                  <>
                    {program.descriptions.map(
                      (description: string, index: number) => description && <p key={index}>{description}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Program Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {program?.themes && Array.isArray(program.themes) && program.themes.length > 0 && program.showThemes && (
                <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-6 md:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-6 h-6 text-sky-500" />
                    <h3 className="text-lg font-bold dark:text-white text-neutral-900">Weekly Themes</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.themes
                      .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
                      .map((theme: { id: string; title: string; dates: string; order: number }, index) => {
                        const colors = [
                          {
                            badge: 'bg-purple-500'
                          },
                          {
                            badge: 'bg-orange-500'
                          },
                          {
                            badge: 'bg-green-500'
                          }
                        ]
                        const colorScheme = colors[index % 3]

                        return (
                          <div
                            key={theme.id}
                            className={`relative bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg p-4 transition-colors`}
                          >
                            <div
                              className={`absolute -top-3 left-4 ${colorScheme.badge} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
                            >
                              Week {theme.order}
                            </div>
                            <h4 className="text-base font-bold dark:text-white text-neutral-900 mt-2 mb-2">
                              {theme.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                              <Calendar className="w-4 h-4" />
                              <span>{theme.dates}</span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              {program?.additionalDetails &&
                Array.isArray(program.additionalDetails) &&
                program.additionalDetails.length > 0 && (
                  <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-6 md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-6 h-6 text-sky-500" />
                      <h3 className="text-lg font-bold dark:text-white text-neutral-900">Additional Details</h3>
                    </div>
                    <div className="space-y-6">
                      {program.additionalDetails.map(
                        (detail: { title: string; input1: string; input2: string }, index) => (
                          <div key={index} className="border-l-4 border-sky-500 pl-4">
                            <h4 className="text-md font-bold dark:text-white text-neutral-900 mb-3">{detail.title}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {detail.input1 && (
                                <p className="dark:text-neutral-300 text-neutral-700">{detail.input1}</p>
                              )}
                              {detail.input2 && (
                                <p className="dark:text-neutral-300 text-neutral-700">{detail.input2}</p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Right Column - Schedule & CTA */}
          <div className="space-y-6">
            {/* Drop-Off Times */}
            {program?.dropOffStart && program?.dropOffEnd && program?.pickUpStart && program?.pickUpEnd && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-6 space-y-4 lg:sticky lg:top-8"
              >
                <h3 className="text-xl font-black dark:text-white text-neutral-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-500" />
                  Schedule
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="dark:text-sky-400 text-sky-600 text-sm font-semibold mb-1">Drop-Off</p>
                    <p className="dark:text-white text-neutral-900 font-semibold">
                      {program?.dropOffStart} - {program?.dropOffEnd}
                    </p>
                  </div>

                  <div className="dark:border-neutral-700 border-neutral-300 border-t pt-4">
                    <p className="dark:text-sky-400 text-sky-600 text-sm font-semibold mb-1">Pick-Up</p>
                    <p className="dark:text-white text-neutral-900 font-semibold">
                      {program?.pickUpStart} - {program?.pickUpEnd}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <a href="https://parentportal.bgcl.org/" target="_blank" rel="noopener noreferrer" className="block">
                <button className="w-full px-6 py-4 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors">
                  Enroll Now
                </button>
                <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-2">Opens in new window</p>
              </a>
            </motion.div>

            {program?.showAgeGroup && (
              <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-sky-500" />
                  <h3 className="text-lg font-bold dark:text-white text-neutral-900">Age Group</h3>
                </div>
                <p className="dark:text-neutral-300 text-neutral-700 text-lg font-semibold">
                  {program?.ageGroup} years
                </p>
              </div>
            )}

            {program?.location && (
              <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-sky-500" />
                  <h3 className="text-lg font-bold dark:text-white text-neutral-900">Location</h3>
                </div>
                <p className="dark:text-neutral-300 text-neutral-700 text-lg font-semibold">{program?.location}</p>
              </div>
            )}

            {program?.datesAvailable && (
              <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-sky-500" />
                  <h3 className="text-lg font-bold dark:text-white text-neutral-900">Available Dates</h3>
                </div>
                <p className="dark:text-neutral-300 text-neutral-700 text-lg font-semibold">
                  {program?.datesAvailable}
                </p>
              </div>
            )}

            {program?.license && (
              <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-6 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Stamp className="w-6 h-6 text-sky-500" />
                  <h3 className="text-lg font-bold dark:text-white text-neutral-900">Licensing</h3>
                </div>
                <p className="dark:text-neutral-300 text-neutral-700 text-lg font-semibold">{program?.license}</p>
              </div>
            )}

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-6 space-y-3 text-center"
            >
              <h4 className="dark:text-white text-neutral-900 font-bold">Questions?</h4>
              <div className="space-y-2 text-sm">
                <a
                  href="tel:781-593-1772"
                  className="dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-700 font-semibold block transition-colors"
                >
                  (781) 593-1772
                </a>
                <a
                  href="mailto:info@bgcl.org"
                  className="dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-700 font-semibold block transition-colors"
                >
                  info@bgcl.org
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* Closings Section */}
      <FacilityClosings />
    </div>
  )
}

export default ProgramDetailsClient
