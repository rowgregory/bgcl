'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { DonationWithRelations } from '../_types/donation.types'
import DonationsTransactionOrderRow from '../_components/DonationsTransactionOrderRow'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'

type FrequencyFilter = 'all' | 'one_time' | 'monthly' | 'yearly'

const FREQUENCIES: { label: string; value: FrequencyFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'One-time', value: 'one_time' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
]

const thCls =
  'py-2 pr-4 text-[11px] font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-wider whitespace-nowrap'

export default function DonationsTransactionsClient({ data }: { data: DonationWithRelations[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [frequencyFilter, setFrequencyFilter] = useState<FrequencyFilter>('all')
  const [campaignFilter, setCampaignFilter] = useState('all')

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
        if (frequencyFilter === 'one_time' && o.type !== 'ONE_TIME_DONATION') return false
        if (frequencyFilter === 'monthly' && o.recurringFrequency !== 'monthly') return false
        if (frequencyFilter === 'yearly' && o.recurringFrequency !== 'yearly') return false
        if (campaignFilter !== 'all' && o.campaignId !== campaignFilter) return false

        const q = searchQuery.trim().toLowerCase()
        if (!q) return true

        return (
          o.customerEmail?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.id?.toLowerCase().includes(q) ||
          o.paymentIntentId?.toLowerCase().includes(q)
        )
      }),
    [data, searchQuery, frequencyFilter, campaignFilter]
  )

  // Recurring rows are one subscription each, so lifetimeAmount is what was collected
  const collected = filtered.reduce((sum, o) => sum + (o.lifetimeAmount ?? o.totalAmount), 0)
  const recurringCount = filtered.filter((o) => o.type === 'RECURRING_DONATION').length

  const isFiltered = frequencyFilter !== 'all' || campaignFilter !== 'all' || searchQuery.trim().length > 0

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AdminPageHeader
        title="Donation Transactions"
        meta={`${filtered.length} ${filtered.length === 1 ? 'donor' : 'donors'} · ${formatCurrency(collected)} collected · ${recurringCount} recurring`}
      />

      <div className="px-6 py-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search donations by name, email, or ID"
              placeholder="Search name, email, or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          <div
            role="radiogroup"
            aria-label="Filter by frequency"
            className="inline-flex rounded border border-neutral-200 dark:border-neutral-800 p-0.5"
          >
            {FREQUENCIES.map((btn) => (
              <button
                key={btn.value}
                type="button"
                role="radio"
                aria-checked={frequencyFilter === btn.value}
                onClick={() => setFrequencyFilter(btn.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  frequencyFilter === btn.value
                    ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {campaigns.length > 0 && (
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              aria-label="Filter by campaign"
              className="py-1.5 pl-2.5 pr-8 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 max-w-48 truncate"
            >
              <option value="all">All campaigns</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setFrequencyFilter('all')
                setCampaignFilter('all')
              }}
              className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-sm" aria-label="Donation transactions">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th scope="col" className={`text-left ${thCls}`}>
                  Name
                </th>
                <th scope="col" className={`text-left ${thCls}`}>
                  Email
                </th>
                <th scope="col" className={`text-left ${thCls}`}>
                  Campaign
                </th>
                <th scope="col" className={`text-left ${thCls}`}>
                  Type
                </th>
                <th scope="col" className={`text-left ${thCls}`}>
                  Last payment
                </th>
                <th scope="col" className={`text-left ${thCls}`}>
                  Status
                </th>
                <th scope="col" className={`text-right ${thCls}`}>
                  Amount
                </th>
                <th scope="col" className={`text-right ${thCls} pr-0`}>
                  Collected
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                    {isFiltered ? 'No donations match these filters.' : 'Donations will appear here.'}
                  </td>
                </tr>
              ) : (
                filtered.map((order, i) => <DonationsTransactionOrderRow key={order.id} order={order} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
