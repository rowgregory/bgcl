'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Mail,
  Briefcase,
  Clock,
  Languages,
  Car,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Phone,
  Calendar,
  Shield,
  Pen,
  Archive,
  Trash2,
  ExternalLink
} from 'lucide-react'
import { IJobApplication } from '@/types/entities/job-application'
import { updateJobApplicationStatus } from '@/app/lib/actions/updateJobApplicationStatus'
import { ApplicationStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { store, useFormSelector } from '@/app/lib/store/store'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import Link from 'next/link'
import { deleteJobApplication } from '@/app/lib/actions/deleteJobApplication'
import { setIsLoading } from '@/app/lib/store/slices/formSlice'

interface AirlockClientProps {
  jobApplications: IJobApplication[]
}

const TABS = ['All', 'Pending', 'Review', 'Approved', 'Rejected']

const TAB_TO_STATUS: Record<string, string> = {
  All: 'All',
  Pending: 'PENDING',
  Review: 'REVIEW',
  Approved: 'APPROVED',
  Rejected: 'REJECTED'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return ''
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
    case 'REVIEW':
      return 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300'
    case 'APPROVED':
      return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
    case 'REJECTED':
      return 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
    default:
      return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
  }
}

const getEmploymentTypeBadge = (type: string) => {
  switch (type) {
    case 'FULL_TIME':
      return { label: 'Full Time', class: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' }
    case 'PART_TIME':
      return { label: 'Part Time', class: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' }
    case 'SEASONAL':
      return { label: 'Contract', class: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' }
    default:
      return { label: type, class: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400' }
  }
}

export default function AirlockClient({ jobApplications }: AirlockClientProps) {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const { isLoading } = useFormSelector()
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState('')

  const filterByTab = (tab: string) => {
    setActiveTab(tab)
  }

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

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    try {
      store.dispatch(setIsLoading(true))
      setCurrentStatus(status)
      await updateJobApplicationStatus(id, status)
      router.refresh()
      store.dispatch(showToast({ message: `Successfully updated status to ${status}` }))
    } catch {
      store.dispatch(showToast({ message: `Failed to update status to ${status}` }))
    } finally {
      store.dispatch(setIsLoading(false))
      setCurrentStatus('')
    }
  }

  const deleteApplication = async (id: string) => {
    try {
      store.dispatch(setIsLoading(true))
      await deleteJobApplication(id)
      router.refresh()
      store.dispatch(showToast({ message: `Successfully deleted job application!` }))
    } catch {
      store.dispatch(showToast({ message: `Failed to delete job application` }))
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  const Spinner = ({ color }: { color: string }) => (
    <span className={`w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin ${color}`} />
  )

  return (
    <div className="h-screen bg-white dark:bg-neutral-950 flex flex-col">
      {/* Tabs */}
      <div className="fixed w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-8 z-10 pb-3 lg:pb-0">
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
      <div className="flex-1 overflow-y-auto px-8 pb-6 pt-36 lg:pt-17">
        <div className="mx-auto">
          {/* Stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Total:</span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">{stats.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Pending:</span>
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{stats.pending}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Reviewing:</span>
                <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">{stats.review}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Approved:</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{stats.approved}</span>
              </div>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 dark:text-neutral-400">
              <Briefcase className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-lg font-medium">No applications</p>
              <p className="text-sm">Job applications will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredApplications.map((application, index) => {
                const loadingPending = isLoading && currentStatus === 'PENDING'
                const loadingReview = isLoading && currentStatus === 'REVIEW'
                const loadingApproved = isLoading && currentStatus === 'APPROVED'
                const loadingRejected = isLoading && currentStatus === 'REJECTED'
                return (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                  >
                    <div className="h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-linear-to-r from-slate-50 to-zinc-50 dark:from-slate-950/50 dark:to-zinc-950/50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
                              <span className="text-lg font-bold text-white">
                                {application.applicantName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-neutral-900 dark:text-white">
                                {application.applicantName}
                              </h3>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">{application.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(application.status)}`}
                            >
                              {application.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 space-y-5 flex-1">
                        {/* Application Info */}
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">Application ID</p>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white break-all">
                                {application.id}
                              </p>
                            </div>

                            <Link
                              href={`/get-involved/${application.id}`}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors whitespace-nowrap"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="hidden sm:inline">View Summary</span>
                            </Link>
                          </div>
                        </div>

                        {/* Position & Employment */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`px-2.5 py-1 text-xs font-medium rounded-full ${getEmploymentTypeBadge(application.employmentType).class}`}
                          >
                            {getEmploymentTypeBadge(application.employmentType).label}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="px-3 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">Hours Available</span>
                            </div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {application.hoursAvailable}
                            </p>
                          </div>
                          <div className="px-3 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Languages className="w-3.5 h-3.5 text-neutral-400" />
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">Languages</span>
                            </div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {application.languages}
                            </p>
                          </div>
                          <div className="px-3 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">Applied On</span>
                            </div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {formatDate(application.createdAt)}
                            </p>
                          </div>
                          <div className="px-3 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">Submitted</span>
                            </div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {formatDate(application.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Driver's License */}
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                          <div className="flex items-center gap-2 mb-3">
                            <Car className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              Driver's License
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">Valid License:</span>
                              {application.hasValidDriverLicense ? (
                                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle className="w-3.5 h-3.5" /> Yes
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                  <XCircle className="w-3.5 h-3.5" /> No
                                </span>
                              )}
                            </div>
                            {application.hasValidDriverLicense && application.licenseNumber && (
                              <div>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">License #: </span>
                                <span className="text-xs font-medium text-neutral-900 dark:text-white">
                                  {application.licenseNumber}
                                </span>
                              </div>
                            )}
                            {application.hasValidDriverLicense && application.licenseExpiration && (
                              <div>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">Expires: </span>
                                <span className="text-xs font-medium text-neutral-900 dark:text-white">
                                  {formatDate(application.licenseExpiration)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">Suspended:</span>
                              {application.licenseSuspended ? (
                                <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                  <AlertCircle className="w-3.5 h-3.5" /> Yes
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle className="w-3.5 h-3.5" /> No
                                </span>
                              )}
                            </div>
                          </div>
                          {!application.hasValidDriverLicense && application.noLicenseReason && (
                            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">Reason: </span>
                              <span className="text-xs text-neutral-700 dark:text-neutral-300">
                                {application.noLicenseReason}
                              </span>
                            </div>
                          )}
                          {application.trafficViolations && (
                            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                Traffic Violations:{' '}
                              </span>
                              <span className="text-xs text-neutral-700 dark:text-neutral-300">
                                {application.trafficViolations}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Resume */}
                        {application.resumeUrl && (
                          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                    {application.resumeFileName}
                                  </p>
                                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {formatFileSize(application.resumeFileSize)}
                                  </p>
                                </div>
                              </div>
                              <a
                                href={application.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-lg transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Download</span>
                              </a>
                            </div>
                          </div>
                        )}

                        {/* References */}
                        {application.references.length > 0 && (
                          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                            <div className="flex items-center gap-2 mb-3">
                              <Users className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                References ({application.references.length})
                              </span>
                            </div>
                            <div className="space-y-3">
                              {application.references.map((ref) => (
                                <div
                                  key={ref.id}
                                  className="p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{ref.name}</p>
                                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {ref.positionAndCompany}
                                      </p>
                                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {ref.workRelationship}
                                      </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                      <a
                                        href={`tel:${ref.phone}`}
                                        className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline"
                                      >
                                        <Phone className="w-3 h-3" /> {ref.phone}
                                      </a>
                                      <a
                                        href={`mailto:${ref.email}`}
                                        className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline"
                                      >
                                        <Mail className="w-3 h-3" /> {ref.email}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Certifications */}
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              Certifications & Agreements
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              {application.agreeToTerms ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-xs text-neutral-600 dark:text-neutral-400">Agreed to Terms</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {application.certifyInformation ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                Certified Information
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {application.authorizeBackground ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                Background Check Auth
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {application.understandActiveStatus ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                Active Status Understood
                              </span>
                            </div>
                          </div>
                          {application.signature && (
                            <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
                              <Pen className="w-3.5 h-3.5 text-neutral-400" />
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">Signed:</span>
                              <span className="text-sm font-medium italic text-neutral-900 dark:text-white">
                                {application.signature}
                              </span>
                              {application.createdAt && (
                                <span className="text-xs text-neutral-400">({formatDate(application.createdAt)})</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800/30 border-t border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                          {application.status === 'PENDING' && (
                            <motion.button
                              whileHover={!loadingReview ? { scale: 1.01 } : undefined}
                              whileTap={!loadingReview ? { scale: 0.99 } : undefined}
                              onClick={() => updateStatus(application.id, 'REVIEW')}
                              disabled={loadingReview}
                              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors 
                                ${
                                  loadingReview
                                    ? 'cursor-not-allowed bg-sky-100 dark:bg-sky-900/20 text-sky-400'
                                    : 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 hover:bg-sky-200 dark:hover:bg-sky-900/50'
                                }`}
                            >
                              {loadingReview ? (
                                <span className="w-3.5 h-3.5 border-2 border-sky-400/40 border-t-sky-600 dark:border-t-sky-400 rounded-full animate-spin" />
                              ) : (
                                <Clock className="w-3.5 h-3.5" />
                              )}
                              <span className="hidden sm:inline">Start Review</span>
                            </motion.button>
                          )}

                          {application.status === 'REVIEW' && (
                            <motion.button
                              whileHover={!loadingPending ? { scale: 1.01 } : undefined}
                              whileTap={!loadingPending ? { scale: 0.99 } : undefined}
                              onClick={() => updateStatus(application.id, 'PENDING')}
                              disabled={loadingPending}
                              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg transition-colors
                                ${
                                  loadingPending
                                    ? 'cursor-not-allowed bg-amber-100 dark:bg-amber-900/20 text-amber-400'
                                    : 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                                }`}
                            >
                              {loadingPending ? <Spinner color="text-amber-500" /> : <Clock className="w-3.5 h-3.5" />}
                              <span className="hidden sm:inline text-xs font-medium">
                                {loadingPending ? 'Updating…' : 'Pending'}
                              </span>
                            </motion.button>
                          )}

                          {application.status === 'REVIEW' && (
                            <>
                              <motion.button
                                whileHover={!loadingApproved ? { scale: 1.01 } : undefined}
                                whileTap={!loadingApproved ? { scale: 0.99 } : undefined}
                                onClick={() => updateStatus(application.id, 'APPROVED')}
                                disabled={loadingApproved}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg transition-colors 
                                ${
                                  loadingApproved
                                    ? 'cursor-not-allowed bg-emerald-100 dark:bg-emerald-900/20 text-emerald-400'
                                    : 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                                }`}
                              >
                                {loadingApproved ? (
                                  <Spinner color="text-emerald-500" />
                                ) : (
                                  <CheckCircle className="w-3.5 h-3.5" />
                                )}
                                <span className="hidden sm:inline text-xs font-medium">
                                  {loadingApproved ? 'Approving…' : 'Approve'}
                                </span>
                              </motion.button>
                              <motion.button
                                whileHover={!loadingRejected ? { scale: 1.01 } : undefined}
                                whileTap={!loadingRejected ? { scale: 0.99 } : undefined}
                                onClick={() => updateStatus(application.id, 'REJECTED')}
                                disabled={loadingRejected}
                                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg transition-colors
                                ${
                                  loadingRejected
                                    ? 'cursor-not-allowed bg-red-100 dark:bg-red-900/20 text-red-400'
                                    : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50'
                                }`}
                              >
                                {loadingRejected ? (
                                  <Spinner color="text-red-500" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
                                <span className="hidden sm:inline text-xs font-medium">
                                  {loadingRejected ? 'Rejecting…' : 'Reject'}
                                </span>
                              </motion.button>
                            </>
                          )}
                          {(application.status === 'APPROVED' || application.status === 'REJECTED') && (
                            <motion.button
                              whileHover={!loadingPending ? { scale: 1.01 } : undefined}
                              whileTap={!loadingPending ? { scale: 0.99 } : undefined}
                              onClick={() => updateStatus(application.id, 'PENDING')}
                              disabled={loadingPending}
                              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg transition-colors ${
                                loadingPending
                                  ? 'cursor-not-allowed bg-amber-100 dark:bg-amber-900/20 text-amber-400'
                                  : 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                              }`}
                            >
                              {loadingPending ? (
                                <Spinner color="text-amber-500" />
                              ) : (
                                <Archive className="w-3.5 h-3.5" />
                              )}
                              <span className="hidden sm:inline text-xs font-medium">
                                {loadingPending ? 'Reopening…' : 'Reopen'}
                              </span>
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => deleteApplication(application.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-xs font-medium">Delete</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
