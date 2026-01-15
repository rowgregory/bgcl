'use client'

import { EventCard } from '@/app/components/events/EventCard'
import { Suspense } from 'react'
import { motion } from 'framer-motion'

const EventsClient = ({ events }) => {
  return (
    <div className="h-[calc(100vh-504px)]">
      {/* Hero Section */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
            <p className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Join Us</p>
            <h1 className="text-5xl font-bold text-white">Upcoming Events</h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Discover community events, programs, and activities happening at Boys & Girls Club of Lynn.
            </p>
          </motion.div>
        </div>
      </div>
      {/* Events Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {events?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">No events found</p>
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
        </div>
      </section>
    </div>
  )
}

function EventCardSkeleton() {
  return (
    <div className="bg-zinc-800 rounded-lg p-6 animate-pulse space-y-4">
      <div className="h-6 bg-zinc-700 rounded w-3/4" />
      <div className="h-4 bg-zinc-700 rounded w-full" />
      <div className="h-4 bg-zinc-700 rounded w-2/3" />
    </div>
  )
}

export default EventsClient
