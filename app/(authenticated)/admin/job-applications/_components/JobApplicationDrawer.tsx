'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ApplicationStatus, PositionType } from '@prisma/client'
import { updateJobApplicationStatus } from '@/lib/actions/job-application/updateJobApplicationStatus'
import { POSITION_LABELS, STATUS_OPTIONS } from '@/lib/constants/job-application.constants'
import { useEscapeKey } from '@/lib/hooks/useEscapeKey'
import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll'
import { useJobApplicationDrawer } from '@/stores/drawers'

const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600'
const dtCls = 'text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600'
const ddCls = 'text-[13px] text-neutral-900 dark:text-white'
const proseCls = 'text-[13px] text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap'

const sentenceCase = (v?: string | null) => (v ? v.charAt(0) + v.slice(1).toLowerCase() : '—')

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className={`${labelCls} mb-3`}>{title}</p>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className={dtCls}>{label}</dt>
      <dd className={ddCls}>{children}</dd>
    </>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className={`${dtCls} mb-1.5`}>{label}</p>
      {children}
    </div>
  )
}

const dlCls = 'grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 items-baseline'

export function JobApplicationDrawer() {
  const isOpen = useJobApplicationDrawer((s) => s.isOpen)
  const application = useJobApplicationDrawer((s) => s.data)
  const open = useJobApplicationDrawer((s) => s.open)
  const close = useJobApplicationDrawer((s) => s.close)

  const [pending, setPending] = useState<ApplicationStatus | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const router = useRouter()
  const onClose = useCallback(() => close(), [close])

  useLockBodyScroll(isOpen)
  useEscapeKey(onClose, isOpen)

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    setPending(status)
    setErrorMsg('')

    try {
      const result = await updateJobApplicationStatus(id, status)

      if (result && result.success === false) {
        setErrorMsg(result.error ?? 'Could not update the status.')
        return
      }

      open({ ...application, status })
      router.refresh()
    } catch {
      setErrorMsg('Could not update the status.')
    } finally {
      setPending(null)
    }
  }

  if (!application) return null

  const certifications = [
    { key: 'agreeToTerms', label: 'Agreed to terms' },
    { key: 'certifyInformation', label: 'Certified information is accurate' },
    { key: 'authorizeBackground', label: 'Authorized background check' },
    { key: 'understandActiveStatus', label: 'Understands active status requirements' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/40 z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Job application details"
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col"
          >
            <div className="shrink-0 h-11 flex items-center justify-between gap-4 px-5 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-baseline gap-2.5 min-w-0">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {application.applicantName}
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-600 truncate">{application.email}</span>
              </div>

              <button
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

                <div className="inline-flex rounded border border-neutral-200 dark:border-neutral-800 p-0.5">
                  {STATUS_OPTIONS.map((status) => {
                    const active = application.status === status

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateStatus(application.id, status)}
                        disabled={pending !== null || active}
                        aria-pressed={active}
                        className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                          active
                            ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white'
                            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                        } ${pending !== null && !active ? 'opacity-50' : ''}`}
                      >
                        {pending === status ? 'Saving…' : sentenceCase(status)}
                      </button>
                    )
                  })}
                </div>

                {errorMsg && (
                  <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                    {errorMsg}
                  </p>
                )}
              </section>

              <Section title="Position and background">
                <dl className={dlCls}>
                  {application.positionTypes?.length > 0 && (
                    <Row label="Positions">
                      {application.positionTypes.map((p: PositionType) => POSITION_LABELS[p] ?? p).join(', ')}
                    </Row>
                  )}

                  <Row label="Employment">
                    <span className="capitalize">
                      {application.employmentType?.replace(/_/g, ' ').toLowerCase() ?? '—'}
                    </span>
                  </Row>

                  <Row label="Hours available">{application.hoursAvailable ?? '—'}</Row>

                  {application.languages && <Row label="Languages">{application.languages}</Row>}
                </dl>

                {application.youthOrgEmployment && (
                  <Block label="Youth organization employment">
                    <p className={proseCls}>{application.youthOrgEmployment}</p>
                  </Block>
                )}

                {application.education && (
                  <Block label="Education">
                    <p className={proseCls}>{application.education}</p>
                  </Block>
                )}

                {application.extracurricularsSkills && (
                  <Block label="Extracurriculars and skills">
                    <p className={proseCls}>{application.extracurricularsSkills}</p>
                  </Block>
                )}
              </Section>

              {application.references?.length > 0 && (
                <Section title="References">
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
                    {application.references.map((ref: any, i: number) => (
                      <div key={i} className="py-3 first:pt-0">
                        <p className="text-[13px] text-neutral-900 dark:text-white">{ref.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {[ref.positionAndCompany, ref.workRelationship].filter(Boolean).join(' · ')}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1 tabular-nums">
                          {[ref.phone, ref.email].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              <Section title="Driving">
                <dl className={dlCls}>
                  <Row label="Valid license">{application.hasValidDriverLicense ? 'Yes' : 'No'}</Row>

                  {application.licenseExpiration && (
                    <Row label="Expires">
                      <span className="tabular-nums">
                        {new Date(application.licenseExpiration).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          timeZone: 'America/New_York'
                        })}
                      </span>
                    </Row>
                  )}

                  {application.licenseSuspended !== undefined && (
                    <Row label="Suspended">{application.licenseSuspended ? 'Yes' : 'No'}</Row>
                  )}
                </dl>

                {application.noLicenseReason && (
                  <Block label="Reason for no license">
                    <p className={proseCls}>{application.noLicenseReason}</p>
                  </Block>
                )}

                {application.suspensionExplanation && (
                  <Block label="Suspension explanation">
                    <p className={proseCls}>{application.suspensionExplanation}</p>
                  </Block>
                )}

                {application.trafficViolations && (
                  <Block label="Traffic violations">
                    <p className={proseCls}>{application.trafficViolations}</p>
                  </Block>
                )}
              </Section>

              {application.resumeUrl && (
                <Section title="Resume">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[13px] text-neutral-900 dark:text-white truncate">
                        {application.resumeFileName}
                      </p>
                      {application.resumeFileSize && (
                        <p className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                          {(application.resumeFileSize / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>

                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors shrink-0"
                    >
                      Open PDF
                    </a>
                  </div>
                </Section>
              )}

              <Section title="Certification">
                <dl className={dlCls}>
                  {certifications.map(({ key, label }) => (
                    <Row key={key} label={label}>
                      <span
                        className={
                          application[key] ? 'text-neutral-900 dark:text-white' : 'text-red-600 dark:text-red-400'
                        }
                      >
                        {application[key] ? 'Yes' : 'No'}
                      </span>
                    </Row>
                  ))}

                  {application.signature && <Row label="Signature">{application.signature}</Row>}
                </dl>
              </Section>

              <Section title="Submission">
                <dl className={dlCls}>
                  <Row label="Submitted">
                    <span className="tabular-nums">
                      {new Date(application.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        timeZone: 'America/New_York'
                      })}
                    </span>
                  </Row>

                  <Row label="Application ID">
                    <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-600 break-all">
                      {application.id}
                    </span>
                  </Row>
                </dl>
              </Section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
