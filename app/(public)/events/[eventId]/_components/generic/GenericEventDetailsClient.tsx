import { useCountdown } from '@/lib/hooks/useCountdown'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { formatDate } from '@/lib/utils/date-utils'
import { Ticket } from '@prisma/client'
import { ArrowLeft, Check, Pin, Tag } from 'lucide-react'
import { Pill } from './Pill'
import { Fact } from './Fact'
import { Section } from './Section'
import Link from 'next/link'

const pad = (n: number) => String(n).padStart(2, '0')

const CalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)

export default function GenericEventDetailsClient({ data: event }) {
  const c = useCountdown(event.date)

  const eventDate = new Date(event.date)
  const spotsLeft = event.capacity - event.attendeeCount
  const pctFull = Math.round((event.attendeeCount / event.capacity) * 100)

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
        {/* ══ HERO ══ */}
        <header className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
            {/* back to events */}
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 -ml-1 mb-8 px-1 py-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 rounded"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              All Events
            </Link>
            {/* status + category pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Pill tone="accent">{event.status === 'UPCOMING' ? 'Upcoming' : event.status}</Pill>
              {event.category && <Pill>{event.category}</Pill>}
              {event.type === 'IN_PERSON' && <Pill>In person</Pill>}
            </div>

            {event.subtitle && (
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-3">
                {event.subtitle}
              </p>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4">
              {event.title}
            </h1>

            {event.tagline && (
              <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl">{event.tagline}</p>
            )}

            {/* key facts */}
            <div className="grid sm:grid-cols-3 gap-6 mt-10 pt-10 border-t border-neutral-200 dark:border-neutral-800">
              <Fact icon={<CalIcon />} label="Date">
                {formatDate(event.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                <span className="block text-neutral-500 dark:text-neutral-500 mt-0.5">
                  {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  {event.duration && ` · ${event.duration}`}
                </span>
              </Fact>
              <Fact icon={<Pin />} label="Location">
                {event.location}
                {event.address && (
                  <span className="block text-neutral-500 dark:text-neutral-500 mt-0.5">{event.address}</span>
                )}
              </Fact>
              {event.dresscode && (
                <Fact icon={<Tag />} label="Attire">
                  {event.dresscode}
                </Fact>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-10">
              <button className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950">
                Get Tickets
              </button>
              <button className="px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950">
                Add to Calendar
              </button>
            </div>
          </div>
        </header>

        {/* ══ COUNTDOWN ══ */}
        {!c.done && (
          <section className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
            <div className="max-w-5xl mx-auto px-5 sm:px-6 py-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-1">
                    Starts in
                  </p>
                  {event.ticketSalesStartDate && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Tickets on sale {formatDate(event.ticketSalesStartDate, { month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 sm:gap-4">
                  {[
                    { v: c.days, l: 'Days' },
                    { v: c.hours, l: 'Hrs' },
                    { v: c.minutes, l: 'Min' },
                    { v: c.seconds, l: 'Sec' }
                  ].map((u) => (
                    <div key={u.l} className="text-center min-w-15.5">
                      <div className="rounded-lg py-3 px-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                        <span className="block text-2xl sm:text-3xl font-bold tabular-nums">{pad(u.v)}</span>
                      </div>
                      <span className="block mt-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                        {u.l}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-3 gap-12">
          {/* ══ MAIN COLUMN ══ */}
          <div className="lg:col-span-2 space-y-14">
            {event.description && (
              <Section title="About this event">
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </Section>
            )}

            {/* Tickets */}
            <Section title="Tickets">
              <div className="space-y-3">
                {event?.tickets?.map((t: Ticket) => {
                  const remaining = t.totalQuantity - t.quantitySold
                  const soldOut = remaining <= 0
                  const low = !soldOut && remaining <= t.totalQuantity * 0.2
                  return (
                    <div
                      key={t.id}
                      className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{t.name}</h3>
                            {soldOut && <Pill tone="muted">Sold out</Pill>}
                            {low && <Pill tone="warn">{remaining} left</Pill>}
                          </div>
                          {t.description && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{t.description}</p>
                          )}
                          {t.guestCount > 1 && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                              Admits {t.guestCount} guests
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold">{formatCurrency(t.price)}</p>
                        </div>
                      </div>

                      {t.sponsorImpact && (
                        <p className="text-sm text-sky-700 dark:text-sky-400 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                          {t.sponsorImpact}
                        </p>
                      )}

                      {t.sponsorPerks?.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {t.sponsorPerks.map((p) => (
                            <li
                              key={p}
                              className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                            >
                              <Check />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}

                      <button
                        disabled={soldOut}
                        className="mt-4 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
                      >
                        {soldOut ? 'Unavailable' : `Select ${t.name}`}
                      </button>
                    </div>
                  )
                })}
              </div>
            </Section>

            {/* Dress code */}
            {(event.dressCodeHeadline || event.dressCodeItems?.length > 0) && (
              <Section title={event.dressCodeHeadline || 'What to wear'}>
                {event.dressCodeItems?.length > 0 && (
                  <ul className="space-y-3">
                    {event.dressCodeItems.map((d) => (
                      <li key={d.label} className="flex gap-3">
                        <Check />
                        <div>
                          <p className="font-medium">{d.label}</p>
                          {d.description && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">{d.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {event.dressCodeNote && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-4 italic">{event.dressCodeNote}</p>
                )}
              </Section>
            )}

            {event.missionStatement && (
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-6">
                <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {event.missionStatement}
                </p>
              </div>
            )}
          </div>

          {/* ══ SIDEBAR ══ */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-5">
              {/* capacity */}
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-3">
                  Attendance
                </p>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-bold">{event.attendeeCount}</span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-500">of {event.capacity}</span>
                </div>
                <div
                  className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={pctFull}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${pctFull}% of capacity reserved`}
                >
                  <div className="h-full bg-sky-600 rounded-full transition-all" style={{ width: `${pctFull}%` }} />
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{spotsLeft} spots remaining</p>
              </div>

              {/* RSVP deadline */}
              {event.requiresRSVP && event.rsvpDeadline && (
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-2">
                    RSVP by
                  </p>
                  <p className="font-semibold">
                    {formatDate(event.rsvpDeadline, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )}

              {/* host */}
              {event.host && (
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-2">
                    Hosted by
                  </p>
                  <p className="font-semibold">{event.host}</p>
                  {event.website && (
                    <a
                      href={`https://${event.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-sky-600 dark:text-sky-400 hover:underline mt-1 inline-block"
                    >
                      {event.website}
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
