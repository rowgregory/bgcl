'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils/date-utils'
import { deleteContactSubmission } from '@/lib/actions/contact-submission/deleteContactSubmission'
import { updateContactSubmissionStatus } from '@/lib/actions/contact-submission/updateContactSubmissionStatus'
import { useContactSubmissionDrawer } from '@/stores/drawers'
import Backdrop from '@/components/_shared/Backdrop'

const dtCls = 'text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600'
const ddCls = 'text-[13px] text-neutral-900 dark:text-white'
const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600'

export function ContactSubmissionDrawer() {
  const submission = useContactSubmissionDrawer((s) => s.data)
  const isOpen = useContactSubmissionDrawer((s) => s.isOpen)
  const onClose = useContactSubmissionDrawer((s) => s.close)

  const [pending, setPending] = useState<'read' | 'archive' | 'delete' | null>(null)
  const [error, setError] = useState('')

  const router = useRouter()

  const isVolunteer = submission?.type === 'VOLUNTEER'

  const run = async (action: 'read' | 'archive' | 'delete') => {
    if (!submission?.id) return

    setPending(action)
    setError('')

    try {
      const result =
        action === 'delete'
          ? await deleteContactSubmission(submission.id)
          : await updateContactSubmissionStatus(submission.id, action === 'read' ? 'READ' : 'ARCHIVED')

      if (result && result.success === false) {
        setError(result.error ?? 'Something went wrong.')
        setPending(null)
        return
      }

      router.refresh()
      onClose()
    } catch {
      setError('Something went wrong.')
    } finally {
      setPending(null)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClose={onClose} />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Submission details"
            className="fixed right-0 top-0 h-full w-full sm:w-120 z-50 bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 flex flex-col"
          >
            <div className="shrink-0 h-11 flex items-center justify-between gap-4 px-5 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-baseline gap-2.5 min-w-0">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {isVolunteer ? 'Volunteer application' : (submission?.subject ?? 'Contact submission')}
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-600 whitespace-nowrap tabular-nums">
                  {formatDate(submission?.createdAt)}
                </span>
              </div>

              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">
              <section>
                <p className={`${labelCls} mb-3`}>From</p>

                <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 items-baseline">
                  <dt className={dtCls}>Name</dt>
                  <dd className={`${ddCls} truncate`}>
                    {[submission?.firstName, submission?.lastName].filter(Boolean).join(' ') || '—'}
                  </dd>

                  <dt className={dtCls}>Email</dt>
                  <dd className="min-w-0">
                    <a
                      href={`mailto:${submission?.email}`}
                      className="text-[13px] text-sky-600 dark:text-sky-400 hover:underline truncate block"
                    >
                      {submission?.email}
                    </a>
                  </dd>

                  {submission?.phone && (
                    <>
                      <dt className={dtCls}>Phone</dt>
                      <dd>
                        <a
                          href={`tel:${submission.phone}`}
                          className="text-[13px] text-sky-600 dark:text-sky-400 hover:underline tabular-nums"
                        >
                          {submission.phone}
                        </a>
                      </dd>
                    </>
                  )}

                  <dt className={dtCls}>Type</dt>
                  <dd className={ddCls}>{isVolunteer ? 'Volunteer' : 'Contact'}</dd>
                </dl>
              </section>

              {isVolunteer && (
                <section>
                  <p className={`${labelCls} mb-3`}>Volunteer details</p>

                  <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 items-baseline">
                    {submission?.programInterests && (
                      <>
                        <dt className={dtCls}>Program</dt>
                        <dd className={`${ddCls} capitalize`}>{submission.programInterests.replace(/-/g, ' ')}</dd>
                      </>
                    )}

                    {submission?.availabilityDays && (
                      <>
                        <dt className={dtCls}>Days</dt>
                        <dd className={ddCls}>{submission.availabilityDays}</dd>
                      </>
                    )}

                    {submission?.availabilityHours && (
                      <>
                        <dt className={dtCls}>Hours</dt>
                        <dd className={`${ddCls} capitalize`}>{submission.availabilityHours}</dd>
                      </>
                    )}

                    {submission?.yearsExperience && (
                      <>
                        <dt className={dtCls}>Experience</dt>
                        <dd className={`${ddCls} tabular-nums`}>{submission.yearsExperience} years</dd>
                      </>
                    )}

                    <dt className={dtCls}>Background check</dt>
                    <dd
                      className={`text-[13px] ${
                        submission?.backgroundCheckAck
                          ? 'text-neutral-900 dark:text-white'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {submission?.backgroundCheckAck ? 'Acknowledged' : 'Not acknowledged'}
                    </dd>
                  </dl>
                </section>
              )}

              {(submission?.message || submission?.additionalInfo) && (
                <section>
                  <p className={`${labelCls} mb-3`}>Message</p>

                  {submission?.message && (
                    <p className="text-[13px] text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                      {submission.message}
                    </p>
                  )}

                  {submission?.additionalInfo && (
                    <div
                      className={
                        submission?.message ? 'mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-900' : ''
                      }
                    >
                      <p className={`${dtCls} mb-1.5`}>Additional info</p>
                      <p className="text-[13px] text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                        {submission.additionalInfo}
                      </p>
                    </div>
                  )}
                </section>
              )}
            </div>

            <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 px-5 py-3">
              {error && <p className="text-xs text-red-600 dark:text-red-400 mb-2">{error}</p>}

              <div className="flex items-center gap-4">
                {(submission?.status === 'NEW' || submission?.status === 'ARCHIVED') && (
                  <button
                    type="button"
                    onClick={() => run('read')}
                    disabled={pending !== null}
                    className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
                  >
                    {pending === 'read' ? 'Saving…' : 'Mark read'}
                  </button>
                )}

                {submission?.status === 'READ' && (
                  <button
                    type="button"
                    onClick={() => run('archive')}
                    disabled={pending !== null}
                    className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
                  >
                    {pending === 'archive' ? 'Saving…' : 'Archive'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => run('delete')}
                  disabled={pending !== null}
                  className="ml-auto text-xs font-medium text-neutral-400 dark:text-neutral-600 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
                >
                  {pending === 'delete' ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
