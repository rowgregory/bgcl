'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { PositionType } from '@prisma/client'
import { POSITION_LABELS, TAB_TO_STATUS, TABS } from '@/lib/constants/job-application.constants'
import { JobApplicationWithReferences } from '@/types/job-application.types'
import { useJobApplicationDrawer } from '@/stores/drawers'
import { JobApplicationDrawer } from './_components/JobApplicationDrawer'
import { AdminPageHeader } from '@/app/(authenticated)/admin/_components/AdminPageHeader'
import { ExportApplicationsButton } from './_components/ExportApplicationsButton'
import { sentenceCase } from '@/lib/utils/sentenceCase'
import { STATUS_DOT, thCls } from '../cit-applications/_constants/cit-application.constants'

export default function JobApplicationsClient({
  jobApplications
}: {
  jobApplications: JobApplicationWithReferences[]
}) {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const open = useJobApplicationDrawer((s) => s.open)

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return jobApplications.filter((app) => {
      if (TAB_TO_STATUS[activeTab] !== 'All' && app.status !== TAB_TO_STATUS[activeTab]) return false
      if (!q) return true

      return app.applicantName.toLowerCase().includes(q) || app.email.toLowerCase().includes(q)
    })
  }, [jobApplications, activeTab, searchQuery])

  const counts = useMemo(
    () =>
      TABS.reduce<Record<string, number>>((acc, tab) => {
        const status = TAB_TO_STATUS[tab]
        acc[tab] = status === 'All' ? jobApplications.length : jobApplications.filter((a) => a.status === status).length
        return acc
      }, {}),
    [jobApplications]
  )

  const pending = jobApplications.filter((a) => a.status === 'PENDING').length
  const isFiltered = activeTab !== 'All' || searchQuery.trim().length > 0

  return (
    <>
      <JobApplicationDrawer />

      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <AdminPageHeader
          title="Job Applications"
          meta={
            pending > 0 ? `${pending} pending · ${jobApplications.length} total` : `${jobApplications.length} total`
          }
          actions={<ExportApplicationsButton />}
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
                aria-label="Search applications by name or email"
                placeholder="Search name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              aria-label="Filter by status"
              className="py-1.5 pl-2.5 pr-8 bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-[13px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {TABS.map((tab) => (
                <option key={tab} value={tab}>
                  {tab} ({counts[tab] ?? 0})
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
              <table className="w-full min-w-160 text-sm" aria-label="Job applications">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th scope="col" className={`text-left ${thCls}`}>
                      Applicant
                    </th>
                    <th scope="col" className={`text-left ${thCls}`}>
                      Positions
                    </th>
                    <th scope="col" className={`text-left ${thCls}`}>
                      Employment
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
                      <td colSpan={5} className="py-16 text-center text-sm text-neutral-400 dark:text-neutral-600">
                        {isFiltered
                          ? 'No applications match this filter.'
                          : 'Job applications will appear here as they come in.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((application) => (
                      <tr
                        key={application.id}
                        onClick={() => open(application)}
                        className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <p className="text-neutral-900 dark:text-white truncate max-w-48">
                            {application.applicantName}
                          </p>
                          <p className="text-xs text-neutral-400 dark:text-neutral-600 truncate max-w-48">
                            {application.email}
                          </p>
                        </td>

                        <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 max-w-56">
                          <span className="truncate block">
                            {application.positionTypes
                              ?.map((position: PositionType) => POSITION_LABELS[position] ?? position)
                              .join(', ') || '—'}
                          </span>
                        </td>

                        <td className="py-3 pr-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400 capitalize">
                          {application.employmentType?.replace(/_/g, ' ').toLowerCase() ?? '—'}
                        </td>

                        <td className="py-3 pr-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400 tabular-nums">
                          {new Date(application.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'America/New_York'
                          })}
                        </td>

                        <td className="py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[application.status] ?? 'bg-neutral-300'}`}
                              aria-hidden="true"
                            />
                            {sentenceCase(application.status)}
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
