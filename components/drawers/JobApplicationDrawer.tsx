'use client'

import { updateJobApplicationStatus } from '@/lib/actions/job-application/updateJobApplicationStatus'
import { POSITION_LABELS, STATUS_OPTIONS, STATUS_STYLES } from '@/lib/constants/job-application.constants'
import { setIsLoading } from '@/lib/store/slices/formSlice'
import { showToast } from '@/lib/store/slices/toastSlice'
import { setCloseJobApplicationDrawer, setOpenJobApplicationDrawer } from '@/lib/store/slices/uiSlice'
import { store, useFormSelector, useUiSelector } from '@/lib/store/store'
import { ApplicationStatus, PositionType } from '@prisma/client'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function JobApplicationDrawer() {
  const { jobApplicationDrawer, application } = useUiSelector()
  const overlayRef = useRef<HTMLDivElement>(null)
  const onClose = () => store.dispatch(setCloseJobApplicationDrawer())
  const { isLoading } = useFormSelector()
  const router = useRouter()

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    try {
      store.dispatch(setIsLoading(true))
      await updateJobApplicationStatus(id, status)
      router.refresh()
      store.dispatch(showToast({ message: `Successfully updated status to ${status}` }))
      store.dispatch(setOpenJobApplicationDrawer({ ...application, status }))
    } catch {
      store.dispatch(showToast({ message: `Failed to update status to ${status}` }))
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = jobApplicationDrawer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [jobApplicationDrawer])

  if (!application) return null

  return (
    <AnimatePresence>
      {jobApplicationDrawer && (
        <>
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {application.applicantName
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-white">{application.applicantName}</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{application.email}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Status Management */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Application Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(application.id, status)}
                      disabled={isLoading || application.status === status}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border-2 transition-all ${
                        application.status === status
                          ? `${STATUS_STYLES[status]} border-current`
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  Click a status above to update this application. The currently active status is highlighted.
                </p>
              </div>

              {/* Position & Background */}
              <Section title="Position & Background">
                {application.positionTypes?.length > 0 && (
                  <Field label="Positions Applied For">
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {application.positionTypes.map((p: PositionType) => (
                        <span
                          key={p}
                          className="px-2.5 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full"
                        >
                          {POSITION_LABELS[p]}
                        </span>
                      ))}
                    </div>
                  </Field>
                )}
                {application.youthOrgEmployment && (
                  <Field label="Youth Organization Employment">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {application.youthOrgEmployment}
                    </p>
                  </Field>
                )}
                {application.education && (
                  <Field label="Education">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {application.education}
                    </p>
                  </Field>
                )}
                {application.extracurricularsSkills && (
                  <Field label="Extracurricular Activities & Skills">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {application.extracurricularsSkills}
                    </p>
                  </Field>
                )}
              </Section>

              {/* Personal Info */}
              <Section title="Personal Information">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Employment Type">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
                      {application.employmentType?.replace('_', ' ').toLowerCase()}
                    </p>
                  </Field>
                  <Field label="Hours Available">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{application.hoursAvailable}</p>
                  </Field>
                </div>
                {application.languages && (
                  <Field label="Languages Spoken">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{application.languages}</p>
                  </Field>
                )}
              </Section>

              {/* References */}
              {application.references?.length > 0 && (
                <Section title="References">
                  <div className="space-y-3">
                    {application.references.map((ref: any, i: number) => (
                      <div key={i} className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg space-y-1">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">{ref.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{ref.positionAndCompany}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{ref.workRelationship}</p>
                        <div className="flex gap-4 pt-1">
                          <p className="text-xs text-neutral-700 dark:text-neutral-300">{ref.phone}</p>
                          <p className="text-xs text-neutral-700 dark:text-neutral-300">{ref.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Driving Info */}
              <Section title="Driving Information">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Valid Driver's License">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {application.hasValidDriverLicense ? 'Yes' : 'No'}
                    </p>
                  </Field>
                  {application.licenseNumber && (
                    <Field label="License Number">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {application.licenseNumber}
                      </p>
                    </Field>
                  )}
                  {application.licenseExpiration && (
                    <Field label="License Expiration">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {new Date(application.licenseExpiration).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </Field>
                  )}
                  {application.licenseSuspended !== undefined && (
                    <Field label="License Suspended">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {application.licenseSuspended ? 'Yes' : 'No'}
                      </p>
                    </Field>
                  )}
                </div>
                {application.noLicenseReason && (
                  <Field label="No License Reason">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{application.noLicenseReason}</p>
                  </Field>
                )}
                {application.suspensionExplanation && (
                  <Field label="Suspension Explanation">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {application.suspensionExplanation}
                    </p>
                  </Field>
                )}
                {application.trafficViolations && (
                  <Field label="Traffic Violations">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{application.trafficViolations}</p>
                  </Field>
                )}
              </Section>

              {/* Resume */}
              {application.resumeUrl && (
                <Section title="Resume">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {application.resumeFileName}
                      </p>
                      {application.resumeFileSize && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {(application.resumeFileSize / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>

                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
                    >
                      View PDF
                    </a>
                  </div>
                </Section>
              )}

              {/* Certification */}
              <Section title="Certification">
                <div className="space-y-2">
                  {[
                    { key: 'agreeToTerms', label: 'Agreed to Terms' },
                    { key: 'certifyInformation', label: 'Certified Information is Accurate' },
                    { key: 'authorizeBackground', label: 'Authorized Background Check' },
                    { key: 'understandActiveStatus', label: 'Understands Active Status Requirements' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${application[key] ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                      >
                        {application[key] && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">{label}</p>
                    </div>
                  ))}
                </div>
                {application.signature && (
                  <Field label="Digital Signature">
                    <p className="text-sm italic text-neutral-900 dark:text-white">{application.signature}</p>
                  </Field>
                )}
              </Section>

              {/* Meta */}
              <Section title="Submission Details">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Application ID">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 break-all">{application.id}</p>
                  </Field>
                  <Field label="Submitted">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {new Date(application.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </Field>
                </div>
              </Section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Helpers
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">{label}</p>
      {children}
    </div>
  )
}
