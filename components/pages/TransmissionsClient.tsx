'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Search, Heart } from 'lucide-react'

import { store } from '@/lib/store/store'

import { formatDate } from '@/lib/utils/date-utils'
import { setOpenContactSubmissionDrawer } from '@/lib/store/slices/uiSlice'

export default function TransmissionsClient({ transmissions }: { transmissions: IContactSubmission[] }) {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    return transmissions
      .filter(
        (t) =>
          activeTab === 'All' ||
          t.status === activeTab.toUpperCase() ||
          (activeTab === 'Volunteer' && t.type === 'VOLUNTEER') ||
          (activeTab === 'General' && t.type === 'GENERAL')
      )
      .filter((t) => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          t.firstName?.toLowerCase().includes(q) ||
          t.lastName?.toLowerCase().includes(q) ||
          t.email?.toLowerCase().includes(q) ||
          t.subject?.toLowerCase().includes(q)
        )
      })
  }, [transmissions, activeTab, searchQuery])

  const stats = useMemo(
    () => ({
      total: transmissions.length,
      new: transmissions.filter((t) => t.status === 'NEW').length,
      read: transmissions.filter((t) => t.status === 'READ').length,
      archived: transmissions.filter((t) => t.status === 'ARCHIVED').length
    }),
    [transmissions]
  )

  const TABS = ['All', 'New', 'Read', 'Archived', 'Volunteer', 'Contact']

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col">
      <div className="fixed w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 sm:px-8 z-10 pb-3 lg:pb-0">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-3 lg:gap-x-8">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-semibold transition-colors relative shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded ${
                  activeTab === tab
                    ? 'dark:text-white text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300'
                }`}
              >
                {tab}
                {tab === 'New' && stats.new > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-sky-500 text-white rounded-full">{stats.new}</span>
                )}
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-sky-600"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search transmissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-6 pt-36 lg:pt-17">
        <div className="mx-auto">
          {/* Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
            {[
              { label: 'Total', value: stats.total, color: 'text-neutral-900 dark:text-white' },
              { label: 'New', value: stats.new, color: 'text-sky-600 dark:text-sky-400' },
              { label: 'Read', value: stats.read, color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Archived', value: stats.archived, color: 'text-neutral-600 dark:text-neutral-400' }
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}:</span>
                <span className={`text-sm font-semibold ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400">
              <MessageSquare className="w-12 h-12 mb-3 opacity-30" aria-hidden="true" />
              <p className="text-lg font-medium">No transmissions</p>
              <p className="text-sm">Incoming messages will appear here</p>
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse" aria-label="Transmissions">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                      {['Name', 'Email', 'Phone', 'Type', 'Date', 'Status', ''].map((col) => (
                        <th
                          key={col}
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t, i) => (
                      <motion.tr
                        onClick={() => store.dispatch(setOpenContactSubmissionDrawer(t))}
                        key={t.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                      >
                        {/* Name */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {t.firstName} {t.lastName}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{t.email}</span>
                        </td>

                        {/* Phone Number */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{t.phone}</span>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${
                              t.type === 'VOLUNTEER'
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                : 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                            }`}
                          >
                            {t.type === 'VOLUNTEER' ? (
                              <>
                                <Heart className="w-3 h-3" aria-hidden="true" />
                                Volunteer
                              </>
                            ) : (
                              <>
                                <MessageSquare className="w-3 h-3" aria-hidden="true" />
                                Contact
                              </>
                            )}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <time
                            dateTime={new Date(t.createdAt).toISOString()}
                            className="text-xs text-neutral-500 dark:text-neutral-400"
                          >
                            {formatDate(t.createdAt)}
                          </time>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              t.status === 'NEW'
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                : t.status === 'READ'
                                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap">
                            View →
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
