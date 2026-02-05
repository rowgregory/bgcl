'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Search,
  User,
  Mail,
  Calendar,
  CreditCard,
  Check,
  AlertCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { store } from '@/app/lib/store/store'
import { setOpenDonationDrawer } from '@/app/lib/store/slices/dashboardSlice'

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date))
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount / 100)
}

export default function AllDonationsClient({ donations }: { donations: any }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDonations = donations.filter((donation) => {
    // If search is empty, show all records
    if (!searchQuery || searchQuery.trim() === '') {
      return true
    }

    const matchesSearch =
      donation.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const donationsLength = donations?.filter((donation) => donation.paymentMethodId != null)?.length

  const totalDonations = donations
    ?.filter((donation) => donation.paymentMethodId != null)
    ?.reduce((sum, d) => sum + d.totalAmount * 100, 0)

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-6 pt-2">
        <div className="mx-auto">
          {/* Stats & Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Donations:</span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">{donationsLength}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Amount:</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalDonations)}
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search donations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {filteredDonations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400"
            >
              <DollarSign className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">No donations</p>
              <p className="text-sm">All donations will appear here</p>
            </motion.div>
          ) : (
            <motion.div className="space-y-2">
              {/* Header - Hidden on mobile */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Donor</div>
                <div className="col-span-2">Email</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Payment ID</div>
                <div className="col-span-1">Fees</div>
              </div>

              {filteredDonations.map((donation) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  onClick={() => store.dispatch(setOpenDonationDrawer(donation))}
                  key={donation.id}
                  className={`bg-white dark:bg-neutral-900/50 border rounded-lg transition-all p-4 lg:px-6 lg:py-4 ${
                    donation.status === 'FAILED'
                      ? 'border-red-200 dark:border-red-800/50 hover:border-red-300 dark:hover:border-red-700 opacity-75'
                      : donation.status === 'CANCELLED'
                        ? 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 opacity-60'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 lg:items-center">
                    {/* Amount - Full width mobile, col-span-2 desktop */}
                    <div className="lg:col-span-2 flex items-center justify-between lg:justify-start">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-2xl lg:text-lg font-bold ${
                            donation.status === 'FAILED'
                              ? 'text-red-600 dark:text-red-400'
                              : donation.status === 'CANCELLED'
                                ? 'text-neutral-500 dark:text-neutral-400 line-through'
                                : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {formatCurrency(donation.totalAmount * 100)}
                        </span>
                        {donation.status === 'FAILED' && (
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 lg:hidden" />
                        )}
                        {donation.status === 'CANCELLED' && (
                          <XCircle className="w-5 h-5 text-neutral-500 dark:text-neutral-400 lg:hidden" />
                        )}
                        {/* Subscription badge on mobile */}
                        {donation.type === 'RECURRING_DONATION' &&
                          donation.status !== 'FAILED' &&
                          donation.status !== 'CANCELLED' && (
                            <div className="lg:hidden flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                              <RefreshCw className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Sub</span>
                            </div>
                          )}
                      </div>
                      {/* Fees indicator - shown inline on mobile */}
                      {donation.coverFees && donation.status !== 'FAILED' && donation.status !== 'CANCELLED' && (
                        <div className="flex items-center gap-1 lg:hidden">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            +${(donation.feesCovered / 100).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Donor - Full width mobile, col-span-2 desktop */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span
                          className={`text-sm font-medium truncate ${
                            donation.status === 'FAILED' || donation.status === 'CANCELLED'
                              ? 'text-neutral-500 dark:text-neutral-500'
                              : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {donation.customerName}
                        </span>
                      </div>
                    </div>

                    {/* Email - Full width mobile, col-span-2 desktop */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-400 shrink-0" />

                        <a
                          href={`mailto:${donation.customerEmail}`}
                          className={`text-sm hover:underline truncate ${
                            donation.status === 'FAILED' || donation.status === 'CANCELLED'
                              ? 'text-neutral-500 dark:text-neutral-500'
                              : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {donation.customerEmail}
                        </a>
                      </div>
                    </div>

                    {/* Date - Full width mobile, col-span-2 desktop */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span
                          className={`text-sm ${
                            donation.status === 'FAILED' || donation.status === 'CANCELLED'
                              ? 'text-neutral-500 dark:text-neutral-500'
                              : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {formatDate(donation.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Payment ID, Status Badge, or Subscription Badge - Full width mobile, col-span-2 desktop */}
                    <div className="lg:col-span-3">
                      {donation.status === 'FAILED' ? (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 hidden lg:block" />
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">
                            Payment Failed
                          </span>
                        </div>
                      ) : donation.status === 'CANCELLED' ? (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0 hidden lg:block" />
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                            Cancelled
                          </span>
                        </div>
                      ) : donation.type === 'RECURRING_DONATION' ? (
                        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full w-fit">
                          <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            Subscription
                          </span>
                        </div>
                      ) : donation.paymentMethodId ? (
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-neutral-400 shrink-0" />
                          <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 truncate">
                            {donation.paymentMethodId}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </div>

                    {/* Fees - Hidden on mobile (shown inline with amount), col-span-1 desktop */}
                    <div className="hidden lg:block lg:col-span-1">
                      {donation.status === 'FAILED' || donation.status === 'CANCELLED' ? (
                        <span className="text-xs text-neutral-400">—</span>
                      ) : donation.coverFees ? (
                        <div className="flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            ${(donation.feesCovered / 100).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
