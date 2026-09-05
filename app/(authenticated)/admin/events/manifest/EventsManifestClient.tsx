'use client'

import { useMemo, useState } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import { IOrder } from '@/types/entities/order'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'
import { formatDate } from '@/lib/utils/date-utils'

type PurchaseLine = {
  ticketName: string
  quantity: number
  seats: number
  admits: boolean
}

type Buyer = {
  key: string
  name: string
  email: string
  purchasedAt: Date | string
  totalTickets: number
  seats: number
  attendingEvent: boolean
  lines: PurchaseLine[]
  orderCount: number
}

type EventGroup = {
  eventId: string
  eventName: string
  eventDate: Date | string | null
  buyers: Buyer[]
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

export default function EventsManifestClient({ data }: { data: IOrder[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (key: string) =>
    setExpanded((current) => {
      const next = new Set(current)

      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      return next
    })

  const eventGroups = useMemo<EventGroup[]>(() => {
    const map = new Map<string, EventGroup>()

    data.forEach((order) => {
      const event = order.event ?? order.orderItems?.[0]?.ticket?.event ?? null
      const eventId = order.eventId ?? event?.id ?? 'unknown'

      if (!map.has(eventId)) {
        map.set(eventId, {
          eventId,
          eventName: event?.title ?? 'Unknown event',
          eventDate: event?.date ?? null,
          buyers: []
        })
      }

      // A line admits people when its ticket carries seats. Ads and other
      // non-admitting items still show in the breakdown, but not in the totals.
      const lines: PurchaseLine[] = (order.orderItems ?? []).map((item) => {
        const perTicket = item.ticket?.guestCount ?? 1
        const quantity = item.quantity ?? 1

        return {
          ticketName: item.ticket?.name ?? 'Unknown ticket',
          quantity,
          seats: perTicket * quantity,
          admits: perTicket > 0
        }
      })

      const admitting = lines.filter((line) => line.admits)

      const group = map.get(eventId)!
      const existing = group.buyers.find((buyer) => buyer.email === order.customerEmail)

      if (existing) {
        // Same person bought again, so merge every figure and keep the first purchase
        existing.totalTickets += admitting.reduce((sum, line) => sum + line.quantity, 0)
        existing.seats += admitting.reduce((sum, line) => sum + line.seats, 0)
        existing.orderCount += 1
        existing.attendingEvent = existing.attendingEvent || order.attendingEvent !== false

        lines.forEach((line) => {
          const match = existing.lines.find((l) => l.ticketName === line.ticketName)

          if (match) {
            match.quantity += line.quantity
            match.seats += line.seats
          } else {
            existing.lines.push(line)
          }
        })

        if (new Date(order.createdAt) < new Date(existing.purchasedAt)) {
          existing.purchasedAt = order.createdAt
        }
      } else {
        group.buyers.push({
          key: `${eventId}:${order.customerEmail}`,
          name: order.customerName,
          email: order.customerEmail,
          purchasedAt: order.createdAt,
          totalTickets: admitting.reduce((sum, line) => sum + line.quantity, 0),
          seats: admitting.reduce((sum, line) => sum + line.seats, 0),
          attendingEvent: order.attendingEvent !== false,
          lines,
          orderCount: 1
        })
      }
    })

    return Array.from(map.values())
      .sort((a, b) => {
        if (!a.eventDate) return 1
        if (!b.eventDate) return -1
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      })
      .map((group) => ({
        ...group,
        buyers: group.buyers.sort((a, b) => b.seats - a.seats)
      }))
  }, [data])

  const query = searchQuery.trim().toLowerCase()

  const filtered = useMemo(
    () =>
      eventGroups
        .map((group) => ({
          ...group,
          buyers: query
            ? group.buyers.filter(
                (buyer) => buyer.name?.toLowerCase().includes(query) || buyer.email?.toLowerCase().includes(query)
              )
            : group.buyers
        }))
        .filter((group) => group.buyers.length > 0),
    [eventGroups, query]
  )

  const totalBuyers = eventGroups.reduce((sum, group) => sum + group.buyers.length, 0)
  const totalSeats = eventGroups.reduce((sum, group) => sum + group.buyers.reduce((s, b) => s + b.seats, 0), 0)

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader
        title="Manifest"
        meta={`${plural(eventGroups.length, 'event')} · ${plural(totalBuyers, 'buyer')} · ${plural(totalSeats, 'seat')}`}
      />

      <div className="px-6 py-6 lg:px-8">
        <div className="relative w-full sm:w-72 mb-6">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search buyers by name or email"
            placeholder="Search name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center" role="status" aria-live="polite">
            <p className="text-sm text-neutral-400 dark:text-neutral-600">
              {query ? 'No buyers match that search.' : 'Buyers will appear here once tickets are sold.'}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((group) => {
              const seats = group.buyers.reduce((sum, buyer) => sum + buyer.seats, 0)
              const tickets = group.buyers.reduce((sum, buyer) => sum + buyer.totalTickets, 0)
              const notAttending = group.buyers.filter((buyer) => !buyer.attendingEvent).length

              return (
                <section key={group.eventId}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-3 mb-1 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-baseline gap-3 min-w-0">
                      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{group.eventName}</h2>
                      {group.eventDate && (
                        <span className="text-xs text-neutral-400 dark:text-neutral-600">
                          {formatDate(new Date(group.eventDate))}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                      {plural(group.buyers.length, 'buyer')} · {plural(tickets, 'ticket')} · {plural(seats, 'seat')}
                      {notAttending > 0 && ` · ${notAttending} not attending`}
                    </p>
                  </div>

                  <ul role="list" className="list-none p-0 m-0 divide-y divide-neutral-100 dark:divide-neutral-900">
                    {group.buyers.map((buyer) => {
                      const isOpen = expanded.has(buyer.key)

                      return (
                        <li key={buyer.key}>
                          <button
                            type="button"
                            onClick={() => toggle(buyer.key)}
                            aria-expanded={isOpen}
                            className="w-full text-left py-3 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors focus:outline-none"
                          >
                            <ChevronRight
                              className={`w-3.5 h-3.5 shrink-0 text-neutral-400 dark:text-neutral-600 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                              aria-hidden="true"
                            />

                            <span className="flex-1 min-w-0">
                              <span className="block text-sm text-neutral-900 dark:text-white truncate">{buyer.name}</span>
                              <span className="block text-xs text-neutral-400 dark:text-neutral-600 truncate">{buyer.email}</span>
                            </span>

                            <span className="shrink-0 text-right">
                              <span className="block text-sm text-neutral-900 dark:text-white tabular-nums">
                                {plural(buyer.seats, 'seat')}
                              </span>
                              <span className="block text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                                {plural(buyer.totalTickets, 'ticket')}
                                {!buyer.attendingEvent && ' · not attending'}
                              </span>
                            </span>
                          </button>

                          {isOpen && (
                            <div className="pb-3 pl-7">
                              <ul role="list" className="list-none p-0 m-0 space-y-1 max-w-sm">
                                {buyer.lines.map((line) => (
                                  <li key={line.ticketName} className="flex items-baseline justify-between gap-4 text-[13px]">
                                    <span className="text-neutral-500 dark:text-neutral-400 truncate">
                                      {line.quantity} × {line.ticketName}
                                    </span>
                                    <span className="shrink-0 text-neutral-400 dark:text-neutral-600 tabular-nums">
                                      {line.admits ? plural(line.seats, 'seat') : 'no seats'}
                                    </span>
                                  </li>
                                ))}
                              </ul>

                              <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-600">
                                Purchased {formatDate(new Date(buyer.purchasedAt))}
                                {buyer.orderCount > 1 && ` · ${plural(buyer.orderCount, 'order')}`}
                              </p>
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
