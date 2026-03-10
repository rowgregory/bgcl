'use client'

import { getCapsuleOverview } from '@/app/lib/actions/getCapsuleOverview'
import { formatCurrency } from '@/app/lib/utils/currency.utils'
import { formatDate } from '@/app/lib/utils/date-utils'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Ticket, Users, TrendingUp, Clock, MapPin, CheckCircle } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

const colorMap: Record<string, string> = {
  emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20',
  sky: 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/20',
  indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20',
  violet: 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/20',
  amber: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20',
  neutral: 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
}

export function CapsuleOverviewClient({ data }: { data: Awaited<ReturnType<typeof getCapsuleOverview>> }) {
  const { stats, upcomingEvents, recentOrders } = data

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
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-2xl border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Upcoming Events</h3>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-full">
              {stats.upcomingCount} scheduled
            </span>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-neutral-400 dark:text-neutral-600">
              <Calendar className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event, i) => {
                const ticketsSold = event.tickets.reduce((sum, t) => sum + t.quantitySold, 0)
                const totalTickets = event.tickets.reduce((sum, t) => sum + t.totalQuantity, 0)
                const soldPct = totalTickets > 0 ? (ticketsSold / totalTickets) * 100 : 0
                const revenue = event.orders.reduce((sum, o) => sum + o.totalAmount, 0)

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all"
                  >
                    {/* Date block */}
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black text-sky-700 dark:text-sky-300 leading-none">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{event.title}</p>
                      <div className="flex items-center gap-1 mt-0.5 mb-2">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{event.location}</p>
                      </div>

                      {/* Ticket progress bar */}
                      {totalTickets > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-neutral-500">
                              {ticketsSold}/{totalTickets} tickets
                            </span>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(revenue)}
                            </span>
                          </div>
                          <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-500 rounded-full transition-all"
                              style={{ width: `${Math.min(soldPct, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Ticket Orders */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-2xl border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Recent Purchases</h3>
            <TrendingUp className="w-4 h-4 text-neutral-400" />
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-neutral-400 dark:text-neutral-600">
              <Ticket className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">No purchases yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                        {order?.customerName || 'Guest'}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {order?.orderItems?.[0]?.ticket?.event?.title || '—'} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0 ml-3">
                    {formatCurrency(order?.totalAmount)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
