'use client'

import { EventCard } from '@/app/components/events/EventCard'
import { motion } from 'framer-motion'
import { Calendar, Heart, Home, Users } from 'lucide-react'
import Link from 'next/link'
import Picture from '../common/Picture'

const EventsClient = ({ events }) => {
  if (events?.length === 0) {
    return (
      <div className="min-h-[calc(100vh-699px)] bg-white dark:bg-neutral-950 flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Link href="/" className="h-28 inline-flex mb-10">
              <Picture
                src="/images/vertical-logo-light.png"
                alt="Boys & Girls Club"
                className="dark:hidden block w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                priority={true}
              />
              <Picture
                src="/images/vertical-logo-dark.png"
                alt="Boys & Girls Club"
                className="dark:block hidden w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                priority={true}
              />
            </Link>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              No Events Available
            </h1>

            {/* Description */}
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              There are no upcoming events at the moment. Check back soon for new events and ticket sales!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donate"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-[5px] transition-all shadow-lg shadow-sky-500/25"
              >
                <Calendar className="w-5 h-5" />
                Donate
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-[5px] transition-colors border border-neutral-200 dark:border-neutral-700"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </div>
            {/* Decorative Elements */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Calendar className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Year-Round Events</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Users className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Community Focused</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Heart className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Family Friendly</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="dark:bg-neutral-950 bg-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                Join Us
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                Upcoming Events
              </h1>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                Discover community events, programs, and activities happening at Boys & Girls Club of Lynn.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        {/* Events Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default EventsClient
