'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, DollarSign, Tag } from 'lucide-react'
import StatChip from '../common/StatChip'
import TransactionOrderRow from '../admin/TransactionOrderRow'
import { IOrder } from '@/types/entities/order'
import { formatCurrency } from '@/app/lib/utils/currency.utils'

type FrequencyFilter = 'all' | 'one_time' | 'monthly' | 'yearly'

export default function FuelTankTransactionsClient({ data }: { data: IOrder[] }) {
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
              <StatChip label="Total" value={formatCurrency(totalAmount)} color="emerald" />
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
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all max-w-30 truncate whitespace-nowrap ${
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
                      <TransactionOrderRow key={order.id} order={order} index={i} />
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
