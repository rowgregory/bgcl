'use client'

import { useState } from 'react'
import { X, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { store, useApplicationSelector, useFormSelector } from '@/app/lib/store/store'
import { setCloseCancelSubscriptionDrawer } from '@/app/lib/store/slices/appSlice'
import { formatDate } from '@/app/lib/utils/date-utils'
import { cancelStripeSubscription } from '@/app/lib/actions/stripe/cancelStripeSubscription'
import { useRouter } from 'next/navigation'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { setIsLoading } from '@/app/lib/store/slices/formSlice'

const cancellationReasons = [
  { value: 'too_expensive', label: 'Too expensive' },
  { value: 'missing_features', label: 'Missing features I need' },
  { value: 'switched_service', label: 'Switched to another service' },
  { value: 'unused', label: 'Not using it enough' },
  { value: 'customer_service', label: 'Customer service issues' },
  { value: 'too_complex', label: 'Too difficult to use' },
  { value: 'low_quality', label: 'Quality not as expected' },
  { value: 'other', label: 'Other reason' }
]

const formatCurrency = (amount: number, currency: string = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount / 100)
}

export default function CancelSubscriptionDrawer() {
  const { cancelSubscriptionDrawer, cancelSubscriptionDetails } = useApplicationSelector()
  const [step, setStep] = useState<'confirm' | 'reason' | 'processing' | 'success'>(
    cancelSubscriptionDrawer ? 'confirm' : 'confirm'
  )
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const { isLoading } = useFormSelector()
  const onClose = () => store.dispatch(setCloseCancelSubscriptionDrawer())
  const router = useRouter()

  const handleClose = () => {
    if (!isLoading) {
      setStep('confirm')
      setSelectedReason('')
      setFeedback('')
      onClose()
    }
  }

  const handleContinueToReason = () => {
    setStep('reason')
  }

  const handleConfirmCancel = async () => {
    try {
      store.dispatch(setIsLoading(true))

      await cancelStripeSubscription(cancelSubscriptionDetails.subscriptionId, selectedReason, feedback)

      router.refresh()
      setStep('confirm')
      setSelectedReason('')
      setFeedback('')
      onClose()
      store.dispatch(showToast({ message: 'Successfully canceled subscription' }))
    } catch {
      store.dispatch(showToast({ message: 'Failed to cancel subscription', type: 'error' }))
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <AnimatePresence>
      {cancelSubscriptionDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-125 dark:bg-neutral-900 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-neutral-800 border-neutral-200">
              <h2 className="text-xl font-bold dark:text-white text-neutral-900">
                {step === 'confirm' && 'Cancel Subscription'}
                {step === 'reason' && 'Help Us Improve'}
                {step === 'processing' && 'Cancelling...'}
                {step === 'success' && 'Cancelled Successfully'}
              </h2>
              {!isLoading && (
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 dark:text-neutral-400 text-neutral-600" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Confirmation */}
              {step === 'confirm' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Are you sure?</h3>
                      <p className="text-sm text-amber-800 dark:text-amber-400">
                        Cancelling your subscription will stop all future donations.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 dark:bg-neutral-800/50 bg-neutral-50 rounded-xl">
                      <p className="text-sm dark:text-neutral-500 text-neutral-600 mb-1">Current Donation</p>
                      <p className="text-2xl font-bold dark:text-white text-neutral-900">
                        {formatCurrency(cancelSubscriptionDetails?.subscriptionAmount)}
                      </p>
                    </div>

                    <div className="p-4 dark:bg-neutral-800/50 bg-neutral-50 rounded-xl">
                      <p className="text-sm dark:text-neutral-500 text-neutral-600 mb-1">Next Billing Date</p>
                      <p className="text-lg font-semibold dark:text-white text-neutral-900">
                        {formatDate(cancelSubscriptionDetails?.nextBillingDate)}
                      </p>
                    </div>

                    <div className="p-4 dark:bg-neutral-800/50 bg-neutral-50 rounded-xl space-y-2">
                      <h4 className="font-semibold dark:text-white text-neutral-900">What happens when you cancel:</h4>
                      <ul className="space-y-2 text-sm dark:text-neutral-400 text-neutral-600">
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>Your subscription will be cancelled immediately</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>No future charges will be made</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>Your recurring donation will stop supporting Boys & Girls Club of Lynn</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>You can always restart your donation anytime</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Reason & Feedback */}
              {step === 'reason' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <p className="text-sm dark:text-neutral-400 text-neutral-600 mb-4">
                      We're sorry to see you go. Please let us know why you're cancelling so we can improve.
                    </p>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold dark:text-neutral-300 text-neutral-700 mb-3">
                        Reason for cancellation *
                      </label>
                      {cancellationReasons.map((reason) => (
                        <label
                          key={reason.value}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedReason === reason.value
                              ? 'border-sky-500 dark:bg-sky-900/20 bg-sky-50'
                              : 'dark:border-neutral-800 border-neutral-200 dark:hover:border-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="reason"
                            value={reason.value}
                            checked={selectedReason === reason.value}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                          />
                          <span className="dark:text-white text-neutral-900 font-medium">{reason.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold dark:text-neutral-300 text-neutral-700 mb-3">
                      Additional feedback (optional)
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us more about your experience..."
                      rows={4}
                      className="w-full px-4 py-3 dark:bg-neutral-800 bg-neutral-50 dark:border-neutral-700 border-neutral-200 border rounded-xl dark:text-white text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Processing */}
              {step === 'processing' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-lg font-semibold dark:text-white text-neutral-900">
                    Cancelling your subscription...
                  </p>
                  <p className="text-sm dark:text-neutral-500 text-neutral-600 mt-2">Please wait a moment</p>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold dark:text-white text-neutral-900 mb-2">Subscription Cancelled</h3>
                  <p className="text-center dark:text-neutral-400 text-neutral-600">
                    Your subscription has been cancelled successfully.
                    <br />
                    Thank you for your past support!
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            {(step === 'confirm' || step === 'reason') && (
              <div className="p-6 border-t dark:border-neutral-800 border-neutral-200 space-y-3">
                {step === 'confirm' && (
                  <>
                    <button
                      onClick={handleContinueToReason}
                      className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Continue to Cancel
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full px-6 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:text-neutral-300 text-neutral-700 font-semibold rounded-lg transition-colors"
                    >
                      Keep Subscription
                    </button>
                  </>
                )}

                {step === 'reason' && (
                  <>
                    <button
                      onClick={handleConfirmCancel}
                      disabled={!selectedReason || isLoading}
                      className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel Subscription'
                      )}
                    </button>
                    <button
                      onClick={() => setStep('confirm')}
                      disabled={isLoading}
                      className="w-full px-6 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:text-neutral-300 text-neutral-700 font-semibold rounded-lg transition-colors"
                    >
                      Go Back
                    </button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
