'use client'

import { EventCard } from '@/app/components/events/EventCard'
import { Suspense } from 'react'
import { motion } from 'framer-motion'

const EventsClient = ({ events }) => {
  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white py-20 px-6 md:px-12">
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
              Join Us
            </p>
            <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              Upcoming Events
            </h1>
            <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
              Discover community events, programs, and activities happening at Boys & Girls Club of Lynn.
            </p>
          </div>
        </motion.div>

        {/* Events Grid */}
        <section>
          {events?.length === 0 ? (
            <div className="text-center py-12">
              <p className="dark:text-neutral-400 text-neutral-600 text-lg">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events?.map((event) => (
                <Suspense key={event.id} fallback={<EventCardSkeleton />}>
                  <EventCard event={event} />
                </Suspense>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function EventCardSkeleton() {
  return (
    <div className="dark:bg-neutral-800 bg-neutral-100 rounded-lg p-6 animate-pulse space-y-4">
      <div className="h-6 dark:bg-neutral-700 bg-neutral-200 rounded w-3/4" />
      <div className="h-4 dark:bg-neutral-700 bg-neutral-200 rounded w-full" />
      <div className="h-4 dark:bg-neutral-700 bg-neutral-200 rounded w-2/3" />
    </div>
  )
}

export default EventsClient
