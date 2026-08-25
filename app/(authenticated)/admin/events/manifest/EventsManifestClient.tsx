'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { IOrder } from '@/types/entities/order'
import { EventGroup } from './_types/event-manifest.types'
import { EventSection } from './_components/EventSection'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'

export default function EventsManifestClient({ data }: { data: IOrder[] }) {
  const [searchQuery, setSearchQuery] = useState('')

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
        // Same person bought more tickets, so merge and keep the earliest purchase
        existing.totalTickets += totalTickets

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

  const totalAttendees = eventGroups.reduce((sum, g) => sum + g.attendees.length, 0)
  const totalGuests = eventGroups.reduce((sum, g) => sum + g.attendees.reduce((s, a) => s + (a.guestCount ?? 0), 0), 0)

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader
        title="Manifest"
        meta={`${eventGroups.length} ${eventGroups.length === 1 ? 'event' : 'events'} · ${totalAttendees} purchasers · ${totalGuests} guests`}
      />

      <div className="px-6 py-6 lg:px-8">
        <div className="relative w-full sm:w-72 mb-5">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search attendees by name or email"
            placeholder="Search name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
        </div>

        {eventGroups.length === 0 ? (
          <div className="py-16 text-center" role="status" aria-live="polite">
            <p className="text-sm text-neutral-400 dark:text-neutral-600">
              Attendees will appear here once tickets are sold.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {eventGroups.map((group) => (
              <EventSection key={group.eventId} group={group} searchQuery={searchQuery} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
