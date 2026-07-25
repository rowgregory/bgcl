'use client'

import { getEventsOverview } from '@/app/lib/actions/_dashboard/getEventsOverview'
import { formatCurrency } from '@/app/lib/utils/currency.utils'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Ticket, Users, Clock, CheckCircle } from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Cell,
  PieChart,
  Pie
} from 'recharts'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

const COLORS = ['#0EA5E9', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1']

const colorMap: Record<string, string> = {
  emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20',
  sky: 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/20',
  indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20',
  violet: 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/20',
  amber: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20',
  neutral: 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
}

export function EventsOverviewClient({ data }: { data: Awaited<ReturnType<typeof getEventsOverview>> }) {
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

  return (
    <div className="p-6 space-y-8">
      {/* Top Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {topStats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.id}
              className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg p-5 dark:hover:border-neutral-700 hover:border-neutral-300 transition-all border"
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colorMap[stat.color]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold mb-2">
                {stat.label}
              </p>
              <p className="text-2xl font-black dark:text-white text-neutral-900 mb-1">{stat.value}</p>
              <p className="text-xs dark:text-neutral-600 text-neutral-500">{stat.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Scatter Chart - Ticket Sales by Event */}
        <motion.div
          variants={itemVariants}
          className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-2xl border p-6"
        >
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Ticket Sales by Event</h3>
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 h-125"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-neutral-700" />
                <XAxis
                  dataKey="ticketsSold"
                  name="Tickets Sold"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  label={{
                    value: 'Tickets Sold',
                    position: 'insideBottom',
                    offset: -20,
                    fill: '#9ca3af',
                    fontSize: 12
                  }}
                  type="number"
                />
                <YAxis
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#9ca3af"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(v) => `$${v}`}
                  label={{
                    value: 'Revenue',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 10,
                    fill: '#9ca3af',
                    fontSize: 12
                  }}
                  type="number"
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null
                    const data = payload[0].payload
                    return (
                      <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-700 shadow-xl">
                        <p className="font-bold text-white text-sm mb-2">{data.title}</p>
                        <div className="space-y-1">
                          <p className="text-xs text-sky-400">
                            Tickets Sold: <span className="text-white font-semibold">{data.ticketsSold}</span>
                          </p>
                          <p className="text-xs text-sky-400">
                            Attendees: <span className="text-white font-semibold">{data.attendees}</span>
                          </p>
                          <p className="text-xs text-sky-400">
                            Revenue: <span className="text-white font-semibold">{formatCurrency(data.revenue)}</span>
                          </p>
                        </div>
                      </div>
                    )
                  }}
                />
                <Scatter
                  name="Events"
                  data={events.map((e) => ({
                    title: e.title,
                    ticketsSold: e.tickets.reduce((sum, t) => sum + (t.quantitySold ?? 0), 0),
                    revenue: e.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
                    attendees: e.guestCount ?? 0
                  }))}
                >
                  {events.map((e, i) => {
                    const revenue = e.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0)
                    const maxRevenue = Math.max(
                      ...events.map((x) => x.orders.reduce((s, o) => s + Number(o.totalAmount), 0)),
                      1
                    )
                    const size = (revenue / maxRevenue) * 800 + 100
                    return (
                      <Cell
                        key={i}
                        fill="#0EA5E9"
                        fillOpacity={0.8}
                        stroke="#0284c7"
                        strokeWidth={1}
                        r={Math.sqrt(size / Math.PI)}
                      />
                    )
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-2xl border p-6"
        >
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Ticket Type Breakdown</h3>
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 h-125"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={(() => {
                    const ticketMap: Record<string, { name: string; sold: number; revenue: number }> = {}
                    events.forEach((e) => {
                      e.tickets.forEach((t) => {
                        const key = t.name
                        if (!ticketMap[key]) {
                          ticketMap[key] = { name: t.name, sold: 0, revenue: 0 }
                        }
                        ticketMap[key].sold += t.quantitySold ?? 0
                        ticketMap[key].revenue += (t.quantitySold ?? 0) * Number(t.price)
                      })
                    })
                    return Object.values(ticketMap)
                  })()}
                  dataKey="sold"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  innerRadius="40%"
                  paddingAngle={3}
                  label={false}
                  labelLine={false}
                >
                  {events
                    .flatMap((e) => e.tickets)
                    .map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null
                    const data = payload[0].payload
                    return (
                      <div className="p-3 bg-white border-neutral-200 dark:bg-neutral-900 rounded-lg border dark:border-neutral-700 shadow-xl">
                        <p className="font-bold text-neutral-900 dark:text-white text-sm mb-2">{data.name}</p>
                        <div className="space-y-1">
                          <p className="text-xs text-sky-400">
                            Tickets Sold:{' '}
                            <span className="text-neutral-900 dark:text-white font-semibold">{data.sold}</span>
                          </p>
                          <p className="text-xs text-sky-400">
                            Revenue:{' '}
                            <span className="text-neutral-900 dark:text-white font-semibold">
                              {formatCurrency(data.revenue)}
                            </span>
                          </p>
                        </div>
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
          {/* Breakdown list */}
          <div className="mt-4 space-y-2">
            {(() => {
              const ticketMap: Record<string, { name: string; sold: number; revenue: number }> = {}
              events.forEach((e) => {
                e.tickets.forEach((t) => {
                  const key = t.name
                  if (!ticketMap[key]) ticketMap[key] = { name: t.name, sold: 0, revenue: 0 }
                  ticketMap[key].sold += t.quantitySold ?? 0
                  ticketMap[key].revenue += (t.quantitySold ?? 0) * Number(t.price)
                })
              })
              console.log('ticketMap: ', ticketMap)

              const rows = Object.values(ticketMap).filter((t) => t.sold > 0)
              return rows.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">{item.sold} sold</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                </div>
              ))
            })()}
          </div>
        </motion.div>
      </div>
      <motion.div
        variants={itemVariants}
        className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white rounded-2xl border border-neutral-200 p-6"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Event Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((event, idx) => {
              const ticketsSold = event.tickets.reduce((sum, t) => sum + (t.quantitySold ?? 0), 0)
              const totalTickets = event.tickets.reduce((sum, t) => sum + (t.totalQuantity ?? 0), 0)
              const revenue = event.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0)
              const totalRevenue = events.reduce(
                (sum, e) => sum + e.orders.reduce((s, o) => s + Number(o.totalAmount), 0),
                0
              )
              const soldOutPercentage = totalTickets > 0 ? (ticketsSold / totalTickets) * 100 : 0
              const isPast = new Date(event.date) < new Date()

              return (
                <motion.div
                  key={event.id}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-base font-bold text-neutral-900 dark:text-white leading-snug truncate">
                        {event.title}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isPast
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                            : 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400'
                        }`}
                      >
                        {isPast ? 'Past' : 'Upcoming'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Revenue */}
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Revenue</p>
                      <p className="text-2xl font-black text-sky-600 dark:text-sky-400">{formatCurrency(revenue)}</p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Tickets Sold</p>
                        <p className="text-lg font-bold text-neutral-900 dark:text-white">
                          {ticketsSold}
                          {totalTickets > 0 && (
                            <span className="text-xs font-normal text-neutral-400 dark:text-neutral-500 ml-0.5">
                              /{totalTickets}
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Attendees</p>
                        <p className="text-lg font-bold text-neutral-900 dark:text-white">{event.guestCount ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Orders</p>
                        <p className="text-lg font-bold text-neutral-900 dark:text-white">{event.orders.length}</p>
                      </div>
                    </div>

                    {/* Capacity bar */}
                    {totalTickets > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">Capacity</p>
                          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                            {soldOutPercentage.toFixed(0)}%
                          </p>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${soldOutPercentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                            className="h-full rounded-full bg-sky-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* % of total revenue */}
                    {totalRevenue > 0 && (
                      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                          {((revenue / totalRevenue) * 100).toFixed(1)}% of total revenue
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
