'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Search, User, Mail, Calendar, CreditCard } from 'lucide-react'

export default function OneTimeDonationsClient({ oneTimeDonations }: { oneTimeDonations: any }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDonations = oneTimeDonations.filter((donation) => {
    const matchesSearch =
      searchQuery === '' ||
      donation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.email?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

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

  const totalDonations = oneTimeDonations.reduce((sum, d) => sum + d.totalAmount * 100, 0)

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
                  {oneTimeDonations.length}
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
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400">
              <DollarSign className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">No donations</p>
              <p className="text-sm">One-time donations will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDonations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4"
                >
                  {/* Amount */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(donation.totalAmount * 100)}
                    </span>
                  </div>

                  {/* Donor Info */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-neutral-900 dark:text-white truncate">{donation.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-neutral-900 dark:text-white truncate">{donation.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-neutral-900 dark:text-white">{formatDate(donation.createdAt)}</span>
                    </div>
                    {donation.stripePaymentId && (
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <CreditCard className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-neutral-900 dark:text-white truncate text-xs font-mono">
                          {donation.stripePaymentId}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
