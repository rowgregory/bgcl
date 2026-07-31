'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { updateCITApplicationStatus } from '@/lib/actions/cit-application'
import { CITApplication, CITApplicationStatus } from '@prisma/client'
import { formatDate } from '@/lib/utils/date-utils'
import {
  ACTIVE_STATUS_STYLES,
  CIT_APPLICATION_STATUSES,
  INACTIVE_STATUS_STYLES
} from '@/lib/constants/cit-application.constants'
import { useCloseOnEscape } from '@/lib/hooks/useCloseOnEscape'
import { Block, Field } from '@/app/(authenticated)/admin/cit-applications/CITCAdmin.subcomponents'

interface CITApplicationDrawerProps {
  application: CITApplication | null
  onClose: () => void
}

export function CITApplicationDrawer({ application, onClose }: CITApplicationDrawerProps) {
  const router = useRouter()
  const [status, setStatus] = useState<CITApplicationStatus | null>(application?.status ?? null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const open = application !== null

  useEffect(() => {
    setStatus(application?.status ?? null)
    setError(null)
  }, [application])

  useCloseOnEscape(open, onClose)

  const handleStatusChange = useCallback(
    (next: CITApplicationStatus) => {
      if (!application || next === status || isPending) return
      const previous = status
      setStatus(next) // optimistic
      setError(null)

      startTransition(async () => {
        const res = await updateCITApplicationStatus({ id: application.id, status: next })
        if (!res.success) {
          setStatus(previous) // rollback
          setError((res as { success: false; error: string }).error)
          return
        }
        router.refresh()
      })
    },
    [application, status, isPending, router]
  )

  return (
    <AnimatePresence>
      {open && application && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={`Application from ${application.name}`}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-xl bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white truncate">
                  {application.name}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                  {application.grade} · {application.school} · {formatDate(application.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="shrink-0 p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Status control */}
            <div className="px-5 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-500 mb-2">
                Status
              </p>
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Update application status">
                {CIT_APPLICATION_STATUSES.map((s) => {
                  const isActive = status === s
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStatusChange(s)}
                      disabled={isPending}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide border rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-60 ${
                        isActive ? ACTIVE_STATUS_STYLES[s] : INACTIVE_STATUS_STYLES
                      }`}
                    >
                      {isActive && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
                      {s}
                    </button>
                  )
                })}
              </div>
              {error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
              <Block title="Applicant">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Date of Birth" value={formatDate(application.dateOfBirth)} />
                  <Field label="Age" value={application.age} />
                  <Field label="City / Town" value={application.city} />
                  <Field label="School" value={application.school} />
                  <Field label="Grade" value={application.grade} />
                </dl>
              </Block>

              <Block title="Contact & Emergency">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Cell Phone" value={application.cellPhone} />
                  <Field label="Personal Email" value={application.personalEmail} />
                  <div className="sm:col-span-2">
                    <Field label="Parent / Guardian Email" value={application.parentGuardianEmail} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Emergency Contact 1" value={application.emergencyContact1} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Emergency Contact 2" value={application.emergencyContact2} />
                  </div>
                </dl>
              </Block>

              <Block title="Availability">
                {application.weeksAvailable.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {application.weeksAvailable.map((week) => (
                      <li
                        key={week}
                        className="px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full"
                      >
                        {week}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">No weeks selected.</p>
                )}
              </Block>

              <Block title="Strengths">
                <p className="text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {application.strengths}
                </p>
              </Block>

              <Block title="Hopes to Learn">
                <p className="text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {application.hopesToLearn}
                </p>
              </Block>

              <Block title="Hobbies & Extracurriculars">
                <p className="text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {application.hobbiesExtracurriculars}
                </p>
              </Block>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
