'use client'

import { containerVariants, itemVariants } from '@/lib/constants/motion'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Ticket, Users, Clock, CheckCircle } from 'lucide-react'
import { useMemo } from 'react'
import { SaleWindowBadge } from './_components/SalesWindowBadge'
import { colorMap, COLORS } from './_events-overview.constants'
import { AdminPageHeader } from '../../_components/AdminPageHeader'
import { ExportEventsButton } from '../_components/ExportEventsButton'

export function EventsOverviewClient({ data }) {
  const { stats, events } = data

  const topStats = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      description: 'From confirmed ticket sales',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      id: 'tickets',
      label: 'Tickets Sold',
      value: stats.totalTicketsSold.toLocaleString(),
      description: 'Across all events',
      icon: Ticket,
      color: 'sky'
    },
    {
      id: 'attendees',
      label: 'Total Attendees',
      value: stats.totalAttendees.toLocaleString(),
      description: 'Cumulative attendance',
      icon: Users,
      color: 'indigo'
    },
    {
      id: 'events',
      label: 'Total Events',
      value: stats.totalEvents.toLocaleString(),
      description: `${stats.pastCount} past, ${stats.upcomingCount} upcoming`,
      icon: Calendar,
      color: 'violet'
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      value: stats.upcomingCount.toLocaleString(),
      description: 'Events scheduled',
      icon: Clock,
      color: 'amber'
    },
    {
      id: 'past',
      label: 'Completed',
      value: stats.pastCount.toLocaleString(),
      description: 'Events finished',
      icon: CheckCircle,
      color: 'neutral'
    }
  ]

  const DAY_MS = 86_400_000

  const ticketTotals = (event) => {
    const tickets = event.tickets ?? []

    const capacity = event.capacity ?? tickets.reduce((sum, t) => sum + (t.totalQuantity ?? 0), 0)
    const sold = event.ticketsSold ?? tickets.reduce((sum, t) => sum + (t.quantitySold ?? 0), 0)
    const revenue = event.revenue ?? tickets.reduce((sum, t) => sum + Number(t.price ?? 0) * (t.quantitySold ?? 0), 0)

    return { capacity, sold, revenue, pctSold: capacity > 0 ? Math.round((sold / capacity) * 100) : 0 }
  }

  const overview = useMemo(() => {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const withTotals = (events ?? []).map((event) => {
      const opensAt = event.ticketSalesStartDate ? new Date(event.ticketSalesStartDate) : null
      const closesAt = event.ticketSalesEndDate ? new Date(event.ticketSalesEndDate) : null
      const now = Date.now()

      const daysUntil = (date) => (date ? Math.ceil((date.getTime() - startOfToday.getTime()) / DAY_MS) : null)

      let saleStatus = 'always'

      if (opensAt && now < opensAt.getTime()) saleStatus = 'scheduled'
      else if (closesAt && now > closesAt.getTime()) saleStatus = 'closed'
      else if (opensAt || closesAt) saleStatus = 'open'

      return {
        ...event,
        totals: ticketTotals(event),
        daysAway: Math.round((new Date(event.date).getTime() - startOfToday.getTime()) / DAY_MS),
        sale: {
          status: saleStatus,
          opensAt,
          closesAt,
          daysUntilOpen: daysUntil(opensAt),
          daysUntilClose: daysUntil(closesAt)
        }
      }
    })

    const upcoming = withTotals.filter((e) => e.daysAway >= 0).sort((a, b) => a.daysAway - b.daysAway)

    const nextEvent = upcoming[0] ?? null

    const topEvent = [...withTotals].sort((a, b) => b.totals.revenue - a.totals.revenue)[0] ?? null

    const alerts = []

    for (const event of upcoming) {
      if (event.totals.capacity > 0 && event.totals.pctSold >= 90) {
        alerts.push({
          id: `${event.id}-sellout`,
          tone: 'amber',
          title: event.title,
          detail: `${event.totals.capacity - event.totals.sold} tickets left, ${event.totals.pctSold}% sold`
        })
      }

      if (event.daysAway <= 14 && event.totals.capacity > 0 && event.totals.pctSold < 40) {
        alerts.push({
          id: `${event.id}-slow`,
          tone: 'violet',
          title: event.title,
          detail: `${event.daysAway} days out, only ${event.totals.pctSold}% sold`
        })
      }

      if (event.totals.capacity === 0) {
        alerts.push({
          id: `${event.id}-notickets`,
          tone: 'neutral',
          title: event.title,
          detail: 'no ticket types configured'
        })
      }
    }

    return { nextEvent, topEvent, alerts: alerts.slice(0, 5), upcomingCount: upcoming.length }
  }, [events])

  const eventRevenue = (event) => event.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0)

  const charts = useMemo(() => {
    const byEvent = (events ?? [])
      .map((e) => ({
        id: e.id,
        title: e.title,
        revenue: eventRevenue(e),
        sold: e.tickets.reduce((sum, t) => sum + (t.quantitySold ?? 0), 0),
        orders: e.orders.length
      }))
      .filter((e) => e.revenue > 0 || e.sold > 0)
      .sort((a, b) => b.revenue - a.revenue)

    const ticketMap = new Map()

    for (const event of events ?? []) {
      for (const ticket of event.tickets) {
        const row = ticketMap.get(ticket.name) ?? { name: ticket.name, sold: 0, revenue: 0 }
        row.sold += ticket.quantitySold ?? 0
        row.revenue += (ticket.quantitySold ?? 0) * Number(ticket.price)
        ticketMap.set(ticket.name, row)
      }
    }

    const byTicketType = [...ticketMap.values()].filter((t) => t.sold > 0).sort((a, b) => b.sold - a.sold)

    return {
      byEvent,
      byTicketType,
      maxRevenue: Math.max(...byEvent.map((e) => e.revenue), 1),
      totalSold: byTicketType.reduce((sum, t) => sum + t.sold, 0)
    }
  }, [events])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader
        title="Events Overview"
        meta={`${formatCurrency(stats.totalRevenue)} across ${stats.totalEvents} events`}
        actions={<ExportEventsButton />}
      />
      <div className="p-6 space-y-6">
        {/* At a glance */}
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Next event */}
          <motion.div
            className="xl:col-span-2 dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg border p-5"
            variants={itemVariants}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <p className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold pt-1">
                Next Event
              </p>
              {overview.nextEvent && (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <SaleWindowBadge sale={overview.nextEvent.sale} compact />
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${colorMap.amber}`}>
                    {overview.nextEvent.daysAway === 0
                      ? 'Today'
                      : `${overview.nextEvent.daysAway} day${overview.nextEvent.daysAway === 1 ? '' : 's'} away`}
                  </span>
                </div>
              )}
            </div>

            {!overview.nextEvent ? (
              <p className="text-sm dark:text-neutral-500 text-neutral-500 py-8 text-center">
                No upcoming events scheduled.
              </p>
            ) : (
              <>
                <p className="text-xl font-black dark:text-white text-neutral-900">{overview.nextEvent.title}</p>
                <p className="text-sm dark:text-neutral-500 text-neutral-600 mt-1">
                  {new Date(overview.nextEvent.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'America/New_York'
                  })}
                  {overview.nextEvent.location ? ` · ${overview.nextEvent.location}` : ''}
                </p>

                <div className="mt-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold">
                      Capacity
                    </p>
                    <p className="text-sm dark:text-neutral-400 text-neutral-700 font-medium">
                      {overview.nextEvent.totals.sold.toLocaleString()} /{' '}
                      {overview.nextEvent.totals.capacity.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-2 rounded-full dark:bg-neutral-800 bg-neutral-200 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        overview.nextEvent.totals.pctSold >= 90
                          ? 'bg-amber-500'
                          : overview.nextEvent.totals.pctSold >= 50
                            ? 'bg-emerald-500'
                            : 'bg-sky-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(overview.nextEvent.totals.pctSold, 100)}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t dark:border-neutral-800 border-neutral-200">
                  {[
                    { label: 'Revenue', value: formatCurrency(overview.nextEvent.totals.revenue) },
                    { label: 'Sold', value: overview.nextEvent.totals.sold.toLocaleString() },
                    { label: 'Orders', value: (overview.nextEvent.orders?.length ?? 0).toLocaleString() },
                    { label: 'Attendees', value: (overview.nextEvent.guestCount ?? 0).toLocaleString() }
                  ].map((cell) => (
                    <div key={cell.label}>
                      <p className="text-xs dark:text-neutral-600 text-neutral-500 uppercase tracking-wider font-semibold mb-1">
                        {cell.label}
                      </p>
                      <p className="text-lg font-black dark:text-white text-neutral-900 tabular-nums">{cell.value}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Needs attention */}
          <motion.div
            className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg border p-5"
            variants={itemVariants}
          >
            <p className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold mb-4">
              Needs Attention
            </p>

            {overview.alerts.length === 0 ? (
              <div className="flex items-center gap-2 py-8 justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <p className="text-sm dark:text-neutral-500 text-neutral-500">Nothing to flag.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {overview.alerts.map((alert) => (
                  <li key={alert.id} className="flex gap-3">
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${colorMap[alert.tone].split(' ').find((c) => c.startsWith('bg-'))}`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium dark:text-white text-neutral-900 truncate">{alert.title}</p>
                      <p className="text-xs dark:text-neutral-500 text-neutral-600">{alert.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {overview.topEvent && (
              <div className="mt-5 pt-5 border-t dark:border-neutral-800 border-neutral-200">
                <p className="text-xs dark:text-neutral-600 text-neutral-500 uppercase tracking-wider font-semibold mb-1">
                  Top Grossing
                </p>
                <p className="text-sm font-medium dark:text-white text-neutral-900 truncate">
                  {overview.topEvent.title}
                </p>
                <p className="text-xs dark:text-neutral-500 text-neutral-600">
                  {formatCurrency(overview.topEvent.totals.revenue)} · {overview.topEvent.totals.sold.toLocaleString()}{' '}
                  tickets
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Top Stats */}
        <motion.div
          className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg border divide-y sm:divide-y-0 sm:divide-x dark:divide-neutral-800 divide-neutral-200 grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {topStats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.id} className="px-4 py-3.5" variants={itemVariants}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${colorMap[stat.color]
                      .split(' ')
                      .filter((c) => c.startsWith('text-') || c.startsWith('dark:text-'))
                      .join(' ')}`}
                  />
                  <p className="text-[11px] dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold truncate">
                    {stat.label}
                  </p>
                </div>
                <p className="text-lg font-bold dark:text-white text-neutral-900 tabular-nums leading-none">
                  {stat.value}
                </p>
                <p className="text-[11px] dark:text-neutral-600 text-neutral-500 mt-1.5 truncate">{stat.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Revenue by event */}
          <motion.div
            variants={itemVariants}
            className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg border p-5"
          >
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold">
                Revenue by Event
              </h3>
              <span className="text-[11px] dark:text-neutral-600 text-neutral-500">
                {charts.byEvent.length} with sales
              </span>
            </div>

            {charts.byEvent.length === 0 ? (
              <p className="text-sm dark:text-neutral-500 text-neutral-500 py-6 text-center">No sales yet.</p>
            ) : (
              <div className="space-y-2.5">
                {charts.byEvent.slice(0, 8).map((event) => (
                  <div key={event.id}>
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                      <span className="text-xs dark:text-neutral-300 text-neutral-700 truncate">{event.title}</span>
                      <span className="text-xs font-semibold dark:text-white text-neutral-900 tabular-nums shrink-0">
                        {formatCurrency(event.revenue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full dark:bg-neutral-800 bg-neutral-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-sky-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.revenue / charts.maxRevenue) * 100}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-[11px] dark:text-neutral-600 text-neutral-500 tabular-nums w-16 text-right shrink-0">
                        {event.sold.toLocaleString()} sold
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Ticket type breakdown */}
          <motion.div
            variants={itemVariants}
            className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg border p-5"
          >
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold">
                Ticket Type Breakdown
              </h3>
              <span className="text-[11px] dark:text-neutral-600 text-neutral-500 tabular-nums">
                {charts.totalSold.toLocaleString()} total
              </span>
            </div>

            {charts.byTicketType.length === 0 ? (
              <p className="text-sm dark:text-neutral-500 text-neutral-500 py-6 text-center">No tickets sold yet.</p>
            ) : (
              <>
                <div className="flex h-2 rounded-full overflow-hidden mb-4 gap-px">
                  {charts.byTicketType.map((type, i) => (
                    <motion.div
                      key={type.name}
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      initial={{ flexGrow: 0 }}
                      animate={{ flexGrow: type.sold }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  {charts.byTicketType.map((type, i) => (
                    <div key={type.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-xs dark:text-neutral-400 text-neutral-600 truncate">{type.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 tabular-nums">
                        <span className="text-xs font-semibold dark:text-white text-neutral-900">
                          {type.sold.toLocaleString()}
                        </span>
                        <span className="text-xs dark:text-neutral-500 text-neutral-500 w-20 text-right">
                          {formatCurrency(type.revenue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
