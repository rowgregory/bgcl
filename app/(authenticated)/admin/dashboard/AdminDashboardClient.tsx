import { ShoppingCart, DollarSign, Heart, Ticket, TrendingDown, TrendingUp, Users } from 'lucide-react'

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const ORDER_TYPE_LABEL: Record<string, string> = {
  TICKET_PURCHASE: 'Ticket Purchase',
  ONE_TIME_DONATION: 'One-Time Donation',
  RECURRING_DONATION: 'Recurring Donation'
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  REFUNDED: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
}

export default function AdminDashboardClient({ stats }) {
  const monthDelta = stats.revenueThisMonth - stats.revenueLastMonth
  const monthDeltaPct = stats.revenueLastMonth > 0 ? ((monthDelta / stats.revenueLastMonth) * 100).toFixed(1) : null
  const monthUp = monthDelta >= 0
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' })

  const statCards = [
    {
      label: 'Total Revenue',
      value: usd(stats.totalRevenue),
      sub: `${usd(stats.revenueThisMonth)} this month`,
      icon: DollarSign,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-500/10'
    },
    {
      label: 'Total Supporters',
      value: stats.totalSupporters.toLocaleString(),
      sub: stats.newSupportersThisMonth > 0 ? `+${stats.newSupportersThisMonth} this month` : 'No new this month',
      subGreen: stats.newSupportersThisMonth > 0,
      icon: Users,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-500/10'
    },
    {
      label: 'Tickets Sold',
      value: stats.ticketsSold.toLocaleString(),
      sub: 'confirmed ticket orders',
      icon: Ticket,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-500/10'
    },
    {
      label: `Revenue — ${monthName}`,
      value: usd(stats.revenueThisMonth),
      sub: monthDeltaPct ? `${monthUp ? '+' : ''}${monthDeltaPct}% vs last month` : 'No data for last month',
      subGreen: monthUp && monthDeltaPct !== null,
      subRed: !monthUp && monthDeltaPct !== null,
      icon: monthUp ? TrendingUp : TrendingDown,
      color: monthUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bg: monthUp ? 'bg-green-50 dark:bg-green-500/10' : 'bg-red-50 dark:bg-red-500/10'
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      sub: 'confirmed orders',
      icon: ShoppingCart,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-500/10'
    },
    {
      label: 'Fees Covered',
      value: usd(stats.totalFeesCovered),
      sub: 'covered by supporters',
      icon: Heart,
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-50 dark:bg-pink-500/10'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-6 py-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, sub, subGreen, subRed, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
              <div className={`p-1.5 rounded-lg ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">{value}</p>
            <p
              className={`text-xs ${
                subGreen
                  ? 'text-green-600 dark:text-green-400'
                  : subRed
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-neutral-400 dark:text-neutral-500'
              }`}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Orders</h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">10 most recent across all types</p>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-neutral-800">
              <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Supporter
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider hidden md:table-cell">
                Event
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider hidden lg:table-cell">
                Type
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {stats?.recentOrders.map((order) => {
              const name = order.user
                ? `${order.user.firstName ?? ''} ${order.user.lastName ?? ''}`.trim() || order.user.email
                : order.customerName || 'Anonymous'

              return (
                <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-3.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-3.5 font-medium text-neutral-900 dark:text-white max-w-40 truncate">{name}</td>
                  <td className="px-6 py-3.5 text-neutral-500 dark:text-neutral-400 hidden md:table-cell max-w-45 truncate">
                    {order.event?.title ?? '—'}
                  </td>
                  <td className="px-6 py-3.5 text-neutral-500 dark:text-neutral-400 hidden lg:table-cell whitespace-nowrap">
                    {ORDER_TYPE_LABEL[order.type] ?? order.type}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[order.status] ?? ''}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                    {usd(Number(order.totalAmount))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
