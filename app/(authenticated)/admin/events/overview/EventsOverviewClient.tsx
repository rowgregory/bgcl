'use client'

import { containerVariants, itemVariants } from '@/lib/constants/motion'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Ticket, Users, Megaphone } from 'lucide-react'
import { CheckCircle } from 'lucide-react'
import { SaleWindowBadge } from './_components/SalesWindowBadge'
import { colorMap, COLORS } from './_events-overview.constants'
import { AdminPageHeader } from '../../_components/AdminPageHeader'
import { ExportEventsButton } from '../_components/ExportEventsButton'

const iconClasses = (color) =>
  colorMap[color]
    .split(' ')
    .filter((c) => c.startsWith('text-') || c.startsWith('dark:text-'))
    .join(' ')

const barColor = (pctSold) => {
  if (pctSold >= 90) return 'bg-amber-500'
  if (pctSold >= 50) return 'bg-emerald-500'
  return 'bg-sky-500'
}

export function EventsOverviewClient({ data }) {
  const { stats, nextEvent, topEvent, alerts, byEvent, byItem, totalItemsSold } = data

  const topStats = [
    {
      id: 'revenue',
      label: 'Ticket Revenue',
      value: formatCurrency(stats.ticketRevenue),
      description: `${formatCurrency(stats.grossCharged)} charged`,
      icon: DollarSign,
      color: 'emerald'
    },
    {
      id: 'tickets',
      label: 'Tickets Sold',
      value: stats.totalTicketsSold.toLocaleString(),
      description: 'Excludes ads and sponsorships',
      icon: Ticket,
      color: 'sky'
    },
    {
      id: 'ads',
      label: 'Ads Sold',
      value: stats.totalNonTicketItems.toLocaleString(),
      description: 'Program ads, no seats',
      icon: Megaphone,
      color: 'neutral'
    },
    {
      id: 'seats',
      label: 'Seats Sold',
      value: stats.totalSeatsSold.toLocaleString(),
      description: 'Places to set',
      icon: Users,
      color: 'indigo'
    },
    {
      id: 'fees',
      label: 'Fees Covered',
      value: formatCurrency(stats.totalFeesCovered),
      description: 'Paid by buyers on top',
      icon: DollarSign,
      color: 'violet'
    },
    {
      id: 'events',
      label: 'Total Events',
      value: stats.totalEvents.toLocaleString(),
      description: `${stats.pastCount} past, ${stats.upcomingCount} upcoming`,
      icon: Calendar,
      color: 'amber'
    }
  ]

  const maxRevenue = Math.max(...byEvent.map((event) => event.totals.revenue), 1)

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader
        title="Events Overview"
        meta={`${formatCurrency(stats.ticketRevenue)} across ${stats.totalEvents} events`}
        actions={<ExportEventsButton />}
      />

      <div className="p-6 space-y-6">
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
              {nextEvent && (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <SaleWindowBadge sale={nextEvent.sale} compact />
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${colorMap.amber}`}>
                    {nextEvent.daysAway === 0 ? 'Today' : `${nextEvent.daysAway} day${nextEvent.daysAway === 1 ? '' : 's'} away`}
                  </span>
                </div>
              )}
            </div>

            {!nextEvent ? (
              <p className="text-sm dark:text-neutral-500 text-neutral-500 py-8 text-center">No upcoming events scheduled.</p>
            ) : (
              <>
                <p className="text-xl font-black dark:text-white text-neutral-900">{nextEvent.title}</p>
                <p className="text-sm dark:text-neutral-500 text-neutral-600 mt-1">
                  {new Date(nextEvent.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'America/New_York'
                  })}
                  {nextEvent.location ? ` · ${nextEvent.location}` : ''}
                </p>

                <div className="mt-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold">Seats</p>
                    <p className="text-sm dark:text-neutral-400 text-neutral-700 font-medium tabular-nums">
                      {nextEvent.totals.seats.toLocaleString()} / {nextEvent.totals.capacity.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-2 rounded-full dark:bg-neutral-800 bg-neutral-200 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${barColor(nextEvent.totals.pctSold)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(nextEvent.totals.pctSold, 100)}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t dark:border-neutral-800 border-neutral-200">
                  {[
                    { label: 'Revenue', value: formatCurrency(nextEvent.totals.revenue) },
                    { label: 'Tickets', value: nextEvent.totals.sold.toLocaleString() },
                    { label: 'Seats', value: nextEvent.totals.seats.toLocaleString() },
                    { label: 'Orders', value: nextEvent.totals.orders.toLocaleString() }
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

            {alerts.length === 0 ? (
              <div className="flex items-center gap-2 py-8 justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <p className="text-sm dark:text-neutral-500 text-neutral-500">Nothing to flag.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {alerts.map((alert) => (
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

            {topEvent && (
              <div className="mt-5 pt-5 border-t dark:border-neutral-800 border-neutral-200">
                <p className="text-xs dark:text-neutral-600 text-neutral-500 uppercase tracking-wider font-semibold mb-1">
                  Top Grossing
                </p>
                <p className="text-sm font-medium dark:text-white text-neutral-900 truncate">{topEvent.title}</p>
                <p className="text-xs dark:text-neutral-500 text-neutral-600">
                  {formatCurrency(topEvent.totals.revenue)} · {topEvent.totals.seats.toLocaleString()} seats
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Top stats */}
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
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${iconClasses(stat.color)}`} />
                  <p className="text-[11px] dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold truncate">
                    {stat.label}
                  </p>
                </div>
                <p className="text-lg font-bold dark:text-white text-neutral-900 tabular-nums leading-none">{stat.value}</p>
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
              <span className="text-[11px] dark:text-neutral-600 text-neutral-500">{byEvent.length} with sales</span>
            </div>

            {byEvent.length === 0 ? (
              <p className="text-sm dark:text-neutral-500 text-neutral-500 py-6 text-center">No sales yet.</p>
            ) : (
              <div className="space-y-2.5">
                {byEvent.map((event) => (
                  <div key={event.id}>
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                      <span className="text-xs dark:text-neutral-300 text-neutral-700 truncate">{event.title}</span>
                      <span className="text-xs font-semibold dark:text-white text-neutral-900 tabular-nums shrink-0">
                        {formatCurrency(event.totals.revenue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full dark:bg-neutral-800 bg-neutral-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-sky-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.totals.revenue / maxRevenue) * 100}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-[11px] dark:text-neutral-600 text-neutral-500 tabular-nums w-16 text-right shrink-0">
                        {event.totals.seats.toLocaleString()} seats
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sales by item */}
          <motion.div
            variants={itemVariants}
            className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg border p-5"
          >
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold">
                Sales by Item
              </h3>
              <span className="text-[11px] dark:text-neutral-600 text-neutral-500 tabular-nums">
                {totalItemsSold.toLocaleString()} sold
              </span>
            </div>

            {byItem.length === 0 ? (
              <p className="text-sm dark:text-neutral-500 text-neutral-500 py-6 text-center">Nothing sold yet.</p>
            ) : (
              <>
                <div className="flex h-2 rounded-full overflow-hidden mb-4 gap-px">
                  {byItem.map((item, i) => (
                    <motion.div
                      key={item.name}
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      initial={{ flexGrow: 0 }}
                      animate={{ flexGrow: item.sold }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  {byItem.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs dark:text-neutral-400 text-neutral-600 truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 tabular-nums">
                        <span className="text-xs font-semibold dark:text-white text-neutral-900">
                          {item.sold.toLocaleString()}
                        </span>
                        <span className="text-xs dark:text-neutral-500 text-neutral-500 w-20 text-right">
                          {formatCurrency(item.revenue)}
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
