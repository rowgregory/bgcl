'use client'

import { IProgram } from '@/types/entities/program'
import { motion } from 'framer-motion'
import { ChevronLeft, Clock, Users, Calendar, MapPin, FileText, Stamp } from 'lucide-react'
import Link from 'next/link'
import FacilityClosings from '@/components/_shared/FacilityClosings'
import { IClosing } from '@/types/entities/closing'
import { useMemo } from 'react'
import Picture from '@/components/_shared/Picture'

export const ProgramDetailsClient = ({ program, closings }: { program: IProgram; closings: IClosing[] }) => {
  const gradient = useMemo(() => {
    const gradients = [
      'from-sky-500 to-cyan-600',
      'from-purple-500 to-indigo-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-orange-600'
    ]
    return gradients[Math.floor(Math.random() * gradients.length)]
  }, [])

  if (Object.keys(program).length === 0) {
    return (
      <main id="main-content" className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Program Not Found</h1>
          <Link
            href="/programs"
            className="inline-block px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Back to Programs
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main id="main-content" className="dark:bg-neutral-950 bg-white min-h-screen pb-28 md:pb-0">
      {/* Back Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-3 sm:py-4"
      >
        <div className="max-w-334 mx-auto px-4 sm:px-6 md:px-12">
          <Link
            href="/programs"
            aria-label="Back to all programs"
            className="inline-flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-sm sm:text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            Back to Programs
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 sm:py-16 md:py-20">
        <div aria-hidden="true" className={`absolute inset-0 bg-linear-to-r ${gradient}`} />
        <div aria-hidden="true" className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>
        <div className="max-w-334 mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg">
              {program?.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-334 mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12"
        >
          {/* Left Column - Description */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <section aria-labelledby="about-heading">
              <div className="space-y-3 sm:space-y-4">
                <h2 id="about-heading" className="text-2xl sm:text-3xl font-black dark:text-white text-neutral-900">
                  About This Program
                </h2>
                <div className="space-y-3 sm:space-y-4 text-base sm:text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
                  {program?.descriptions?.map(
                    (description: string, index: number) => description && <p key={index}>{description}</p>
                  )}
                </div>
              </div>
            </section>

            {/* PDF Section */}
            {program?.pdfLink && program?.pdfDescription && (
              <section aria-labelledby="pdf-heading">
                <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" aria-hidden="true" />
                    <h2 id="pdf-heading" className="text-base sm:text-lg font-bold dark:text-white text-neutral-900">
                      Program PDF
                    </h2>
                  </div>

                  {program?.pdfDescription && (
                    <p className="text-sm sm:text-base dark:text-neutral-300 text-neutral-700 leading-relaxed mb-4">
                      {program.pdfDescription}
                    </p>
                  )}

                  {program?.pdfLink && (
                    <a
                      href={program.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Download program PDF (opens in new tab)"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                    >
                      <FileText className="w-4 h-4" aria-hidden="true" />
                      View PDF
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Program Details Grid */}
            <div className="grid grid-cols-1 gap-6">
              {/* Weekly Themes */}
              {program?.themes && Array.isArray(program.themes) && program.showThemes && (
                <section
                  aria-labelledby="themes-heading"
                  className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-4 sm:p-6"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" aria-hidden="true" />
                    <h2 id="themes-heading" className="text-base sm:text-lg font-bold dark:text-white text-neutral-900">
                      Weekly Themes
                    </h2>
                  </div>
                  <ul
                    aria-label="Weekly themes list"
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 list-none p-0"
                  >
                    {program.themes
                      .sort((a: { order: number }, b: { order: number }) => a.order - b.order)
                      .map((theme: { id: string; title: string; dates: string; order: number }, index: number) => {
                        const colors = [
                          { badge: 'bg-purple-500' },
                          { badge: 'bg-orange-500' },
                          { badge: 'bg-green-500' }
                        ]
                        const colorScheme = colors[index % 3]

                        return (
                          <li
                            key={theme.id}
                            className="relative bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg p-3 sm:p-4 transition-colors"
                          >
                            <div
                              aria-hidden="true"
                              className={`absolute -top-2 sm:-top-3 left-3 sm:left-4 ${colorScheme.badge} text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg`}
                            >
                              Week {theme.order}
                            </div>
                            <h3 className="text-sm sm:text-base font-bold dark:text-white text-neutral-900 mt-2 mb-2">
                              <span className="sr-only">Week {theme.order}: </span>
                              {theme.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                              <span>{theme.dates}</span>
                            </div>
                          </li>
                        )
                      })}
                  </ul>
                </section>
              )}

              {/* Additional Details */}
              {program?.additionalDetails && Array.isArray(program.additionalDetails) && (
                <section
                  aria-labelledby="additional-details-heading"
                  className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-4 sm:p-6"
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" aria-hidden="true" />
                    <h2
                      id="additional-details-heading"
                      className="text-base sm:text-lg font-bold dark:text-white text-neutral-900"
                    >
                      Additional Details
                    </h2>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    {program.additionalDetails.map(
                      (detail: { title: string; input1: string; input2: string }, index: number) => (
                        <div key={index} className="border-l-4 border-sky-500 pl-3 sm:pl-4">
                          <h3 className="text-sm sm:text-base font-bold dark:text-white text-neutral-900 mb-2 sm:mb-3">
                            {detail.title}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                            {detail.input1 && (
                              <p className="dark:text-neutral-300 text-neutral-700 text-sm sm:text-base">
                                {detail.input1}
                              </p>
                            )}
                            {detail.input2 && (
                              <p className="dark:text-neutral-300 text-neutral-700 text-sm sm:text-base">
                                {detail.input2}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Right Column - Schedule & CTA */}
          <aside aria-label="Program details and enrollment" className="space-y-4 sm:space-y-6">
            {/* Schedule */}
            {program?.dropOffStart && program?.dropOffEnd && program?.pickUpStart && program?.pickUpEnd && (
              <motion.section
                aria-labelledby="schedule-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4 lg:sticky lg:top-8"
              >
                <h2
                  id="schedule-heading"
                  className="text-lg sm:text-xl font-black dark:text-white text-neutral-900 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" aria-hidden="true" />
                  Schedule
                </h2>
                <dl className="space-y-3 sm:space-y-4">
                  <div>
                    <dt className="dark:text-sky-400 text-sky-600 text-xs sm:text-sm font-semibold mb-1">Drop-Off</dt>
                    <dd className="dark:text-white text-neutral-900 font-semibold text-sm sm:text-base">
                      {program.dropOffStart} - {program.dropOffEnd}
                    </dd>
                  </div>
                  <div className="dark:border-neutral-700 border-neutral-300 border-t pt-3 sm:pt-4">
                    <dt className="dark:text-sky-400 text-sky-600 text-xs sm:text-sm font-semibold mb-1">Pick-Up</dt>
                    <dd className="dark:text-white text-neutral-900 font-semibold text-sm sm:text-base">
                      {program.pickUpStart} - {program.pickUpEnd}
                    </dd>
                  </div>
                </dl>
              </motion.section>
            )}

            {/* Program Image */}
            {program?.image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg"
              >
                <Picture
                  src={program.image}
                  alt={`${program.name} program photo`}
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover w-full h-full"
                />
              </motion.div>
            )}
            {/* Program Image 2*/}
            {program?.imageTwo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg"
              >
                <Picture
                  src={program.imageTwo}
                  alt={`${program.name} program photo`}
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover w-full h-full"
                />
              </motion.div>
            )}

            {/* Enroll CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <a
                href="https://parentportal.bgcl.org/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Enroll in ${program?.name} - opens in a new tab`}
                className={`block w-full px-6 py-3 sm:py-4 bg-linear-to-r ${gradient} text-white font-bold rounded-lg transition-colors text-sm sm:text-base text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2`}
              >
                Enroll Now
              </a>
              <p
                className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-500 mt-2 text-center"
                aria-hidden="true"
              >
                Opens in new window
              </p>
            </motion.div>

            {/* Age Group */}
            {program?.showAgeGroup && (
              <div
                aria-labelledby="age-group-heading"
                className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" aria-hidden="true" />
                  <h2
                    id="age-group-heading"
                    className="text-base sm:text-lg font-bold dark:text-white text-neutral-900"
                  >
                    Age Group
                  </h2>
                </div>
                <p className="dark:text-neutral-300 text-neutral-700 text-base sm:text-lg font-semibold">
                  {program.ageGroup} years
                </p>
              </div>
            )}

            {/* Location */}
            {program?.location && (
              <div
                aria-labelledby="location-heading"
                className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" aria-hidden="true" />
                  <h2 id="location-heading" className="text-base sm:text-lg font-bold dark:text-white text-neutral-900">
                    Location
                  </h2>
                </div>
                <p className="dark:text-neutral-300 text-neutral-700 text-base sm:text-lg font-semibold">
                  {program.location}
                </p>
              </div>
            )}

            {/* Available Dates */}
            {program?.datesAvailable && (
              <div
                aria-labelledby="dates-heading"
                className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" aria-hidden="true" />
                  <h2 id="dates-heading" className="text-base sm:text-lg font-bold dark:text-white text-neutral-900">
                    Available Dates
                  </h2>
                </div>
                <p className="dark:text-neutral-300 text-neutral-700 text-base sm:text-lg font-semibold">
                  {program.datesAvailable}
                </p>
              </div>
            )}

            {/* Licensing */}
            {program?.license && (
              <div
                aria-labelledby="license-heading"
                className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Stamp className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" aria-hidden="true" />
                  <h2 id="license-heading" className="text-base sm:text-lg font-bold dark:text-white text-neutral-900">
                    Licensing
                  </h2>
                </div>
                <p className="dark:text-neutral-300 text-neutral-700 text-base sm:text-lg font-semibold">
                  {program.license}
                </p>
              </div>
            )}

            {/* External Link */}
            {program?.externalLink && (
              <div
                aria-labelledby="program-docs-heading"
                className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-4 sm:p-6"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" aria-hidden="true" />
                  <h2
                    id="program-docs-heading"
                    className="text-base sm:text-lg font-bold dark:text-white text-neutral-900"
                  >
                    Program Details
                  </h2>
                </div>

                <a
                  href={program.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View PDF document for ${program.name} - opens in a new tab`}
                  className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 hover:text-sky-700 dark:hover:text-sky-300 text-base sm:text-lg font-semibold transition-colors duration-200 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                >
                  View PDF Document
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}

            {/* Contact Card */}
            <motion.section
              aria-labelledby="contact-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-lg p-4 sm:p-6 space-y-2 sm:space-y-3 text-center"
            >
              <h2 id="contact-heading" className="dark:text-white text-neutral-900 font-bold text-sm sm:text-base">
                Questions?
              </h2>
              <div className="space-y-2 text-xs sm:text-sm">
                <a
                  href="tel:781-593-1772"
                  aria-label="Call us at 781-593-1772"
                  className="dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-700 font-semibold block transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                >
                  (781) 593-1772
                </a>

                <a
                  href="mailto:info@bgcl.org"
                  aria-label="Email us at info@bgcl.org"
                  className="dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-700 font-semibold block transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                >
                  info@bgcl.org
                </a>
              </div>
            </motion.section>
          </aside>
        </motion.div>
      </div>

      <FacilityClosings closings={closings} />
    </main>
  )
}
