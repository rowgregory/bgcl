'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Briefcase } from 'lucide-react'
import { IJobApplication } from '@/types/entities/job-application'
import { PositionType } from '@prisma/client'
import { POSITION_LABELS, TAB_TO_STATUS, TABS } from '@/app/lib/constants/job-application.constants'
import { getJobApplicationStatusBadge } from '@/app/lib/utils/getJobApplicationStatusBadge'
import { store } from '@/app/lib/store/store'
import { setOpenJobApplicationDrawer } from '@/app/lib/store/slices/uiSlice'
import { exportApplicationsAction } from '@/app/lib/actions/generateJobApplicationsPDF'

export default function JobApplicationsClient({ jobApplications }: { jobApplications: IJobApplication[] }) {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filterByTab = (tab: string) => setActiveTab(tab)

  const filteredApplications = jobApplications.filter((app) => {
    const matchesTab = TAB_TO_STATUS[activeTab] === 'All' || app.status === TAB_TO_STATUS[activeTab]

    const matchesSearch =
      searchQuery === '' ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  const stats = {
    total: jobApplications.length,
    pending: jobApplications.filter((a) => a.status === 'PENDING').length,
    review: jobApplications.filter((a) => a.status === 'REVIEW').length,
    approved: jobApplications.filter((a) => a.status === 'APPROVED').length,
    rejected: jobApplications.filter((a) => a.status === 'REJECTED').length
  }

  const [loading, setLoading] = useState(false)

  const handleExportApplications = async () => {
    setLoading(true)
    try {
      const buffer = await exportApplicationsAction()

      const blob = new Blob([buffer], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      const now = new Date()

      const date = now.toLocaleDateString('en-CA') // YYYY-MM-DD format

      const a = document.createElement('a')
      a.href = url
      a.download = `BGCLynn_Applications_Report_${date}.pdf`
      a.click()

      window.URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col">
      {/* Tabs */}
      <div className="fixed w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-8 z-10 pb-3 lg:pb-0 pt-20 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-3 lg:gap-x-8">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => filterByTab(tab)}
                className={`py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab
                    ? 'dark:text-white text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300'
                }`}
              >
                {tab}
                {tab === 'New' && stats.pending > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-sky-500 text-white rounded-full">{stats.pending}</span>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search the airlock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-6 pt-52 lg:pt-17">
        <div className="mx-auto">
          {/* Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
            {/* STATS ROW */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-6">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Total:</span>
                <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">{stats.total}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Pending:</span>
                <span className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {stats.pending}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Reviewing:</span>
                <span className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400">{stats.review}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">Approved:</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {stats.approved}
                </span>
              </div>
            </div>

            {/* EXPORT BUTTON */}
            <button
              disabled={loading}
              onClick={handleExportApplications}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border border-sky-200 dark:border-sky-800 bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-neutral-800 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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

          {filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400">
              <Briefcase className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">No applications</p>
              <p className="text-sm">Job applications will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Positions
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Employment Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredApplications.map((application, index) => (
                    <motion.tr
                      onClick={() => store.dispatch(setOpenJobApplicationDrawer(application))}
                      key={application.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    >
                      {/* Applicant */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-white">{application.applicantName}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{application.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Positions */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {application.positionTypes?.map((position: PositionType) => (
                            <span
                              key={position}
                              className="px-2 py-0.5 text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full whitespace-nowrap"
                            >
                              {POSITION_LABELS[position] ?? position}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Employment Type */}
                      <td className="px-4 py-3">
                        <span className="text-neutral-700 dark:text-neutral-300 capitalize">
                          {application.employmentType?.replace('_', ' ').toLowerCase()}
                        </span>
                      </td>

                      {/* Submitted */}
                      <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {new Date(application.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getJobApplicationStatusBadge(application.status)}`}
                        >
                          {application.status}
                        </span>
                      </td>

                      {/* Action */}
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
          )}
        </div>
      </div>
    </div>
  )
}
