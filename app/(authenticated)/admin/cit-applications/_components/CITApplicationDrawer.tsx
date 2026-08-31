'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { CITApplication, CITApplicationStatus } from '@prisma/client'
import { updateCITApplicationStatus } from '@/lib/actions/cit-application'
import { formatDate } from '@/lib/utils/date-utils'
import { CIT_APPLICATION_STATUSES } from '@/lib/constants/cit-application.constants'
import { useCloseOnEscape } from '@/lib/hooks/useCloseOnEscape'
import { dlCls, dtCls, labelCls, proseCls } from '../_constants/cit-application.constants'
import { sentenceCase } from '@/lib/utils/sentenceCase'
import { Row, Section } from './CITCAdmin.subcomponents'

export function CITApplicationDrawer({
  application,
  onClose
}: {
  application: CITApplication | null
  onClose: () => void
}) {
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
      setStatus(next)
      setError(null)

      startTransition(async () => {
        const res = await updateCITApplicationStatus({ id: application.id, status: next })

        if (!res.success) {
          setStatus(previous)
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/40 z-40"
          />

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
            <div className="shrink-0 h-11 flex items-center justify-between gap-4 px-5 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-baseline gap-2.5 min-w-0">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{application.name}</h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-600 truncate">
                  {application.grade} · {application.school}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
              <section>
                <p className={`${labelCls} mb-3`}>Status</p>

                <div
                  role="group"
                  aria-label="Update application status"
                  className="inline-flex rounded border border-neutral-200 dark:border-neutral-800 p-0.5"
                >
                  {CIT_APPLICATION_STATUSES.map((s) => {
                    const isActive = status === s

                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleStatusChange(s)}
                        disabled={isPending}
                        aria-pressed={isActive}
                        className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed ${
                          isActive
                            ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                        } ${isPending && !isActive ? 'opacity-50' : ''}`}
                      >
                        {sentenceCase(s)}
                      </button>
                    )
                  })}
                </div>

                {error && (
                  <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </section>

              <Section title="Applicant">
                <dl className={dlCls}>
                  <Row label="Age" value={application.age} />
                  <Row label="Date of birth" value={formatDate(application.dateOfBirth)} />
                  <Row label="Grade" value={application.grade} />
                  <Row label="School" value={application.school} />
                  <Row label="City" value={application.city} />
                  <Row label="Submitted" value={formatDate(application.createdAt)} />
                </dl>
              </Section>

              <Section title="Contact">
                <dl className={dlCls}>
                  {application.cellPhone && (
                    <>
                      <dt className={dtCls}>Cell</dt>
                      <dd>
                        <a
                          href={`tel:${application.cellPhone}`}
                          className="text-[13px] text-sky-600 dark:text-sky-400 hover:underline tabular-nums"
                        >
                          {application.cellPhone}
                        </a>
                      </dd>
                    </>
                  )}

                  {application.personalEmail && (
                    <>
                      <dt className={dtCls}>Personal email</dt>
                      <dd className="min-w-0">
                        <a
                          href={`mailto:${application.personalEmail}`}
                          className="text-[13px] text-sky-600 dark:text-sky-400 hover:underline truncate block"
                        >
                          {application.personalEmail}
                        </a>
                      </dd>
                    </>
                  )}

                  {application.parentGuardianEmail && (
                    <>
                      <dt className={dtCls}>Guardian email</dt>
                      <dd className="min-w-0">
                        <a
                          href={`mailto:${application.parentGuardianEmail}`}
                          className="text-[13px] text-sky-600 dark:text-sky-400 hover:underline truncate block"
                        >
                          {application.parentGuardianEmail}
                        </a>
                      </dd>
                    </>
                  )}

                  <Row label="Emergency 1" value={application.emergencyContact1} />
                  <Row label="Emergency 2" value={application.emergencyContact2} />
                </dl>
              </Section>

              <Section title="Availability">
                {application.weeksAvailable.length > 0 ? (
                  <p className="text-[13px] text-neutral-700 dark:text-neutral-300">
                    {application.weeksAvailable.join(', ')}
                    <span className="text-neutral-400 dark:text-neutral-600 tabular-nums">
                      {' '}
                      ({application.weeksAvailable.length} {application.weeksAvailable.length === 1 ? 'week' : 'weeks'})
                    </span>
                  </p>
                ) : (
                  <p className="text-[13px] text-neutral-400 dark:text-neutral-600">No weeks selected.</p>
                )}
              </Section>

              <Section title="Strengths">
                <p className={proseCls}>{application.strengths}</p>
              </Section>

              <Section title="Hopes to learn">
                <p className={proseCls}>{application.hopesToLearn}</p>
              </Section>

              <Section title="Hobbies and extracurriculars">
                <p className={proseCls}>{application.hobbiesExtracurriculars}</p>
              </Section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
