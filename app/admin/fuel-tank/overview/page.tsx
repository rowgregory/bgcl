'use client'

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

  return (
    <div className="p-6 space-y-8">
      {/* Top Stats - 6 Columns */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Raised */}
        <motion.div
          className="bg-linear-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3 hover:border-sky-500/30 transition-all"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Total Raised</p>
            <div className="w-8 h-8 rounded bg-sky-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            ${(stats.totalRaised / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
          <div className="flex items-center gap-1 text-xs text-green-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12% vs last period</span>
          </div>
        </motion.div>

        {/* Total Donors */}
        <motion.div
          className="bg-linear-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3 hover:border-blue-500/30 transition-all"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Total Donors</p>
            <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">{stats.total}</p>
          <p className="text-xs text-neutral-600">{stats.activeCount} active</p>
        </motion.div>

        {/* Avg Donation */}
        <motion.div
          className="bg-linear-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3 hover:border-amber-500/30 transition-all"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Avg Donation</p>
            <div className="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center">
              <Heart className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            ${stats.total > 0 ? (stats.totalRaised / stats.total / 100).toFixed(0) : 0}
          </p>
          <p className="text-xs text-neutral-600">per donor</p>
        </motion.div>

        {/* Monthly MRR */}
        <motion.div
          className="bg-linear-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3 hover:border-green-500/30 transition-all"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Monthly MRR</p>
            <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            ${(stats.monthlyRecurring / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
          </p>
          <p className="text-xs text-neutral-600">{stats.monthly} subscriptions</p>
        </motion.div>

        {/* Yearly ARR */}
        <motion.div
          className="bg-linear-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3 hover:border-purple-500/30 transition-all"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Annual ARR</p>
            <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            $
            {((stats.monthlyRecurring * 12 + stats.yearlyRecurring) / 100).toLocaleString('en-US', {
              maximumFractionDigits: 0
            })}
          </p>
          <p className="text-xs text-neutral-600">{stats.monthly + stats.yearly} recurring</p>
        </motion.div>

        {/* Retention Rate */}
        <motion.div
          className="bg-linear-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3 hover:border-cyan-500/30 transition-all"
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Retention</p>
            <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">96%</p>
          <p className="text-xs text-neutral-600">month-over-month</p>
        </motion.div>
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
          className="lg:col-span-2 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 space-y-4"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Revenue Trend</p>
              <p className="text-xs text-neutral-500">Last 6 months</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  chartType === 'line'
                    ? 'bg-sky-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  chartType === 'bar' ? 'bg-sky-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                Bar
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            {chartType === 'line' ? (
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(38, 38, 38)" vertical={false} />
                <XAxis dataKey="name" stroke="rgb(115, 115, 115)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgb(115, 115, 115)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(23, 23, 23)',
                    border: '1px solid rgb(38, 38, 38)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `$${value}`}
                  labelStyle={{ color: 'rgb(255, 255, 255)' }}
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(38, 38, 38)" vertical={false} />
                <XAxis dataKey="name" stroke="rgb(115, 115, 115)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgb(115, 115, 115)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(23, 23, 23)',
                    border: '1px solid rgb(38, 38, 38)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `$${value}`}
                  labelStyle={{ color: 'rgb(255, 255, 255)' }}
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
          className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 space-y-4"
          variants={itemVariants}
        >
          <div>
            <p className="text-sm font-semibold text-white">Retention Rate</p>
            <p className="text-xs text-neutral-500">Last 6 months</p>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(38, 38, 38)" vertical={false} />
              <XAxis dataKey="month" stroke="rgb(115, 115, 115)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgb(115, 115, 115)" style={{ fontSize: '12px' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(23, 23, 23)',
                  border: '1px solid rgb(38, 38, 38)',
                  borderRadius: '8px'
                }}
                formatter={(value) => `${value}%`}
                labelStyle={{ color: 'rgb(255, 255, 255)' }}
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
          className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 space-y-6"
          variants={itemVariants}
        >
          <div>
            <p className="text-sm font-semibold text-white mb-1">Recurring Revenue Breakdown</p>
            <p className="text-xs text-neutral-500">Monthly vs Yearly</p>
          </div>

          <div className="space-y-4">
            {/* Monthly */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">Monthly Recurring</span>
                <span className="text-lg font-black text-sky-400">
                  ${(stats.monthlyRecurring / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
                </span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-sky-500 to-sky-600"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats.monthly > 0 ? (stats.monthlyRecurring / (stats.monthlyRecurring + stats.yearlyRecurring)) * 100 : 0}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex gap-4 text-xs text-neutral-500">
                <span>{stats.monthly} active</span>
                <span>
                  Avg: ${stats.monthly > 0 ? (stats.monthlyRecurring / stats.monthly / 100).toFixed(0) : 0}/mo
                </span>
              </div>
            </div>

            {/* Yearly */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">Yearly Recurring</span>
                <span className="text-lg font-black text-purple-400">
                  ${(stats.yearlyRecurring / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr
                </span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-purple-500 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats.yearly > 0 ? (stats.yearlyRecurring / (stats.monthlyRecurring + stats.yearlyRecurring)) * 100 : 0}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex gap-4 text-xs text-neutral-500">
                <span>{stats.yearly} active</span>
                <span>Avg: ${stats.yearly > 0 ? (stats.yearlyRecurring / stats.yearly / 100).toFixed(0) : 0}/yr</span>
              </div>
            </div>

            {/* One-Time */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">One-Time</span>
                <span className="text-lg font-black text-amber-400">{stats.oneTime}</span>
              </div>
              <p className="text-xs text-neutral-500">
                Total: $
                {(orders?.filter((o) => o.type === 'one_time').reduce((sum, o) => sum + o.amount, 0) ?? 0) / 100}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 space-y-6"
          variants={itemVariants}
        >
          <div>
            <p className="text-sm font-semibold text-white mb-1">Key Performance Indicators</p>
            <p className="text-xs text-neutral-500">Current metrics</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg">
              <span className="text-sm text-neutral-400">Projected Annual Revenue</span>
              <span className="text-xl font-black text-green-400">
                $
                {((stats.monthlyRecurring * 12 + stats.yearlyRecurring) / 100).toLocaleString('en-US', {
                  maximumFractionDigits: 0
                })}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg">
              <span className="text-sm text-neutral-400">Recurring Revenue %</span>
              <span className="text-xl font-black text-sky-400">
                {stats.total > 0 ? Math.round(((stats.monthly + stats.yearly) / stats.total) * 100) : 0}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg">
              <span className="text-sm text-neutral-400">Churn Rate</span>
              <span className="text-xl font-black text-red-400">{stats.churnRate}%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg">
              <span className="text-sm text-neutral-400">Active Subscriptions</span>
              <span className="text-xl font-black text-cyan-400">{stats.monthly + stats.yearly}</span>
            </div>
          </div>

          {/* Export Button */}
          <motion.button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-all"
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
