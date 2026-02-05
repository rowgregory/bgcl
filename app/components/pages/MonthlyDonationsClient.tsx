'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Search, User, Mail, Calendar, CreditCard, Check, XCircle } from 'lucide-react'
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

export default function MonthlyDonationsClient({ monthlyDonations }: { monthlyDonations: any }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDonations = monthlyDonations.filter((donation) => {
    const matchesSearch =
      searchQuery === '' ||
      donation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.email?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const totalDonations = monthlyDonations.reduce((sum, d) => sum + d.totalAmount * 100, 0)

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
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {monthlyDonations.length}
                </span>
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
              <p className="text-sm">Monthly donations will appear here</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.03
                  }
                }
              }}
            >
              {/* Header - Hidden on mobile */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Donor</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Payment ID</div>
                <div className="col-span-1">Fees</div>
              </div>

              {/* List Items */}
              {filteredDonations.map((donation) => (
                <motion.div
                  key={donation.id}
                  onClick={() => store.dispatch(setOpenDonationDrawer(donation))}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.01 }}
                  className={`bg-white dark:bg-neutral-900/50 border rounded-lg transition-all p-4 lg:px-6 lg:py-4 ${
                    donation.status === 'CANCELLED'
                      ? 'border-red-300 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 lg:items-center">
                    {/* Amount - Full width mobile, col-span-2 desktop */}
                    <div className="lg:col-span-2 flex items-center justify-between lg:justify-start">
                      <span
                        className={`text-2xl lg:text-lg font-bold ${
                          donation.status === 'CANCELLED'
                            ? 'text-red-600 dark:text-red-400 line-through'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {formatCurrency(donation.totalAmount * 100)}
                      </span>
                      {/* Status badge - shown on mobile when cancelled */}
                      {donation.status === 'CANCELLED' && (
                        <div className="flex items-center gap-1 lg:hidden">
                          <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400">Cancelled</span>
                        </div>
                      )}
                      {/* Fees indicator - shown inline on mobile */}
                      {donation.coverFees && donation.status !== 'CANCELLED' && (
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
                        <User
                          className={`w-4 h-4 shrink-0 ${
                            donation.status === 'CANCELLED' ? 'text-red-400 dark:text-red-600' : 'text-neutral-400'
                          }`}
                        />
                        <span
                          className={`text-sm font-medium truncate ${
                            donation.status === 'CANCELLED'
                              ? 'text-neutral-500 dark:text-neutral-500'
                              : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {donation.customerName}
                        </span>
                      </div>
                    </div>

                    {/* Email - Full width mobile, col-span-3 desktop */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-2">
                        <Mail
                          className={`w-4 h-4 shrink-0 ${
                            donation.status === 'CANCELLED' ? 'text-red-400 dark:text-red-600' : 'text-neutral-400'
                          }`}
                        />

                        <a
                          href={`mailto:${donation.customerEmail}`}
                          className={`text-sm truncate ${
                            donation.status === 'CANCELLED'
                              ? 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400'
                              : 'text-blue-600 dark:text-blue-400 hover:underline'
                          }`}
                        >
                          {donation.customerEmail}
                        </a>
                      </div>
                    </div>

                    {/* Date - Full width mobile, col-span-2 desktop */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className={`w-4 h-4 shrink-0 ${
                            donation.status === 'CANCELLED' ? 'text-red-400 dark:text-red-600' : 'text-neutral-400'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            donation.status === 'CANCELLED'
                              ? 'text-neutral-500 dark:text-neutral-500'
                              : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {formatDate(donation.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Payment ID - Full width mobile, col-span-2 desktop */}
                    <div className="lg:col-span-2">
                      {donation.paymentMethodId ? (
                        <div className="flex items-center gap-2">
                          <CreditCard
                            className={`w-4 h-4 shrink-0 ${
                              donation.status === 'CANCELLED' ? 'text-red-400 dark:text-red-600' : 'text-neutral-400'
                            }`}
                          />
                          <span
                            className={`text-xs font-mono truncate ${
                              donation.status === 'CANCELLED'
                                ? 'text-neutral-500 dark:text-neutral-500'
                                : 'text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {donation.paymentMethodId}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </div>

                    {/* Fees/Status - Hidden on mobile (shown inline with amount), col-span-1 desktop */}
                    <div className="hidden lg:block lg:col-span-1">
                      {donation.status === 'CANCELLED' ? (
                        <div className="flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400">Cancelled</span>
                        </div>
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
