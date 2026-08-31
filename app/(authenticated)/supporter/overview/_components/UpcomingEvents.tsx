import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600'

const formatEventDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/New_York'
  })

export function UpcomingEvents({ dashboard }) {
  const events = dashboard?.upcomingEvents ?? []
  const myEvents = dashboard?.myUpcomingEvents ?? []

  if (events.length === 0) return null

  return (
    <motion.section
      aria-labelledby="events-heading"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <h2 id="events-heading" className={labelCls}>
          Upcoming events
        </h2>

        <Link
          href="/events"
          className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          All events
        </Link>
      </div>

      <ul role="list" className="divide-y divide-neutral-100 dark:divide-neutral-900 list-none p-0 m-0">
        {events.map((event) => {
          // Ticket details only exist for events this supporter bought into
          const mine = myEvents.find((g) => g.eventId === event.id)

          return (
            <li key={event.id} className="py-4 first:pt-0">
              <div className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-neutral-900 dark:text-white truncate">{event.title}</p>

                  <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                    {formatEventDate(event.date)}
                    {event.location && ` · ${event.location}`}
                  </p>
                </div>

                {!mine && (
                  <Link
                    href={`/events/${event.id}`}
                    className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors shrink-0 inline-flex items-center gap-1"
                  >
                    Get tickets
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                )}
              </div>

              {mine && (
                <ul
                  role="list"
                  aria-label={`Your tickets for ${event.title}`}
                  className="mt-3 space-y-1.5 list-none p-0"
                >
                  {mine.orderItems.map((item, i) => (
                    <li key={i}>
                      <div className="flex items-baseline justify-between gap-4 text-[13px]">
                        <span className="text-neutral-500 dark:text-neutral-400 truncate">{item.ticketName}</span>
                        <span className="text-neutral-400 dark:text-neutral-600 tabular-nums shrink-0">
                          ×{item.quantity}
                        </span>
                      </div>

                      {event.showRaffleTicketNumbers && item.raffleTickets?.length > 0 && (
                        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5">
                          {item.raffleTickets
                            .slice()
                            .sort((a, b) => a.number - b.number)
                            .map((rt) => (
                              <span
                                key={rt.code}
                                className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 tabular-nums"
                              >
                                #{String(rt.number).padStart(4, '0')}
                              </span>
                            ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </motion.section>
  )
}
