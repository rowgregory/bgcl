'use client'

import { useDarkMode } from '@/app/lib/hooks/useDarkMode'
import { motion } from 'framer-motion'
import { Heart, TrendingUp, Users, Calendar, ArrowUpRight, Download, Zap } from 'lucide-react'
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
  Legend
} from 'recharts'

interface Donation {
  id: string
  customerName: string
  customerEmail: string
  amount: number
  status: 'active' | 'past_due' | 'failed'
  type: 'one_time' | 'recurring'
  frequency?: 'monthly' | 'yearly'
  createdAt: Date
}

interface FuelTankOverviewProps {
  orders: Donation[]
}

// Mock data for multiple charts
const trendData = [
  { name: 'Jan', donations: 2400, donors: 24 },
  { name: 'Feb', donations: 1398, donors: 22 },
  { name: 'Mar', donations: 9800, donors: 29 },
  { name: 'Apr', donations: 3908, donors: 20 },
  { name: 'May', donations: 4800, donors: 25 },
  { name: 'Jun', donations: 3800, donors: 23 }
]

const retentionData = [
  { month: 'Jan', retention: 85 },
  { month: 'Feb', retention: 88 },
  { month: 'Mar', retention: 92 },
  { month: 'Apr', retention: 89 },
  { month: 'May', retention: 94 },
  { month: 'Jun', retention: 96 }
]

export default function FuelTankOverview({ orders }: FuelTankOverviewProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  // Calculate stats
  const stats = {
    total: orders?.length ?? 0,
    oneTime: orders?.filter((o) => o.type === 'one_time').length ?? 0,
    monthly: orders?.filter((o) => o.type === 'recurring' && o.frequency === 'monthly').length ?? 0,
    yearly: orders?.filter((o) => o.type === 'recurring' && o.frequency === 'yearly').length ?? 0,
    totalRaised: orders?.reduce((sum, o) => sum + o.amount, 0) ?? 0,
    monthlyRecurring:
      orders
        ?.filter((o) => o.type === 'recurring' && o.frequency === 'monthly')
        .reduce((sum, o) => sum + o.amount, 0) ?? 0,
    yearlyRecurring:
      orders?.filter((o) => o.type === 'recurring' && o.frequency === 'yearly').reduce((sum, o) => sum + o.amount, 0) ??
      0,
    activeCount: orders?.filter((o) => o.status === 'active').length ?? 0,
    churnRate:
      orders?.length > 0 ? Math.round((orders?.filter((o) => o.status === 'failed').length / orders?.length) * 100) : 0
  }

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

  const topStats = [
    {
      id: 'total-raised',
      label: 'Total Raised',
      value: `$${(stats.totalRaised / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      description: '+12% vs last period',
      hoverColor: 'sky',
      icon: TrendingUp
    },
    {
      id: 'total-donors',
      label: 'Total Donors',
      value: stats.total,
      description: `${stats.activeCount} active`,
      hoverColor: 'blue',
      icon: Users
    },
    {
      id: 'avg-donation',
      label: 'Avg Donation',
      value: `$${stats.total > 0 ? (stats.totalRaised / stats.total / 100).toFixed(0) : 0}`,
      description: 'per donor',
      hoverColor: 'amber',
      icon: Heart
    },
    {
      id: 'monthly-mrr',
      label: 'Monthly MRR',
      value: `$${(stats.monthlyRecurring / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo`,
      description: `${stats.monthly} subscriptions`,
      hoverColor: 'green',
      icon: Zap
    },
    {
      id: 'annual-arr',
      label: 'Annual ARR',
      value: `$${((stats.monthlyRecurring * 12 + stats.yearlyRecurring) / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      description: `${stats.monthly + stats.yearly} recurring`,
      hoverColor: 'purple',
      icon: Calendar
    },
    {
      id: 'retention',
      label: 'Retention',
      value: '96%',
      description: 'month-over-month',
      hoverColor: 'cyan',
      icon: TrendingUp
    }
  ]

  const isDark = useDarkMode()

  return (
    <div className="p-6 space-y-8">
      {/* Top Stats - 6 Columns */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {topStats.map((stat, index) => (
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
              <LineChart data={trendData}>
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
                  formatter={(value) => `$${value}`}
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
              <BarChart data={trendData}>
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
                  formatter={(value) => `$${value}`}
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
            <LineChart data={retentionData}>
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
                  ${(stats.monthlyRecurring / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
                </span>
              </div>
              <div className={`h-2 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden`}>
                <motion.div
                  className="h-full bg-linear-to-r from-sky-500 to-sky-600"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats.monthly > 0 ? (stats.monthlyRecurring / (stats.monthlyRecurring + stats.yearlyRecurring)) * 100 : 0}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex gap-4 text-xs dark:text-neutral-500 text-neutral-600">
                <span>{stats.monthly} active</span>
                <span>
                  Avg: ${stats.monthly > 0 ? (stats.monthlyRecurring / stats.monthly / 100).toFixed(0) : 0}/mo
                </span>
              </div>
            </div>

            {/* Yearly */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-neutral-300 text-neutral-700">Yearly Recurring</span>
                <span className="text-lg font-black dark:text-purple-400 text-purple-600">
                  ${(stats.yearlyRecurring / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr
                </span>
              </div>
              <div className={`h-2 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden`}>
                <motion.div
                  className="h-full bg-linear-to-r from-purple-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats.yearly > 0 ? (stats.yearlyRecurring / (stats.monthlyRecurring + stats.yearlyRecurring)) * 100 : 0}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex gap-4 text-xs dark:text-neutral-500 text-neutral-600">
                <span>{stats.yearly} active</span>
                <span>Avg: ${stats.yearly > 0 ? (stats.yearlyRecurring / stats.yearly / 100).toFixed(0) : 0}/yr</span>
              </div>
            </div>

            {/* One-Time */}
            <div className="space-y-2 pt-2 dark:border-neutral-800 border-neutral-200 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm dark:text-neutral-300 text-neutral-700">One-Time</span>
                <span className="text-lg font-black dark:text-amber-400 text-amber-600">{stats.oneTime}</span>
              </div>
              <p className="text-xs dark:text-neutral-500 text-neutral-600">
                Total: $
                {(orders?.filter((o) => o.type === 'one_time').reduce((sum, o) => sum + o.amount, 0) ?? 0) / 100}
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
                {((stats.monthlyRecurring * 12 + stats.yearlyRecurring) / 100).toLocaleString('en-US', {
                  maximumFractionDigits: 0
                })}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 dark:bg-neutral-800/30 bg-neutral-100 rounded-lg">
              <span className="text-sm dark:text-neutral-400 text-neutral-700">Recurring Revenue %</span>
              <span className="text-xl font-black dark:text-sky-400 text-sky-600">
                {stats.total > 0 ? Math.round(((stats.monthly + stats.yearly) / stats.total) * 100) : 0}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 dark:bg-neutral-800/30 bg-neutral-100 rounded-lg">
              <span className="text-sm dark:text-neutral-400 text-neutral-700">Churn Rate</span>
              <span className="text-xl font-black dark:text-red-400 text-red-600">{stats.churnRate}%</span>
            </div>

            <div className="flex items-center justify-between p-3 dark:bg-neutral-800/30 bg-neutral-100 rounded-lg">
              <span className="text-sm dark:text-neutral-400 text-neutral-700">Active Subscriptions</span>
              <span className="text-xl font-black dark:text-cyan-400 text-cyan-600">
                {stats.monthly + stats.yearly}
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
