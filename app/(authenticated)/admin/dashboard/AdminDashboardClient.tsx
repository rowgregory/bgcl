'use client'

import { DashboardStats } from '@/lib/actions/_dashboard/getDashboardStats'
import { motion } from 'framer-motion'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'
import { formatCurrency, formatCurrencyWhole } from '@/lib/utils/currency.utils'

const ORDER_TYPE_LABEL: Record<string, string> = {
  TICKET_PURCHASE: 'Ticket',
  ONE_TIME_DONATION: 'One-time',
  RECURRING_DONATION: 'Recurring'
}

const STATUS_DOT: Record<string, string> = {
  CONFIRMED: 'bg-emerald-500',
  PENDING: 'bg-amber-500',
  FAILED: 'bg-red-500',
  CANCELLED: 'bg-neutral-300 dark:bg-neutral-700',
  REFUNDED: 'bg-neutral-300 dark:bg-neutral-700'
}

export default function AdminDashboardClient({ stats }: { stats: DashboardStats }) {
  const monthDelta = stats.revenueThisMonth - stats.revenueLastMonth
  const monthDeltaPct = stats.revenueLastMonth > 0 ? ((monthDelta / stats.revenueLastMonth) * 100).toFixed(1) : null
  const monthUp = monthDelta >= 0
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', timeZone: 'America/New_York' })

  const metrics = [
    {
      label: 'Supporters',
      value: stats.totalSupporters.toLocaleString(),
      sub: `${stats.newSupportersThisMonth} new this month`
    },
    { label: 'Orders', value: stats.totalOrders.toLocaleString(), sub: 'confirmed and cancelled' },
    { label: 'Tickets sold', value: stats.ticketsSold.toLocaleString(), sub: 'confirmed orders' },
    { label: 'Fees covered', value: formatCurrencyWhole(stats.totalFeesCovered), sub: 'paid by supporters' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader title="Dashboard" meta={`${formatCurrencyWhole(stats.totalRevenue)} raised`} />

      <div className="px-6 py-8 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-12 pb-8 border-b border-neutral-200 dark:border-neutral-800"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600">
              Total revenue
            </p>

            <p className="mt-3 text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {formatCurrencyWhole(stats.totalRevenue)}
            </p>

            <div className="mt-4 flex items-baseline gap-2 text-sm">
              <span className="text-neutral-500 dark:text-neutral-400 tabular-nums">
                {formatCurrency(stats.revenueThisMonth)} in {monthName}
              </span>

              {monthDeltaPct && (
                <span
                  className={`font-medium tabular-nums ${
                    monthUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {monthUp ? '↑' : '↓'} {Math.abs(Number(monthDeltaPct))}%
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-6 lg:border-l lg:border-neutral-200 lg:dark:border-neutral-800 lg:pl-12">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600">
                  {metric.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white tabular-nums">{metric.value}</p>
                <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-600">{metric.sub}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8 pb-8 border-b border-neutral-200 dark:border-neutral-800"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600 mb-4">
            Where it came from
          </p>

          {(() => {
            const total = stats.ticketRevenue + stats.donationRevenue

            const sources = [
              {
                label: 'Events',
                amount: stats.ticketRevenue,
                count: stats.ticketOrders,
                color: 'bg-sky-600',
                share: total > 0 ? (stats.ticketRevenue / total) * 100 : 0
              },
              {
                label: 'Donations',
                amount: stats.donationRevenue,
                count: stats.donationOrders,
                color: 'bg-neutral-400 dark:bg-neutral-600',
                share: total > 0 ? (stats.donationRevenue / total) * 100 : 0
              }
            ]

            if (total === 0) {
              return <p className="text-sm text-neutral-400 dark:text-neutral-600">No revenue recorded yet.</p>
            }

            return (
              <>
                <div className="flex h-2 rounded-full overflow-hidden gap-px mb-5">
                  {sources.map((source) => (
                    <motion.div
                      key={source.label}
                      className={source.color}
                      initial={{ flexGrow: 0 }}
                      animate={{ flexGrow: source.amount }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-8 max-w-md">
                  {sources.map((source) => (
                    <div key={source.label}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${source.color}`} aria-hidden="true" />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600">
                          {source.label}
                        </p>
                      </div>

                      <p className="text-2xl font-semibold text-neutral-900 dark:text-white tabular-nums">
                        {formatCurrencyWhole(source.amount)}
                      </p>

                      <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                        {source.share.toFixed(0)}% · {source.count.toLocaleString()} {source.count === 1 ? 'order' : 'orders'}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8"
        >
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600">
              Recent orders
            </h2>
            <span className="text-xs text-neutral-400 dark:text-neutral-600">Last 10, all types</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left py-2 pr-4 text-[11px] text-neutral-400 dark:text-neutral-600 uppercase tracking-wider font-normal">
                    Date
                  </th>
                  <th className="text-left py-2 pr-4 text-[11px] text-neutral-400 dark:text-neutral-600 uppercase tracking-wider font-normal">
                    Supporter
                  </th>
                  <th className="text-left py-2 pr-4 text-[11px] text-neutral-400 dark:text-neutral-600 uppercase tracking-wider font-normal hidden md:table-cell">
                    Event
                  </th>
                  <th className="text-left py-2 pr-4 text-[11px] text-neutral-400 dark:text-neutral-600 uppercase tracking-wider font-normal hidden lg:table-cell">
                    Type
                  </th>
                  <th className="text-left py-2 pr-4 text-[11px] text-neutral-400 dark:text-neutral-600 uppercase tracking-wider font-normal">
                    Status
                  </th>
                  <th className="text-right py-2 text-[11px] text-neutral-400 dark:text-neutral-600 uppercase tracking-wider font-normal">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-neutral-400 dark:text-neutral-600">
                      Orders will appear here once the first one comes through.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => {
                    const name = order.user
                      ? `${order.user.firstName ?? ''} ${order.user.lastName ?? ''}`.trim() || order.user.email
                      : order.customerName || 'Anonymous'

                    return (
                      <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3 pr-4 text-neutral-400 dark:text-neutral-500 whitespace-nowrap tabular-nums">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            timeZone: 'America/New_York'
                          })}
                        </td>
                        <td className="py-3 pr-4 text-neutral-900 dark:text-white max-w-48 truncate">{name}</td>
                        <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 hidden md:table-cell max-w-56 truncate">
                          {order.event?.title ?? '—'}
                        </td>
                        <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 hidden lg:table-cell whitespace-nowrap">
                          {ORDER_TYPE_LABEL[order.type] ?? order.type}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[order.status] ?? 'bg-neutral-300'}`}
                              aria-hidden="true"
                            />
                            {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right font-medium text-neutral-900 dark:text-white whitespace-nowrap tabular-nums">
                          {formatCurrency(order.totalAmount)}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
