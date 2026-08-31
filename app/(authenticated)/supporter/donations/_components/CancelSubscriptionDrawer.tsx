'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils/date-utils'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { cancelStripeSubscription } from '@/lib/actions/stripe/cancelStripeSubscription'
import { useCancelSubscriptionDrawer } from '@/stores/drawers'

const CANCELLATION_REASONS = [
  { value: 'too_expensive', label: 'Too expensive' },
  { value: 'unused', label: 'Not the right time' },
  { value: 'switched_service', label: 'Giving somewhere else' },
  { value: 'customer_service', label: 'Problem with the club' },
  { value: 'other', label: 'Another reason' }
] as const

const dtCls = 'text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600'
const ddCls = 'text-[13px] text-neutral-900 dark:text-white'
const actionCls =
  'text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1'

type Step = 'confirm' | 'reason' | 'processing' | 'success'

const TITLES: Record<Step, string> = {
  confirm: 'Cancel your donation',
  reason: 'Before you go',
  processing: 'Cancelling',
  success: 'Cancelled'
}

export default function CancelSubscriptionDrawer() {
  const open = useCancelSubscriptionDrawer((s) => s.isOpen)
  const details = useCancelSubscriptionDrawer((s) => s.data)
  const onClose = useCancelSubscriptionDrawer((s) => s.close)

  const router = useRouter()

  const [step, setStep] = useState<Step>('confirm')
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const isProcessing = step === 'processing'

  const reset = () => {
    setStep('confirm')
    setReason('')
    setFeedback('')
    setErrorMsg('')
  }

  const handleClose = () => {
    if (isProcessing) return
    reset()
    onClose()
  }

  // Closing from the success step refreshes so the list reflects the change
  const handleDone = () => {
    reset()
    onClose()
    router.refresh()
  }

  const handleConfirm = async () => {
    setErrorMsg('')
    setStep('processing')

    try {
      const result = await cancelStripeSubscription(details.subscriptionId, reason, feedback)

      if (!result?.success) {
        setStep('reason')
        setErrorMsg(result?.error ?? 'We could not cancel your donation. Please try again.')
        return
      }

      setStep('success')
    } catch {
      setStep('reason')
      setErrorMsg('We could not cancel your donation. Please try again, or contact us if it keeps happening.')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === 'success' ? handleDone : handleClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/40 z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Cancel donation"
            className="fixed right-0 top-0 h-full w-full sm:w-125 bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col"
          >
            <div className="shrink-0 h-11 flex items-center justify-between gap-4 px-5 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">{TITLES[step]}</h2>

              {!isProcessing && (
                <button
                  type="button"
                  onClick={step === 'success' ? handleDone : handleClose}
                  aria-label="Close"
                  className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              {step === 'confirm' && (
                <div className="space-y-6">
                  <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 items-baseline">
                    <dt className={dtCls}>Amount</dt>
                    <dd className={`${ddCls} tabular-nums`}>
                      {formatCurrency((details?.subscriptionAmount ?? 0) / 100)}
                    </dd>

                    {details?.nextBillingDate && (
                      <>
                        <dt className={dtCls}>Next charge</dt>
                        <dd className={`${ddCls} tabular-nums`}>{formatDate(new Date(details.nextBillingDate))}</dd>
                      </>
                    )}
                  </dl>

                  <div className="space-y-2 text-[13px] text-neutral-500 dark:text-neutral-400">
                    <p>Cancelling stops all future charges. Nothing you have already given is affected.</p>
                    <p>You can start a new donation any time.</p>
                  </div>
                </div>
              )}

              {step === 'reason' && (
                <div className="space-y-6">
                  {errorMsg && (
                    <p role="alert" className="text-[13px] text-red-600 dark:text-red-400">
                      {errorMsg}
                    </p>
                  )}

                  <fieldset>
                    <legend className={`${dtCls} mb-3`}>Why are you cancelling?</legend>

                    <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
                      {CANCELLATION_REASONS.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 py-2.5 cursor-pointer text-[13px] text-neutral-900 dark:text-white"
                        >
                          <input
                            type="radio"
                            name="reason"
                            value={option.value}
                            checked={reason === option.value}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-3.5 h-3.5 accent-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="cancel-feedback" className={`${dtCls} block mb-1.5`}>
                      Anything else? (optional)
                    </label>

                    <textarea
                      id="cancel-feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us more"
                      rows={3}
                      className="w-full px-2.5 py-2 text-[13px] bg-transparent border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 'processing' && (
                <p role="status" aria-live="polite" className="text-[13px] text-neutral-500 dark:text-neutral-400 py-8">
                  Cancelling your donation…
                </p>
              )}

              {step === 'success' && (
                <div role="status" aria-live="polite" className="py-8 space-y-2">
                  <p className="text-[15px] font-medium text-neutral-900 dark:text-white">
                    Your donation has been cancelled.
                  </p>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                    Thank you for the support you have given.
                  </p>
                </div>
              )}
            </div>

            {!isProcessing && (
              <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 px-5 py-3 flex items-center justify-end gap-4">
                {step === 'confirm' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStep('reason')}
                      className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-red-600 dark:hover:text-red-400`}
                    >
                      Continue
                    </button>

                    <button
                      type="button"
                      onClick={handleClose}
                      className={`${actionCls} text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300`}
                    >
                      Keep my donation
                    </button>
                  </>
                )}

                {step === 'reason' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStep('confirm')}
                      className={`${actionCls} text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white`}
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={!reason}
                      className={`${actionCls} text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300`}
                    >
                      Cancel my donation
                    </button>
                  </>
                )}

                {step === 'success' && (
                  <button
                    type="button"
                    onClick={handleDone}
                    className={`${actionCls} text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300`}
                  >
                    Done
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
