'use client'

import { EventCard } from '@/components/events/EventCard'
import { motion } from 'framer-motion'
import { Calendar, Heart, Home, Users } from 'lucide-react'
import Link from 'next/link'
import Picture from '@/components/_shared/Picture'

export function PublicEventsClient({ events, pageData }) {
  const t = pageData?.sections?.events
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:px-4 focus-visible:py-2 focus-visible:bg-sky-600 focus-visible:text-white focus-visible:font-semibold focus-visible:rounded-lg focus-visible:shadow-lg"
      >
        Skip to main content
      </a>

      <main id="main-content" className="bg-white dark:bg-neutral-950">
        {!events || events?.length === 0 ? (
          <div className="min-h-[calc(100vh-699px)] flex flex-col items-center justify-center px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <Link href="/" passHref className="h-28 inline-flex mb-10">
                <Picture
                  src="/images/vertical-logo-light.png"
                  alt="Boys & Girls Club logo, light mode"
                  className="dark:hidden block w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                  priority
                />
                <Picture
                  src="/images/vertical-logo-dark.png"
                  alt="Boys & Girls Club logo, dark mode"
                  className="dark:block hidden w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                  priority
                />
              </Link>

              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                No Events Available
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                There are no upcoming events at the moment. Check back soon for new events and ticket sales!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/donate"
                  passHref
                  className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-[5px] transition-all shadow-lg shadow-sky-500/25"
                >
                  <Calendar className="w-5 h-5" aria-hidden="true" />
                  Donate
                </Link>
                <Link
                  href="/"
                  passHref
                  className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-[5px] transition-colors border border-neutral-200 dark:border-neutral-700"
                >
                  <Home className="w-5 h-5" aria-hidden="true" />
                  Go Home
                </Link>
              </div>

              <section aria-label="Event Highlights" className="grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: Calendar, label: 'Year-Round Events' },
                  { icon: Users, label: 'Community Focused' },
                  { icon: Heart, label: 'Family Friendly' }
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800"
                  >
                    <Icon className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{label}</p>
                  </div>
                ))}
              </section>
            </motion.div>
          </div>
        ) : (
          <>
            <header className="px-4 sm:px-6 md:px-12 pt-12 sm:pt-16 pb-8 sm:pb-10" aria-label="Upcoming Events Hero">
              <div className="max-w-334 mx-auto">
                <motion.div
                  className="space-y-4 sm:space-y-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                      {t?.eyebrow}
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                      {t?.heading}
                    </h1>
                    <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                      {t?.subheading}
                    </p>
                  </div>
                </motion.div>
              </div>
            </header>

            <section aria-label="Events List" className="px-4 sm:px-6 md:px-12 pb-12 sm:pb-16 md:pb-20">
              <div className="max-w-334 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events?.map((event) => (
                    <EventCard key={event?.id} event={event} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  )
}
