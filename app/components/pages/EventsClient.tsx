'use client'

import { EventCard } from '@/app/components/events/EventCard'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import Link from 'next/link'

const EventsClient = ({ events }) => {
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
          {events?.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-neutral-400 dark:text-neutral-600" />
                  </div>
                </div>

                {/* Text */}
                <h3 className="text-xl font-bold dark:text-white text-neutral-900 mb-2">No Events Available</h3>
                <p className="dark:text-neutral-400 text-neutral-600 mb-6">
                  There are no upcoming events at the moment. Check back soon for new events and ticket sales!
                </p>

                {/* Call to Action */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:text-neutral-300 text-neutral-700 rounded-lg transition-colors font-medium"
                  >
                    About Us
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events?.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default EventsClient
