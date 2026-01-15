'use client'

import { useState } from 'react'
// import { motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
// import { getDonationOrders } from '@/app/lib/actions/getDonationOrders'

interface Donation {
  id: string
  customerName: string
  customerEmail: string
  amount: number
  frequency: 'once' | 'monthly' | 'yearly'
  type: 'one-time' | 'recurring'
  status: 'active' | 'past_due' | 'canceled'
  startDate: string
  nextBillingDate: string
  stripeSubscriptionId: string
}

export default function TheFuelTank({ orders }) {
  // const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'one-time' | 'recurring'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredDonations = orders
    .filter((d) => filter === 'all' || d.type === filter)
    .filter(
      (d) =>
        d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const stats = {
    total: orders.length,
    oneTime: orders.filter((d) => d.type === 'one-time' && d.status === 'active').length,
    monthly: orders.filter((d) => d.type === 'recurring' && d.frequency === 'monthly' && d.status === 'active').length,
    yearly: orders.filter((d) => d.type === 'recurring' && d.frequency === 'yearly' && d.status === 'active').length,
    totalRaised: orders.reduce((sum, d) => sum + d.amount / 100, 0),
    mrr: orders
      .filter((d) => d.type === 'recurring' && d.frequency === 'monthly' && d.status === 'active')
      .reduce((sum, d) => sum + d.amount / 100, 0),
    arr: orders
      .filter((d) => d.type === 'recurring' && d.frequency === 'yearly' && d.status === 'active')
      .reduce((sum, d) => sum + d.amount / 100, 0)
  }

  const statusStyles = {
    active: 'text-emerald-400',
    past_due: 'text-amber-400',
    canceled: 'text-zinc-400'
  }

  const statusBgStyles = {
    active: 'bg-emerald-500/10 border-emerald-500/30',
    past_due: 'bg-amber-500/10 border-amber-500/30',
    canceled: 'bg-zinc-500/10 border-zinc-500/30'
  }

  const getDonationType = (d: Donation) => {
    if (d.type === 'one-time') return '1x'
    if (d.frequency === 'monthly') return 'Monthly'
    if (d.frequency === 'yearly') return 'Yearly'
    return ''
  }

  // const loadOrders = async () => {
  //   setLoading(true)
  //   try {
  //     const data = await getDonationOrders()
  //     console.log('data: ', data)
  //   } catch (error) {
  //     console.error('Failed to fetch donations:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const [clearing, setClearing] = useState(false)

  // const clearTestData = async () => {
  //   if (!confirm('Are you sure? This will delete ALL test Stripe data.')) return

  //   setClearing(true)
  //   try {
  //     const response = await fetch('/api/admin/clear-test-data', {
  //       method: 'POST'
  //     })
  //     const data = await response.json()
  //     alert(`Cleared: ${data.deleted} customers`)
  //     await loadOrders()
  //   } catch (error) {
  //     alert('Failed to clear test data')
  //     console.error(error)
  //   } finally {
  //     setClearing(false)
  //   }
  // }

  // const [refunding, setRefunding] = useState(false)

  // const refundTestCharges = async () => {
  //   if (!confirm('Refund ALL test charges? This cannot be undone.')) return

  //   setRefunding(true)
  //   try {
  //     const response = await fetch('/api/admin/refund-test-charges', {
  //       method: 'POST'
  //     })
  //     const data = await response.json()

  //     console.log('Refund result:', data)

  //     alert(`Refunded: ${data.refunded} charges\n\nErrors: ${data.errors?.join(', ') || 'None'}`)
  //     await loadOrders()
  //   } catch (error) {
  //     alert('Failed to refund test charges')
  //     console.error(error)
  //   } finally {
  //     setRefunding(false)
  //   }
  // }

  const [deletingProducts, setDeletingProducts] = useState(false)

  const deleteTestProducts = async () => {
    if (!confirm('Delete ALL test products and prices? This cannot be undone.')) return

    setDeletingProducts(true)
    try {
      const response = await fetch('/api/admin/delete-test-products', {
        method: 'POST'
      })
      const data = await response.json()

      console.log('Delete products result:', data)

      alert(
        `Deleted: ${data.deletedProducts} products, ${data.deletedPrices} prices\n\nErrors: ${data.errors?.join(', ') || 'None'}`
      )
    } catch (error) {
      alert('Failed to delete test products')
      console.error(error)
    } finally {
      setDeletingProducts(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 sticky top-0 z-50 bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* <div className="flex gap-2 mb-3">
            <button
              onClick={clearTestData}
              disabled={clearing}
              className="px-4 py-2 bg-red-900/50 hover:bg-red-900 disabled:bg-zinc-900 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-red-400 hover:text-red-300 transition-colors border border-red-800/50"
            >
              {clearing ? 'Clearing...' : 'Clear Test Data'}
            </button>
            <button
              onClick={refundTestCharges}
              disabled={refunding}
              className="px-4 py-2 bg-amber-900/50 hover:bg-amber-900 disabled:bg-zinc-900 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors border border-amber-800/50"
            >
              {refunding ? 'Refunding...' : 'Refund Charges'}
            </button>
            <button
              onClick={deleteTestProducts}
              disabled={deletingProducts}
              className="px-4 py-2 bg-purple-900/50 hover:bg-purple-900 disabled:bg-zinc-900 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors border border-purple-800/50"
            >
              {deletingProducts ? 'Deleting...' : 'Delete Products'}
            </button>
          </div> */}
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">1x Donations</p>
              <p className="text-2xl font-bold">{stats.oneTime}</p>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Monthly</p>
              <p className="text-2xl font-bold">{stats.monthly}</p>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Yearly</p>
              <p className="text-2xl font-bold">{stats.yearly}</p>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">MRR</p>
              <p className="text-2xl font-bold text-sky-400">${stats.mrr.toFixed(0)}</p>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">ARR</p>
              <p className="text-2xl font-bold text-sky-400">${stats.arr.toFixed(0)}</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'one-time', 'recurring'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === type
                      ? 'bg-sky-600 hover:bg-sky-700 text-white'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'one-time' ? '1x' : 'Recurring'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredDonations.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-zinc-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDonations.map((donation) => (
              <div
                key={donation.id}
                className={`flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border transition-all cursor-pointer hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] group ${statusBgStyles[donation.status]}`}
                onClick={() => setExpandedId(expandedId === donation.id ? null : donation.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white truncate group-hover:text-sky-300 transition-colors">
                      {donation.customerName}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusStyles[donation.status]} font-semibold`}>
                      {donation.status === 'active' ? '✓' : donation.status === 'past_due' ? '!' : '✕'}{' '}
                      {donation.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-700/50 text-zinc-300 font-semibold">
                      {getDonationType(donation)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors truncate">
                    {donation.customerEmail}
                  </p>
                </div>

                <div className="text-right ml-4 flex items-center gap-4">
                  <div>
                    <p className="text-sm font-semibold text-sky-400 group-hover:text-sky-300 transition-colors">
                      ${(donation.amount / 100).toFixed(2)}
                    </p>
                    {donation.type === 'recurring' && (
                      <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        /{donation.frequency.charAt(0)}
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-all ${
                      expandedId === donation.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredDonations.length > 0 && (
          <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg text-center text-sm text-zinc-400">
            Showing <span className="text-white font-semibold">{filteredDonations.length}</span> of{' '}
            <span className="text-white font-semibold">{orders.length}</span> orders • Total Raised:{' '}
            <span className="text-sky-400 font-semibold">${stats.totalRaised.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
