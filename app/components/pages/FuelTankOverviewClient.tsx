'use client'

import { setOpenFailedPaymentDrawer } from '@/app/lib/store/slices/dashboardSlice'
import { store, useApplicationSelector } from '@/app/lib/store/store'
import { motion } from 'framer-motion'
import { Heart, TrendingUp, Users, Calendar, Download, Zap } from 'lucide-react'
import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Scatter,
  ScatterChart
} from 'recharts'

const COLORS = ['#0EA5E9', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1']

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export default function FuelTankOverviewClient({ orders, stats }: { orders: any; stats: any }) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const { isDark } = useApplicationSelector()

  const topStats = [
    {
      id: 'total-raised',
      label: 'Total Raised',
      value: `$${(stats?.totalRaised).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      description: '+12% vs last period',
      hoverColor: 'sky',
      icon: TrendingUp
    },
    {
      id: 'total-orders',
      label: 'Total Orders',
      value: stats?.total,
      description: (
        <>
          {stats?.activeCount} active •{' '}
          <button
            onClick={(e) => {
              e.stopPropagation()
              store.dispatch(setOpenFailedPaymentDrawer(stats.failedOrders))
            }}
            className="text-red-600 dark:text-red-400 hover:underline font-semibold"
          >
            {stats?.failedCount || 0} failed
          </button>
        </>
      ),
      hoverColor: 'blue',
      icon: Users
    },
    {
      id: 'avg-donation',
      label: 'Avg Donation',
      value: `$${(stats?.avgDonation).toFixed(2)}`,
      description: 'per donor',
      hoverColor: 'amber',
      icon: Heart
    },
    {
      id: 'monthly-mrr',
      label: 'Monthly MRR',
      value: `$${(stats?.monthlyRecurring).toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo`,
      description: `${stats?.monthly} subscriptions`,
      hoverColor: 'green',
      icon: Zap
    },
    {
      id: 'annual-arr',
      label: 'Annual ARR',
      value: `$${(stats?.annualArr).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      description: `${stats?.monthly + stats?.yearly} recurring`,
      hoverColor: 'purple',
      icon: Calendar
    },
    {
      id: 'retention',
      label: 'Retention',
      value: `${100 - (stats?.churnRate ?? 0)}%`,
      description: 'month-over-month',
      hoverColor: 'cyan',
      icon: TrendingUp
    }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Top Stats - 6 Columns */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {topStats?.map((stat, index) => (
          <motion.div
            key={stat.id}
            className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-lg p-5 dark:hover:border-neutral-700 hover:border-neutral-300 transition-all border"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <p className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold mb-3">
              {stat.label}
            </p>
            <p className="text-3xl font-black dark:text-white text-neutral-900 mb-2">{stat.value}</p>
            <p className="text-xs dark:text-neutral-600 text-neutral-500">{stat.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Bar Chart - Donations by Campaign */}
        <motion.div
          variants={itemVariants}
          className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-2xl border p-6"
        >
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Donations by Campaign</h3>
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 h-125"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Donations by Campaign</h3>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="count"
                  name="Donors"
                  stroke="#9ca3af"
                  label={{ value: 'Number of Donors', position: 'insideBottomRight', offset: -10 }}
                />
                <YAxis
                  dataKey="averageDonation"
                  name="Avg Donation"
                  stroke="#9ca3af"
                  label={{ value: 'Average Donation ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null
                    const data = payload[0].payload
                    return (
                      <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-700">
                        <p className="font-bold text-white">{data.campaignName || 'No Campaign'}</p>
                        <p className="text-sm text-neutral-300">Donors: {data.count}</p>
                        <p className="text-sm text-neutral-300">Avg: {formatCurrency(data.averageDonation)}</p>
                        <p className="text-sm text-neutral-300">Total: {formatCurrency(data.totalAmount)}</p>
                      </div>
                    )
                  }}
                />
                <Scatter
                  name="Campaigns"
                  data={stats.campaigns.map((c, i) => ({
                    ...c,
                    size: (c.totalAmount / Math.max(...stats.campaigns.map((x) => x.totalAmount))) * 500 + 50
                  }))}
                  fill="#0EA5E9"
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white rounded-2xl border border-neutral-200 p-6"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Campaign Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.campaigns.map((campaign, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Campaign</p>
                      <p className="text-lg font-bold text-neutral-900 dark:text-white">
                        {campaign.campaignName || 'No Campaign'}
                      </p>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Total Raised</p>
                      <p className="text-2xl font-black text-sky-600 dark:text-sky-400">
                        {formatCurrency(campaign.totalAmount)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Donors</p>
                        <p className="text-lg font-bold text-neutral-900 dark:text-white">{campaign.count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Avg</p>
                        <p className="text-lg font-bold text-neutral-900 dark:text-white">
                          {formatCurrency(campaign.averageDonation)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                        {(
                          (campaign.totalAmount / stats.campaigns.reduce((sum, c) => sum + c.totalAmount, 0)) *
                          100
                        ).toFixed(1)}
                        % of total
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Campaign Details Table */}
      <motion.div
        variants={itemVariants}
        className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-2xl border overflow-hidden"
      >
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Campaign Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Campaign
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Total Raised
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Donors
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                  Average
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.campaigns.map((campaign, idx) => (
                <tr
                  key={idx}
                  className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-neutral-900 dark:text-white font-semibold">
                    {campaign.campaignName || 'No Campaign'}
                  </td>
                  <td className="px-6 py-4 text-neutral-900 dark:text-white font-bold">
                    {formatCurrency(campaign.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{campaign.count}</td>
                  <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                    {formatCurrency(campaign.averageDonation)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Revenue Chart - 2 cols */}
        <motion.div
          className="lg:col-span-2 dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-xl p-6 space-y-4 border"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold dark:text-white text-neutral-900">Revenue Trend</p>
              <p className="text-xs dark:text-neutral-500 text-neutral-600">Last 6 months</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  chartType === 'line'
                    ? 'dark:bg-sky-600 dark:text-white bg-sky-600 text-white'
                    : 'dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  chartType === 'bar'
                    ? 'dark:bg-sky-600 dark:text-white bg-sky-600 text-white'
                    : 'dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                Bar
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            {chartType === 'line' ? (
              <LineChart data={stats?.trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? 'rgb(38, 38, 38)' : 'rgb(229, 231, 235)'}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke={isDark ? 'rgb(115, 115, 115)' : 'rgb(107, 114, 128)'}
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke={isDark ? 'rgb(115, 115, 115)' : 'rgb(107, 114, 128)'} style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? 'rgb(23, 23, 23)' : 'rgb(255, 255, 255)',
                    border: isDark ? '1px solid rgb(38, 38, 38)' : '1px solid rgb(229, 231, 235)',
                    borderRadius: '8px',
                    color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'
                  }}
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  labelStyle={{ color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="donations"
                  stroke="rgb(56, 189, 248)"
                  strokeWidth={2}
                  dot={{ fill: 'rgb(56, 189, 248)', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="donors"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth={2}
                  dot={{ fill: 'rgb(34, 197, 94)', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="New Donors"
                />
              </LineChart>
            ) : (
              <BarChart data={stats?.trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? 'rgb(38, 38, 38)' : 'rgb(229, 231, 235)'}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke={isDark ? 'rgb(115, 115, 115)' : 'rgb(107, 114, 128)'}
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke={isDark ? 'rgb(115, 115, 115)' : 'rgb(107, 114, 128)'} style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? 'rgb(23, 23, 23)' : 'rgb(255, 255, 255)',
                    border: isDark ? '1px solid rgb(38, 38, 38)' : '1px solid rgb(229, 231, 235)',
                    borderRadius: '8px',
                    color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'
                  }}
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  labelStyle={{ color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)' }}
                />
                <Legend />
                <Bar dataKey="donations" fill="rgb(56, 189, 248)" name="Revenue" />
                <Bar dataKey="donors" fill="rgb(34, 197, 94)" name="New Donors" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Retention Chart */}
        <motion.div
          className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-xl p-6 space-y-4 border"
          variants={itemVariants}
        >
          <div>
            <p className="text-sm font-semibold dark:text-white text-neutral-900">Retention Rate</p>
            <p className="text-xs dark:text-neutral-500 text-neutral-600">Last 6 months</p>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats?.retentionData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? 'rgb(38, 38, 38)' : 'rgb(229, 231, 235)'}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke={isDark ? 'rgb(115, 115, 115)' : 'rgb(107, 114, 128)'}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke={isDark ? 'rgb(115, 115, 115)' : 'rgb(107, 114, 128)'}
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? 'rgb(23, 23, 23)' : 'rgb(255, 255, 255)',
                  border: isDark ? '1px solid rgb(38, 38, 38)' : '1px solid rgb(229, 231, 235)',
                  borderRadius: '8px',
                  color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'
                }}
                formatter={(value) => `${value}%`}
                labelStyle={{ color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)' }}
              />
              <Line
                type="monotone"
                dataKey="retention"
                stroke="rgb(99, 102, 241)"
                strokeWidth={3}
                dot={{ fill: 'rgb(99, 102, 241)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Detailed Breakdown - 2 Row Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Recurring Revenue Details */}
        <motion.div
          className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-xl p-6 space-y-6 border"
          variants={itemVariants}
        >
          <div>
            <p className="text-sm font-semibold dark:text-white text-neutral-900 mb-1">Recurring Revenue Breakdown</p>
            <p className="text-xs dark:text-neutral-500 text-neutral-600">Monthly vs Yearly</p>
          </div>

          <div className="space-y-4">
            {/* Monthly */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-neutral-300 text-neutral-700">Monthly Recurring</span>
                <span className="text-lg font-black dark:text-sky-400 text-sky-600">
                  ${(stats?.monthlyRecurring).toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
                </span>
              </div>
              <div className={`h-2 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden`}>
                <motion.div
                  className="h-full bg-linear-to-r from-sky-500 to-sky-600"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats?.monthly > 0 ? (stats?.monthlyRecurring / (stats?.monthlyRecurring + stats?.yearlyRecurring)) * 100 : 0}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex gap-4 text-xs dark:text-neutral-500 text-neutral-600">
                <span>{stats?.monthly} active</span>
                <span>Avg: ${stats?.monthly > 0 ? (stats?.monthlyRecurring / stats?.monthly).toFixed(0) : 0}/mo</span>
              </div>
            </div>

            {/* Yearly */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-neutral-300 text-neutral-700">Yearly Recurring</span>
                <span className="text-lg font-black dark:text-purple-400 text-purple-600">
                  ${(stats?.yearlyRecurring).toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr
                </span>
              </div>
              <div className={`h-2 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden`}>
                <motion.div
                  className="h-full bg-linear-to-r from-purple-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats?.yearly > 0 ? (stats?.yearlyRecurring / (stats?.monthlyRecurring + stats?.yearlyRecurring)) * 100 : 0}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex gap-4 text-xs dark:text-neutral-500 text-neutral-600">
                <span>{stats?.yearly} active</span>
                <span>Avg: ${stats?.yearly > 0 ? (stats?.yearlyRecurring / stats?.yearly).toFixed(0) : 0}/yr</span>
              </div>
            </div>

            {/* One-Time */}
            <div className="space-y-2 pt-2 dark:border-neutral-800 border-neutral-200 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-neutral-300 text-neutral-700">One-Time</span>
                <span className="text-lg font-black dark:text-amber-400 text-amber-600">{stats?.oneTime}</span>
              </div>
              <p className="text-xs dark:text-neutral-500 text-neutral-600">
                Total: $
                {orders
                  ?.filter((o) => o.type === 'one-time')
                  .reduce((sum, o) => sum + o.amount / 100, 0)
                  .toLocaleString('en-US') ?? 0}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="dark:bg-neutral-900/50 dark:border-neutral-800 bg-white border-neutral-200 rounded-xl p-6 space-y-6 border"
          variants={itemVariants}
        >
          <div>
            <p className="text-sm font-semibold dark:text-white text-neutral-900 mb-1">Key Performance Indicators</p>
            <p className="text-xs dark:text-neutral-500 text-neutral-600">Current metrics</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 dark:bg-neutral-800/30 bg-neutral-100 rounded-lg">
              <span className="text-sm dark:text-neutral-400 text-neutral-700">Projected Annual Revenue</span>
              <span className="text-xl font-black dark:text-green-400 text-green-600">
                $
                {(stats?.monthlyRecurring * 12 + stats?.yearlyRecurring).toLocaleString('en-US', {
                  maximumFractionDigits: 0
                })}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 dark:bg-neutral-800/30 bg-neutral-100 rounded-lg">
              <span className="text-sm dark:text-neutral-400 text-neutral-700">Recurring Revenue %</span>
              <span className="text-xl font-black dark:text-sky-400 text-sky-600">
                {stats?.total > 0 ? Math.round(((stats?.monthly + stats?.yearly) / stats?.total) * 100) : 0}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 dark:bg-neutral-800/30 bg-neutral-100 rounded-lg">
              <span className="text-sm dark:text-neutral-400 text-neutral-700">Churn Rate</span>
              <span className="text-xl font-black dark:text-red-400 text-red-600">{stats?.churnRate}%</span>
            </div>

            <div className="flex items-center justify-between p-3 dark:bg-neutral-800/30 bg-neutral-100 rounded-lg">
              <span className="text-sm dark:text-neutral-400 text-neutral-700">Active Subscriptions</span>
              <span className="text-xl font-black dark:text-cyan-400 text-cyan-600">
                {stats?.monthly + stats?.yearly}
              </span>
            </div>
          </div>

          {/* Export Button */}
          <motion.button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Export Report
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
