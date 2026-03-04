'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, DollarSign, User, Mail, Calendar, CreditCard, RefreshCw, AlertCircle, Check, Tag } from 'lucide-react'
import { JsonValue } from '@prisma/client/runtime/library'
import { store } from '@/app/lib/store/store'
import { setOpenDonationDrawer } from '@/app/lib/store/slices/dashboardSlice'

type OrderType = 'ONE_TIME_DONATION' | 'RECURRING_DONATION' | 'TICKET_PURCHASE'
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED' | 'PROCESSING' | 'REFUNDED' | 'PENDING_CANCELLATION'

interface Campaign {
  id: string
  name: string
}
interface Order {
  id: string
  createdAt: Date | string
  type: OrderType
  status: OrderStatus
  totalAmount: number
  paymentMethod?: string | null
  paymentIntentId?: string | null
  paidAt?: Date | string | null
  customerEmail: string
  customerName: string
  customerPhone?: string | null
  billingAddress?: Record<string, string> | null | JsonValue
  coverFees: boolean
  feesCovered: number
  notes?: string | null
  campaignId?: string | null
  campaign?: Campaign | null
  userId?: string | null
  paymentMethodId?: string | null
  stripeSubscriptionId?: string | null
  isRecurring: boolean
  recurringFrequency?: string | null
  nextBillingDate?: Date | string | null
  failureReason?: string | null
  failureCode?: string | null
}

const formatDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const formatUSD = (dollars: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars)

type FrequencyFilter = 'all' | 'one_time' | 'monthly' | 'yearly'

export default function FuelTankTransactionsClient({ data }: { data: Order[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [frequencyFilter, setFrequencyFilter] = useState<FrequencyFilter>('all')
  const [campaignFilter, setCampaignFilter] = useState<string>('all')

  const campaigns = useMemo(() => {
    const map = new Map<string, string>()
    data.forEach((o) => {
      if (o.campaign) map.set(o.campaign.id, o.campaign.name)
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [data])

  const filtered = useMemo(
    () =>
      data.filter((o) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          if (
            !o.customerEmail?.toLowerCase().includes(q) &&
            !o.customerName?.toLowerCase().includes(q) &&
            !o.id?.toLowerCase().includes(q) &&
            !o.paymentIntentId?.toLowerCase().includes(q)
          )
            return false
        }
        if (frequencyFilter === 'one_time' && o.type !== 'ONE_TIME_DONATION') return false
        if (frequencyFilter === 'monthly' && o.recurringFrequency !== 'monthly') return false
        if (frequencyFilter === 'yearly' && o.recurringFrequency !== 'yearly') return false
        if (campaignFilter !== 'all' && o.campaignId !== campaignFilter) return false
        return true
      }),
    [data, searchQuery, frequencyFilter, campaignFilter]
  )

  const totalAmount = filtered.reduce((sum, o) => sum + o.totalAmount, 0)
  const recurringCount = filtered.filter((o) => o.isRecurring).length
  const oneTimeCount = filtered.filter((o) => !o.isRecurring).length

  const freqBtns: { label: string; value: FrequencyFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'One-Time', value: 'one_time' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' }
  ]

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col min-w-0">
      <div className="flex-1 overflow-y-auto px-3 sm:px-8 pb-6 pt-4">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Stats - scrollable row on small screens */}
          <div className="overflow-x-auto pb-1">
            <div className="flex items-center gap-4 min-w-max">
              <StatChip label="Transactions" value={filtered.length.toString()} />
              <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
              <StatChip label="Total" value={formatUSD(totalAmount)} color="emerald" />
              <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
              <StatChip label="Recurring" value={recurringCount.toString()} color="indigo" />
              <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700" />
              <StatChip label="One-Time" value={oneTimeCount.toString()} />
            </div>
          </div>

          {/* Filters + Search - scrollable on small screens */}
          <div className="space-y-2">
            <div className="overflow-x-auto pb-1">
              <div className="flex items-center gap-2 min-w-max">
                {/* Frequency */}
                <div className="flex items-center gap-0.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  {freqBtns.map((btn) => (
                    <button
                      key={btn.value}
                      onClick={() => setFrequencyFilter(btn.value)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                        frequencyFilter === btn.value
                          ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Campaign */}
                {campaigns.length > 0 && (
                  <div className="flex items-center gap-0.5 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => setCampaignFilter('all')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                        campaignFilter === 'all'
                          ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                    >
                      <Tag className="w-3 h-3" /> All
                    </button>
                    {campaigns.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCampaignFilter(c.id)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all max-w-[120px] truncate whitespace-nowrap ${
                          campaignFilter === c.id
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search - full width */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Table - always a table, horizontally scrollable */}
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400"
            >
              <DollarSign className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
              <table className="w-full min-w-160 border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                      Campaign
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {filtered.map((order, i) => (
                      <OrderRow key={order.id} order={order} index={i} />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatChip({ label, value, color }: { label: string; value: string; color?: 'emerald' | 'indigo' }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{label}:</span>
      <span
        className={`text-xs font-semibold whitespace-nowrap ${
          color === 'emerald'
            ? 'text-emerald-600 dark:text-emerald-400'
            : color === 'indigo'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-neutral-900 dark:text-white'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function OrderRow({ order, index }: { order: Order; index: number }) {
  const isFailed = order.status === 'FAILED'
  const isCancelled = order.status === 'CANCELLED'

  return (
    <motion.tr
      onClick={() => store.dispatch(setOpenDonationDrawer(order))}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.02 }}
      className={`border-b border-neutral-100 dark:border-neutral-800/50 cursor-pointer transition-colors ${
        isFailed
          ? 'bg-red-50/50 dark:bg-red-900/5 hover:bg-red-50 dark:hover:bg-red-900/10 opacity-75'
          : isCancelled
            ? 'opacity-50 hover:bg-neutral-50 dark:hover:bg-neutral-900/30'
            : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/30'
      }`}
    >
      {/* Amount */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm font-bold ${
              isFailed
                ? 'text-red-600 dark:text-red-400'
                : isCancelled
                  ? 'text-neutral-400 line-through'
                  : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalAmount)}
          </span>
          {isFailed && <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
        </div>
      </td>

      {/* Name */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-sm text-neutral-900 dark:text-white max-w-30 truncate">
            {order.customerName || 'Guest'}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          {order.customerEmail ? (
            <a
              href={`mailto:${order.customerEmail}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline max-w-40 truncate block"
            >
              {order.customerEmail}
            </a>
          ) : (
            <span className="text-xs text-neutral-400">—</span>
          )}
        </div>
      </td>

      {/* Date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            {formatDate(order.paidAt || order.createdAt)}
          </span>
        </div>
      </td>

      {/* Campaign */}
      <td className="px-4 py-3 whitespace-nowrap">
        {order.campaign ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 rounded-full text-xs font-semibold max-w-30 truncate">
            <Tag className="w-3 h-3 shrink-0" />
            {order.campaign.name}
          </span>
        ) : (
          <span className="text-xs text-neutral-400">—</span>
        )}
      </td>

      {/* Type */}
      <td className="px-4 py-3 whitespace-nowrap">
        {order.isRecurring ? (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <RefreshCw className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
              {order.recurringFrequency || 'Sub'}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full">
            <CreditCard className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Once</span>
          </div>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            order.status === 'CONFIRMED'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : order.status === 'FAILED'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                : order.status === 'CANCELLED'
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
          }`}
        >
          <Check className="w-3 h-3" />
          {order.status}
        </span>
      </td>
    </motion.tr>
  )
}
