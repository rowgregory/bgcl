'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { CITApplication } from '@prisma/client'
import { Tab } from '@/types/entities/cit-application.types'
import { TAB_LABELS, TABS } from '@/lib/constants/cit-application.constants'
import { formatDate } from '@/lib/utils/date-utils'
import { CITApplicationDrawer } from '@/app/(authenticated)/admin/cit-applications/_components/CITApplicationDrawer'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'
import { ExportCITButton } from './_components/ExportCITButton'
import { STATUS_DOT, thCls } from './_constants/cit-application.constants'
import { sentenceCase } from '@/lib/utils/sentenceCase'

export function CITApplicationsClient({ applications }: { applications: CITApplication[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState<CITApplication | null>(null)

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

  const isFiltered = activeTab !== 'All' || searchQuery.trim().length > 0

  return (
    <>
      <CITApplicationDrawer application={selected} onClose={() => setSelected(null)} />

      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <AdminPageHeader
          title="CIT Applications"
          meta={
            tabCounts.PENDING > 0
              ? `${tabCounts.PENDING} pending · ${applications.length} total`
              : `${applications.length} total`
          }
          actions={<ExportCITButton />}
        />

        <div className="px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 pt-5">
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 dark:text-neutral-600"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search applications by name, school, city, or guardian email"
                placeholder="Search name, school, or city"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as Tab)}
              aria-label="Filter by status"
              className="py-1.5 pl-2.5 pr-8 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {TABS.map((tab) => (
                <option key={tab} value={tab}>
                  {TAB_LABELS[tab]} ({tabCounts[tab]})
                </option>
              ))}
            </select>

            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setActiveTab('All')
                }}
                className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="pt-4 pb-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 text-sm" aria-label="CIT applications">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th scope="col" className={`text-left ${thCls}`}>
                      Name
                    </th>
                    <th scope="col" className={`text-left ${thCls}`}>
                      School
                    </th>
                    <th scope="col" className={`text-left ${thCls}`}>
                      Grade
                    </th>
                    <th scope="col" className={`text-right ${thCls}`}>
                      Weeks
                    </th>
                    <th scope="col" className={`text-left ${thCls}`}>
                      Submitted
                    </th>
                    <th scope="col" className={`text-left ${thCls} pr-0`}>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                        {isFiltered
                          ? 'No applications match this filter.'
                          : 'CIT applications will appear here as they come in.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((app) => (
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
                        className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
                      >
                        <td className="py-3 pr-4 text-neutral-900 dark:text-white whitespace-nowrap">{app.name}</td>

                        <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 max-w-56 truncate">
                          {app.school}
                        </td>

                        <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap tabular-nums">
                          {app.grade}
                        </td>

                        <td className="py-3 pr-4 text-right text-neutral-500 dark:text-neutral-400 tabular-nums">
                          {app.weeksAvailable.length}
                        </td>

                        <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap tabular-nums">
                          {formatDate(app.createdAt)}
                        </td>

                        <td className="py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[app.status] ?? 'bg-neutral-300'}`}
                              aria-hidden="true"
                            />
                            {sentenceCase(app.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
