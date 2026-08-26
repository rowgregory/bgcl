'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, Check } from 'lucide-react'
import { sendFailedPaymentEmail } from '@/lib/actions/_infra/sendFailedPaymentEmail'
import { formatDate } from '@/lib/utils/date-utils'
import { useFailedPaymentDrawer } from '@/stores/drawers'
import { useEscapeKey } from '@/lib/hooks/useEscapeKey'
import { useLockBodyScroll } from '@/lib/hooks/useLockBodyScroll'
import { FailedPayment } from '@/types/failed-payment.types'

/** Per-payment feedback after attempting to email the donor. */
type EmailState = Record<string, 'sending' | 'sent' | 'error'>

const dtCls = 'text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600'
const ddCls = 'text-[13px] text-neutral-900 dark:text-white'

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
  const total = payments.reduce((sum, p) => sum + Number(p.totalAmount ?? 0), 0)

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
            className="fixed inset-0 bg-black/40 z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Failed payments"
            className="fixed right-0 top-0 h-full w-full sm:w-150 bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col"
          >
            <div className="shrink-0 h-11 flex items-center justify-between gap-4 px-5 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-baseline gap-2.5 min-w-0">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Failed payments</h2>
                {payments.length > 0 && (
                  <span className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums truncate">
                    {payments.length} · ${total.toFixed(2)} uncollected
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {payments.length === 0 ? (
                <p className="text-sm text-neutral-400 dark:text-neutral-600 text-center py-16">
                  No failed payments right now.
                </p>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {payments.map((payment) => {
                    const state = emailState[payment.id]

                    return (
                      <div key={payment.id} className="py-5 first:pt-0 space-y-4">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-2xl font-semibold text-neutral-900 dark:text-white tabular-nums">
                              ${Number(payment.totalAmount ?? 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-0.5 capitalize">
                              {payment.type?.replace(/_/g, ' ').toLowerCase()}
                            </p>
                          </div>

                          <span className="inline-flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" aria-hidden="true" />
                            Failed
                          </span>
                        </div>

                        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 items-baseline">
                          <dt className={dtCls}>Donor</dt>
                          <dd className={`${ddCls} truncate`}>{payment.customerName}</dd>

                          <dt className={dtCls}>Email</dt>
                          <dd className="min-w-0">
                            <a
                              href={`mailto:${payment.customerEmail}`}
                              className="text-[13px] text-sky-600 dark:text-sky-400 hover:underline truncate block"
                            >
                              {payment.customerEmail}
                            </a>
                          </dd>

                          <dt className={dtCls}>Attempted</dt>
                          <dd className={`${ddCls} tabular-nums`}>{formatDate(new Date(payment.createdAt))}</dd>

                          {payment.paymentMethod && (
                            <>
                              <dt className={dtCls}>Method</dt>
                              <dd className={`${ddCls} capitalize`}>{payment.paymentMethod}</dd>
                            </>
                          )}

                          {Number(payment.feesCovered) > 0 && (
                            <>
                              <dt className={dtCls}>Fees</dt>
                              <dd className={`${ddCls} tabular-nums`}>
                                ${Number(payment.feesCovered).toFixed(2)} attempted
                              </dd>
                            </>
                          )}

                          {payment.paymentIntentId && (
                            <>
                              <dt className={dtCls}>Intent</dt>
                              <dd className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600 truncate">
                                {payment.paymentIntentId}
                              </dd>
                            </>
                          )}
                        </dl>

                        {payment.notes && (
                          <p className="text-[13px] text-neutral-500 dark:text-neutral-400">{payment.notes}</p>
                        )}

                        {state === 'sent' && (
                          <p
                            role="status"
                            className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400"
                          >
                            <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            Email sent to {payment.customerEmail}
                          </p>
                        )}

                        {state === 'error' && (
                          <p role="alert" className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            Could not send the email. Try again.
                          </p>
                        )}

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleContactDonor(payment)}
                            disabled={state === 'sending'}
                            className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
                          >
                            {state === 'sending' ? 'Sending…' : state === 'sent' ? 'Resend email' : 'Contact donor'}
                          </button>

                          {payment.paymentIntentId && (
                            <button
                              onClick={() => openStripePayment(payment.paymentIntentId!)}
                              className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
                            >
                              View in Stripe
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
