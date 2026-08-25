'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Users } from 'lucide-react'
import { IOrder } from '@/types/entities/order'
import { EventGroup } from './_types/event-manifest.types'
import { EventSection } from './_components/EventSection'

export default function EventsManifestClient({ data }: { data: IOrder[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  // Group orders by event
  const eventGroups = useMemo<EventGroup[]>(() => {
    const map = new Map<string, EventGroup>()

    data.forEach((order) => {
      const event = order.event ?? order.orderItems?.[0]?.ticket?.event ?? null
      const eventId = order.eventId ?? event?.id ?? 'unknown'
      const eventName = event?.title ?? 'Unknown Event'
      const eventDate = event?.date ?? null
      const totalTickets = order.orderItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

      if (!map.has(eventId)) {
        map.set(eventId, { eventId, eventName, eventDate, attendees: [] })
      }

      const group = map.get(eventId)!
      const existing = group.attendees.find((a) => a.email === order.customerEmail)

      if (existing) {
        // Same person bought more tickets — merge
        existing.totalTickets += totalTickets
        // Keep the earliest purchase date
        if (new Date(order.createdAt) < new Date(existing.purchasedAt)) {
          existing.purchasedAt = order.createdAt
        }
      } else {
        group.attendees.push({
          orderId: order.id,
          name: order.customerName,
          email: order.customerEmail,
          purchasedAt: order.createdAt,
          totalTickets,
          attendingEvent: order.attendingEvent !== false,
          guestCount:
            order.attendingEvent !== false
              ? order.orderItems?.reduce((sum, t) => sum + (t.ticket.guestCount ?? 1) * (t.quantity ?? 1), 0)
              : 0
        })
      }
    })

    return Array.from(map.values())
      .sort((a, b) => {
        if (!a.eventDate) return 1
        if (!b.eventDate) return -1
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      })
      .map((g) => ({
        ...g,
        attendees: g.attendees.sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
      }))
  }, [data])

  const totalEvents = eventGroups.length

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col min-w-0">
      <div className="flex-1 overflow-y-auto px-3 sm:px-8 pb-6 pt-4">
        <div className="space-y-4">
          {/* Stats */}
          <div className="overflow-x-auto pb-1">
            <div className="flex items-center gap-4 min-w-max">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Events
                </span>
                <span className="text-sm font-black dark:text-white text-neutral-900">{totalEvents}</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search attendees by name or email"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Event groups */}
          {eventGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400"
              role="status"
              aria-live="polite"
            >
              <Users className="w-12 h-12 mb-3 opacity-30" aria-hidden="true" />
              <p className="text-lg font-medium">No attendees yet</p>
              <p className="text-sm">Ticket purchases will appear here</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {eventGroups.map((group) => (
                <EventSection key={group.eventId} group={group} searchQuery={searchQuery} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
