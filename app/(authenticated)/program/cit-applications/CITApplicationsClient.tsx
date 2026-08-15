'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Tab } from '@/types/entities/cit-application.types'
import { CITApplication } from '@prisma/client'
import { TAB_LABELS, TABS } from '@/lib/constants/cit-application.constants'
import { formatDate } from '@/lib/utils/date-utils'
import { CITApplicationDrawer } from '@/app/(public)/cit/_components/CITApplicationDrawer'
import { exportCITApplicationsAction } from '@/lib/actions/exports/generateCITApplicationsPDF'
import { StatusBadge } from '../../admin/cit-applications/CITCAdmin.subcomponents'

interface AdminCITApplicationsClientProps {
  applications: CITApplication[]
}

export function CITApplicationsClient({ applications }: AdminCITApplicationsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState<CITApplication | null>(null)
  const [loading, setLoading] = useState(false)

  // ── Stats ─────────────────────────────────────────────────────────────────
  const tabCounts = useMemo(() => {
    const counts: Record<Tab, number> = {
      All: applications.length,
      PENDING: 0,
      REVIEWED: 0,
      ACCEPTED: 0,
      REJECTED: 0
    }
    for (const app of applications) counts[app.status] += 1
    return counts
  }, [applications])

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return applications.filter((app) => {
      if (activeTab !== 'All' && app.status !== activeTab) return false
      if (!q) return true
      return (
        app.name.toLowerCase().includes(q) ||
        app.school.toLowerCase().includes(q) ||
        app.city.toLowerCase().includes(q) ||
        app.parentGuardianEmail.toLowerCase().includes(q)
      )
    })
  }, [applications, activeTab, searchQuery])

  const filterByTab = useCallback((tab: Tab) => {
    setActiveTab(tab)
  }, [])

  // ── Export (stub) ─────────────────────────────────────────────────────────
  const handleExportApplications = async () => {
    setLoading(true)
    try {
      const buffer = await exportCITApplicationsAction()

      const blob = new Blob([buffer], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      const now = new Date()

      const date = now.toLocaleDateString('en-CA') // YYYY-MM-DD format

      const a = document.createElement('a')
      a.href = url
      a.download = `BGCLynn_CITApplications_Report_${date}.pdf`
      a.click()

      window.URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col">
      {/* Tabs + Stats (single header row) */}
      <div className="fixed w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 sm:px-6 lg:px-8 z-10 pb-2 lg:pb-0 pt-20 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-x-4">
          {/* Tabs (each with its own count) */}
          <div className="flex gap-5 overflow-x-auto min-w-0">
            {TABS.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => filterByTab(tab)}
                  className={`py-3 text-sm font-semibold transition-colors relative whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'dark:text-white text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300'
                  }`}
                >
                  {TAB_LABELS[tab]}
                  <span
                    className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                      isActive
                        ? 'bg-sky-500 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {tabCounts[tab]}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-sky-600"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Search + Export (kept on screen, never shrinks below content) */}
          <div className="flex flex-row items-center gap-2 shrink-0">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              disabled={loading}
              onClick={handleExportApplications}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border border-sky-200 dark:border-sky-800 bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-neutral-800 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                  Exporting...
                </>
              ) : (
                'Export'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-6 pt-72 lg:pt-17">
        <div className="mx-auto">
          {/* List */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">No applications match your filters.</p>
            </div>
          ) : (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                      <th className="text-left font-semibold text-neutral-600 dark:text-neutral-400 px-4 py-3 uppercase text-xs tracking-wider">
                        Name
                      </th>
                      <th className="text-left font-semibold text-neutral-600 dark:text-neutral-400 px-4 py-3 uppercase text-xs tracking-wider">
                        School
                      </th>
                      <th className="text-left font-semibold text-neutral-600 dark:text-neutral-400 px-4 py-3 uppercase text-xs tracking-wider">
                        Grade
                      </th>
                      <th className="text-left font-semibold text-neutral-600 dark:text-neutral-400 px-4 py-3 uppercase text-xs tracking-wider">
                        Weeks
                      </th>
                      <th className="text-left font-semibold text-neutral-600 dark:text-neutral-400 px-4 py-3 uppercase text-xs tracking-wider">
                        Submitted
                      </th>
                      <th className="text-left font-semibold text-neutral-600 dark:text-neutral-400 px-4 py-3 uppercase text-xs tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => setSelected(app)}
                        tabIndex={0}
                        role="button"
                        aria-label={`View application from ${app.name}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setSelected(app)
                          }
                        }}
                        className="border-b border-neutral-200 dark:border-neutral-800 last:border-0 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
                      >
                        <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{app.name}</td>
                        <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{app.school}</td>
                        <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{app.grade}</td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                          {app.weeksAvailable.length}
                        </td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={app.status} />
                        </td>
                        {/* Action */}
                        <td className="px-4 py-3 text-right">
                          <div className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap">
                            View →
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-neutral-200 dark:divide-neutral-800">
                {filtered.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelected(app)}
                    className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 dark:text-white truncate">{app.name}</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
                          {app.school} · {app.grade}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                          {app.weeksAvailable.length} week{app.weeksAvailable.length === 1 ? '' : 's'} ·{' '}
                          {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      <CITApplicationDrawer application={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
