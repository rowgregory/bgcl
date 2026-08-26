'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
import { generateDonationReport } from '@/lib/actions/exports/generateDonationsReport'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { useFailedPaymentDrawer } from '@/stores/drawers'
import { usePreferencesStore } from '@/stores/usePreferencesStore'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'

const usdWhole = (n: number) => `$${Math.round(n ?? 0).toLocaleString('en-US')}`

const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600'
const thCls =
  'py-2 pr-4 text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-wider whitespace-nowrap'
const panelCls = 'border border-neutral-200 dark:border-neutral-800 rounded-lg p-5'

function ExportReportButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await generateDonationReport({})

      if (!result.success || !result.pdf) {
        setError(result.error ?? 'Export failed')
        return
      }

      const link = document.createElement('a')
      link.href = result.pdf
      link.download = `donation-report-${new Date().toISOString().split('T')[0]}.pdf`
      link.click()
    } catch {
      setError('Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
      >
        {loading ? 'Generating…' : 'Export PDF'}
      </button>
    </div>
  )
}

export default function DonationsOverviewClient({ stats }: { stats: any }) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const isDark = usePreferencesStore((s) => s.isDark)
  const openFailed = useFailedPaymentDrawer((s) => s.open)

  const grid = isDark ? 'rgb(38, 38, 38)' : 'rgb(229, 231, 235)'
  const axis = isDark ? 'rgb(115, 115, 115)' : 'rgb(163, 163, 163)'

  const tooltipStyle = {
    backgroundColor: isDark ? 'rgb(23, 23, 23)' : 'rgb(255, 255, 255)',
    border: `1px solid ${grid}`,
    borderRadius: '6px',
    fontSize: '12px',
    color: isDark ? 'rgb(255, 255, 255)' : 'rgb(17, 24, 39)'
  }

  const recurringTotal = (stats?.monthlyRecurring ?? 0) + (stats?.yearlyRecurring ?? 0)
  const campaignTotal = stats?.campaigns?.reduce((sum: number, c: any) => sum + c.totalAmount, 0) ?? 0

  const metrics = [
    { label: 'Orders', value: (stats?.total ?? 0).toLocaleString(), sub: `${stats?.activeCount ?? 0} active` },
    { label: 'Avg donation', value: `$${(stats?.avgDonation ?? 0).toFixed(2)}`, sub: 'per donor' },
    { label: 'Monthly MRR', value: usdWhole(stats?.monthlyRecurring), sub: `${stats?.monthly ?? 0} subscriptions` },
    {
      label: 'Annual ARR',
      value: usdWhole(stats?.annualArr),
      sub: `${(stats?.monthly ?? 0) + (stats?.yearly ?? 0)} recurring`
    },
    { label: 'Retention', value: `${100 - (stats?.churnRate ?? 0)}%`, sub: 'month over month' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader
        title="Donations"
        meta={`${usdWhole(stats?.totalRaised)} raised · ${stats?.total ?? 0} orders`}
        actions={<ExportReportButton />}
      />

      <div className="px-6 py-8 lg:px-8 space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-8 lg:gap-12 pb-8 border-b border-neutral-200 dark:border-neutral-800"
        >
          <div>
            <p className={labelCls}>Total raised</p>
            <p className="mt-3 text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white tabular-nums">
              {usdWhole(stats?.totalRaised)}
            </p>

            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
              {stats?.activeCount ?? 0} active ·{' '}
              <button
                type="button"
                onClick={() => openFailed(stats.failedOrders)}
                className="text-red-600 dark:text-red-400 hover:underline font-medium"
              >
                {stats?.failedCount ?? 0} failed
              </button>{' '}
              · {stats?.cancelledCount ?? 0} cancelled
            </p>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-5 gap-x-8 gap-y-6 lg:border-l lg:border-neutral-200 lg:dark:border-neutral-800 lg:pl-12">
            {metrics.map((m) => (
              <div key={m.label}>
                <p className={labelCls}>{m.label}</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-white tabular-nums">{m.value}</p>
                <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-600">{m.sub}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 ${panelCls}`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className={labelCls}>Revenue trend</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">Last 6 months</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {(['line', 'bar'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setChartType(type)}
                    aria-pressed={chartType === type}
                    className={`capitalize transition-colors ${
                      chartType === type
                        ? 'text-neutral-900 dark:text-white font-medium'
                        : 'text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              {chartType === 'line' ? (
                <LineChart data={stats?.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                  <XAxis dataKey="name" stroke={axis} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke={axis} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${Number(v).toFixed(2)}`} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line
                    type="monotone"
                    dataKey="donations"
                    stroke="rgb(2, 132, 199)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="donors"
                    stroke={axis}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={false}
                    activeDot={{ r: 4 }}
                    name="New donors"
                  />
                </LineChart>
              ) : (
                <BarChart data={stats?.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                  <XAxis dataKey="name" stroke={axis} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke={axis} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${Number(v).toFixed(2)}`} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="donations" fill="rgb(2, 132, 199)" name="Revenue" />
                  <Bar dataKey="donors" fill={axis} name="New donors" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className={panelCls}>
            <p className={labelCls}>Retention rate</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1 mb-5">Last 6 months</p>

            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stats?.retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                <XAxis dataKey="month" stroke={axis} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke={axis} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                <Line
                  type="monotone"
                  dataKey="retention"
                  stroke="rgb(2, 132, 199)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={panelCls}>
            <p className={labelCls}>Recurring revenue</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1 mb-5">Monthly and yearly</p>

            <div className="space-y-4">
              {[
                {
                  label: 'Monthly',
                  amount: `${usdWhole(stats?.monthlyRecurring)}/mo`,
                  count: stats?.monthly ?? 0,
                  avg: stats?.monthly > 0 ? Math.round(stats.monthlyRecurring / stats.monthly) : 0,
                  unit: 'mo',
                  share: recurringTotal > 0 ? (stats?.monthlyRecurring / recurringTotal) * 100 : 0
                },
                {
                  label: 'Yearly',
                  amount: `${usdWhole(stats?.yearlyRecurring)}/yr`,
                  count: stats?.yearly ?? 0,
                  avg: stats?.yearly > 0 ? Math.round(stats.yearlyRecurring / stats.yearly) : 0,
                  unit: 'yr',
                  share: recurringTotal > 0 ? (stats?.yearlyRecurring / recurringTotal) * 100 : 0
                }
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{row.label}</span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white tabular-nums">
                      {row.amount}
                    </span>
                  </div>

                  <div className="h-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-sky-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${row.share}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                    {row.count} active · ${row.avg} avg per {row.unit}
                  </p>
                </div>
              ))}

              <div className="flex items-baseline justify-between pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">One-time</span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400 tabular-nums">
                  {stats?.oneTime ?? 0} · {formatCurrency(stats?.oneTimeTotal ?? 0)}
                </span>
              </div>
            </div>
          </div>

          <div className={panelCls}>
            <p className={labelCls}>Key indicators</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1 mb-5">Current metrics</p>

            <dl className="divide-y divide-neutral-100 dark:divide-neutral-900">
              {[
                {
                  term: 'Projected annual revenue',
                  value: usdWhole((stats?.monthlyRecurring ?? 0) * 12 + (stats?.yearlyRecurring ?? 0))
                },
                {
                  term: 'Recurring share of orders',
                  value: `${stats?.total > 0 ? Math.round(((stats.monthly + stats.yearly) / stats.total) * 100) : 0}%`
                },
                { term: 'Churn rate', value: `${stats?.churnRate ?? 0}%` },
                { term: 'Active subscriptions', value: ((stats?.monthly ?? 0) + (stats?.yearly ?? 0)).toLocaleString() }
              ].map((row) => (
                <div key={row.term} className="flex items-baseline justify-between py-2.5">
                  <dt className="text-sm text-neutral-500 dark:text-neutral-400">{row.term}</dt>
                  <dd className="text-sm font-medium text-neutral-900 dark:text-white tabular-nums">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section>
          <p className={`${labelCls} mb-4`}>Campaigns</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-140 text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className={`text-left ${thCls}`}>Campaign</th>
                  <th className={`text-right ${thCls}`}>Donors</th>
                  <th className={`text-right ${thCls}`}>Average</th>
                  <th className={`text-right ${thCls}`}>Share</th>
                  <th className={`text-right ${thCls} pr-0`}>Total raised</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {(stats?.campaigns ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-neutral-400 dark:text-neutral-600">
                      Campaign totals will appear here once donations come in.
                    </td>
                  </tr>
                ) : (
                  stats.campaigns.map((campaign: any, idx: number) => (
                    <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3 pr-4 text-neutral-900 dark:text-white">
                        {campaign.campaignName || 'No campaign'}
                      </td>
                      <td className="py-3 pr-4 text-right text-neutral-500 dark:text-neutral-400 tabular-nums">
                        {campaign.count}
                      </td>
                      <td className="py-3 pr-4 text-right text-neutral-500 dark:text-neutral-400 tabular-nums">
                        {formatCurrency(campaign.averageDonation)}
                      </td>
                      <td className="py-3 pr-4 text-right text-neutral-500 dark:text-neutral-400 tabular-nums">
                        {campaignTotal > 0 ? ((campaign.totalAmount / campaignTotal) * 100).toFixed(1) : '0.0'}%
                      </td>
                      <td className="py-3 text-right font-medium text-neutral-900 dark:text-white tabular-nums">
                        {formatCurrency(campaign.totalAmount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
