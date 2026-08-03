'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, CreditCard, Mail, User, Calendar, DollarSign, Check } from 'lucide-react'
import { sendFailedPaymentEmail } from '@/lib/actions/_infra/sendFailedPaymentEmail'
import { formatDate } from '@/lib/utils/date-utils'
import { useFailedPaymentDrawer } from '@/stores/drawers'
import { useEscapeKey } from '@/lib/hooks/useEscapeKey'
import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll'
import { FailedPayment } from '@/types/failed-payment.types'

/** Per-payment feedback after attempting to email the donor. */
type EmailState = Record<string, 'sending' | 'sent' | 'error'>

export function FailedPaymentsDrawer() {
  const isOpen = useFailedPaymentDrawer((s) => s.isOpen)
  const failedPayments = useFailedPaymentDrawer((s) => s.data)
  const onClose = useFailedPaymentDrawer((s) => s.close)

  const [emailState, setEmailState] = useState<EmailState>({})

  useEscapeKey(onClose, isOpen)
  useLockBodyScroll(isOpen)

  const openStripePayment = (paymentIntentId: string) => {
    const isTestMode =
      process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('_test_')
    const stripeAccountId = process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID
    const mode = isTestMode ? 'test' : 'live'

    window.open(`https://dashboard.stripe.com/${stripeAccountId}/${mode}/payments/${paymentIntentId}`, '_blank')
  }

  const handleContactDonor = async (payment: FailedPayment) => {
    setEmailState((s) => ({ ...s, [payment.id]: 'sending' }))

    try {
      const result = await sendFailedPaymentEmail(payment.customerName, payment.customerEmail, payment.totalAmount)
      setEmailState((s) => ({ ...s, [payment.id]: result.success ? 'sent' : 'error' }))
    } catch {
      setEmailState((s) => ({ ...s, [payment.id]: 'error' }))
    }
  }

  const payments = failedPayments ?? []

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Failed payments"
            className="fixed right-0 top-0 h-full w-full sm:w-150 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Failed Payments</h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {payments.length} payment{payments.length !== 1 ? 's' : ''} failed
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
              </button>
            </div>

            {/* Failed Payments List */}
            <div className="p-6 space-y-4">
              {payments.length === 0 && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center py-8">No failed payments.</p>
              )}

              {payments.map((payment) => {
                const state = emailState[payment.id]

                return (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4"
                  >
                    {/* Amount & Status */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                          ${payment.totalAmount?.toFixed(2)}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wide font-semibold mt-1">
                          {payment.type?.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                        FAILED
                      </span>
                    </div>

                    {/* Customer Details */}
                    <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                        <span className="text-sm text-neutral-900 dark:text-white font-medium">
                          {payment.customerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                        <a
                          href={`mailto:${payment.customerEmail}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {payment.customerEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(new Date(payment.createdAt))}
                        </span>
                      </div>
                      {payment.paymentMethod && (
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                            {payment.paymentMethod}
                          </span>
                        </div>
                      )}
                      {Number(payment.feesCovered) > 0 && (
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Attempted to cover ${payment.feesCovered?.toFixed(2)} in fees
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Payment Intent ID */}
                    {payment.paymentIntentId && (
                      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 font-mono">
                          {payment.paymentIntentId}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {payment.notes && (
                      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{payment.notes}</p>
                      </div>
                    )}

                    {/* Inline email feedback (replaces toasts) */}
                    {state === 'sent' && (
                      <p
                        role="status"
                        className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400"
                      >
                        <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                        Email sent to {payment.customerEmail}
                      </p>
                    )}
                    {state === 'error' && (
                      <p role="alert" className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                        Failed to send email. Please try again.
                      </p>
                    )}

                    {/* Actions */}
                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700 flex gap-2">
                      <button
                        onClick={() => handleContactDonor(payment)}
                        disabled={state === 'sending'}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        {state === 'sending' ? 'Sending…' : state === 'sent' ? 'Resend Email' : 'Contact Donor'}
                      </button>
                      {payment.paymentIntentId && (
                        <button
                          onClick={() => openStripePayment(payment.paymentIntentId!)}
                          className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white text-sm font-semibold rounded-lg transition-colors"
                        >
                          View in Stripe
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
