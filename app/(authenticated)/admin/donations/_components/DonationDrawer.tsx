'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils/date-utils'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { useDonationDrawer } from '@/stores/drawers'

const normalizeFees = (raw: any) => {
  const n = Number(raw ?? 0)
  return Number.isInteger(n) ? n / 100 : n
}

const STATUS_DOT: Record<string, string> = {
  CONFIRMED: 'bg-emerald-500',
  PENDING: 'bg-amber-500',
  FAILED: 'bg-red-500',
  CANCELLED: 'bg-neutral-300 dark:bg-neutral-700',
  REFUNDED: 'bg-neutral-300 dark:bg-neutral-700'
}

const sentenceCase = (v?: string | null) => (v ? v.charAt(0) + v.slice(1).toLowerCase() : '—')

const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-600'
const dtCls = 'text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600'
const ddCls = 'text-[13px] text-neutral-900 dark:text-white'

export function DonationDrawer() {
  const onClose = useDonationDrawer((s) => s.close)
  const isOpen = useDonationDrawer((s) => s.isOpen)
  const donation = useDonationDrawer((s) => s.data)

  if (!donation) return null

  const isRecurring = donation.type === 'RECURRING_DONATION'
  const isCancelled = donation.status === 'CANCELLED'
  const isFailed = donation.status === 'FAILED'

  const cycles = donation.cycles ?? []
  const cycleCount = donation.cycleCount ?? (donation.status === 'CONFIRMED' ? 1 : 0)
  const collected = donation.lifetimeAmount ?? (donation.status === 'CONFIRMED' ? donation.totalAmount : 0)
  const failedCycles = cycles.filter((c: any) => c.status === 'FAILED').length
  const perCycle = donation.totalAmount ?? 0
  const cadence = donation.recurringFrequency === 'yearly' ? 'yr' : 'mo'

  const openStripe = (path: string, id: string) => {
    const mode = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('_test_') ? 'test' : 'live'
    const account = process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_ID
    window.open(`https://dashboard.stripe.com/${account}/${mode}/${path}/${id}`, '_blank')
  }

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
            aria-label="Donation details"
            className="fixed right-0 top-0 h-full w-full sm:w-150 bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col"
          >
            <div className="shrink-0 h-11 flex items-center justify-between gap-4 px-5 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-baseline gap-2.5 min-w-0">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {donation.customerName ?? 'Donation'}
                </h2>
                <span className="text-xs text-neutral-400 dark:text-neutral-600 truncate">
                  {isRecurring ? `${sentenceCase(donation.recurringFrequency)} donor` : 'One-time donor'}
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

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
              <section>
                <p className={labelCls}>{isRecurring ? 'Total collected' : 'Donation amount'}</p>

                <p
                  className={`mt-2 text-4xl font-semibold tracking-tight tabular-nums ${
                    isFailed || isCancelled
                      ? 'text-neutral-400 dark:text-neutral-600'
                      : 'text-neutral-900 dark:text-white'
                  }`}
                >
                  {formatCurrency(collected)}
                </p>

                {isRecurring && (
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 tabular-nums">
                    {formatCurrency(perCycle)}/{cadence} · {cycleCount} {cycleCount === 1 ? 'payment' : 'payments'}
                    {failedCycles > 0 && (
                      <span className="text-red-600 dark:text-red-400"> · {failedCycles} failed</span>
                    )}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[donation.status] ?? 'bg-neutral-300'}`}
                      aria-hidden="true"
                    />
                    {sentenceCase(donation.status)}
                  </span>

                  {donation.coverFees && !isCancelled && !isFailed && (
                    <span className="text-neutral-400 dark:text-neutral-600 tabular-nums">
                      covered ${normalizeFees(donation.feesCovered).toFixed(2)} in fees
                    </span>
                  )}
                </div>

                {isFailed && donation.failureReason && (
                  <p className="mt-3 text-[13px] text-red-600 dark:text-red-400">
                    {donation.failureReason}
                    {donation.failureCode && (
                      <span className="text-neutral-400 dark:text-neutral-600 font-mono">
                        {' '}
                        ({donation.failureCode})
                      </span>
                    )}
                  </p>
                )}

                {isCancelled && (
                  <p className="mt-3 text-[13px] text-neutral-500 dark:text-neutral-400">
                    Cancelled. No further charges will be made.
                  </p>
                )}
              </section>

              {isRecurring && cycles.length > 0 && (
                <section>
                  <div className="flex items-baseline justify-between mb-3">
                    <p className={labelCls}>Payment history</p>
                    {donation.firstPaidAt && (
                      <span className="text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                        since {formatDate(new Date(donation.firstPaidAt))}
                      </span>
                    )}
                  </div>

                  <table className="w-full text-[13px]">
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                      {cycles.map((cycle: any) => (
                        <tr key={cycle.id}>
                          <td className="py-2 pr-4 text-neutral-500 dark:text-neutral-400 tabular-nums whitespace-nowrap">
                            {formatDate(new Date(cycle.paidAt ?? cycle.createdAt))}
                          </td>

                          <td className="py-2 pr-4">
                            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[cycle.status] ?? 'bg-neutral-300'}`}
                                aria-hidden="true"
                              />
                              {sentenceCase(cycle.status)}
                            </span>
                          </td>

                          <td
                            className={`py-2 text-right tabular-nums ${
                              cycle.status === 'CONFIRMED'
                                ? 'text-neutral-900 dark:text-white'
                                : 'text-neutral-400 dark:text-neutral-600 line-through'
                            }`}
                          >
                            {formatCurrency(cycle.totalAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot>
                      <tr className="border-t border-neutral-200 dark:border-neutral-800">
                        <td colSpan={2} className="py-2.5 text-neutral-500 dark:text-neutral-400">
                          Collected
                        </td>
                        <td className="py-2.5 text-right font-medium text-neutral-900 dark:text-white tabular-nums">
                          {formatCurrency(collected)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  {donation.nextBillingDate && !isCancelled && !isFailed && (
                    <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                      Next charge of {formatCurrency(perCycle)} on {formatDate(new Date(donation.nextBillingDate))}
                    </p>
                  )}
                </section>
              )}

              <section>
                <p className={`${labelCls} mb-3`}>Donor</p>

                <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 items-baseline">
                  <dt className={dtCls}>Name</dt>
                  <dd className={`${ddCls} truncate`}>{donation.customerName ?? '—'}</dd>

                  <dt className={dtCls}>Email</dt>
                  <dd className="min-w-0">
                    <a
                      href={`mailto:${donation.customerEmail}`}
                      className="text-[13px] text-sky-600 dark:text-sky-400 hover:underline truncate block"
                    >
                      {donation.customerEmail}
                    </a>
                  </dd>

                  {donation.customerPhone && (
                    <>
                      <dt className={dtCls}>Phone</dt>
                      <dd>
                        <a
                          href={`tel:${donation.customerPhone}`}
                          className="text-[13px] text-sky-600 dark:text-sky-400 hover:underline"
                        >
                          {donation.customerPhone}
                        </a>
                      </dd>
                    </>
                  )}

                  {donation.campaign && (
                    <>
                      <dt className={dtCls}>Campaign</dt>
                      <dd className={`${ddCls} truncate`}>{donation.campaign.name}</dd>
                    </>
                  )}

                  {donation.paymentMethod && (
                    <>
                      <dt className={dtCls}>Method</dt>
                      <dd className={`${ddCls} capitalize`}>{donation.paymentMethod}</dd>
                    </>
                  )}

                  {donation.billingAddress && (
                    <>
                      <dt className={dtCls}>Address</dt>
                      <dd className={ddCls}>
                        {[
                          donation.billingAddress.addressLine1,
                          donation.billingAddress.addressLine2,
                          [
                            donation.billingAddress.city,
                            donation.billingAddress.state,
                            donation.billingAddress.zipPostalCode
                          ]
                            .filter(Boolean)
                            .join(', ')
                        ]
                          .filter(Boolean)
                          .map((line, i) => (
                            <span key={i} className="block">
                              {line}
                            </span>
                          ))}
                      </dd>
                    </>
                  )}
                </dl>
              </section>

              {donation.notes && (
                <section>
                  <p className={`${labelCls} mb-2`}>Notes</p>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{donation.notes}</p>
                </section>
              )}

              <section className="flex items-center gap-4 pt-2">
                {donation.stripeSubscriptionId && (
                  <button
                    onClick={() => openStripe('subscriptions', donation.stripeSubscriptionId!)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                  >
                    Subscription in Stripe
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </button>
                )}

                {donation.paymentIntentId && (
                  <button
                    onClick={() => openStripe('payments', donation.paymentIntentId!)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Latest payment in Stripe
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </button>
                )}
              </section>

              <details className="text-xs pt-2 border-t border-neutral-100 dark:border-neutral-900">
                <summary className="cursor-pointer text-neutral-400 dark:text-neutral-600 py-2">
                  Technical details
                </summary>
                <div className="space-y-1 font-mono text-[11px] text-neutral-400 dark:text-neutral-600 pb-2">
                  <p>Order: {donation.id}</p>
                  {donation.stripeSubscriptionId && <p>Subscription: {donation.stripeSubscriptionId}</p>}
                  {donation.paymentIntentId && <p>Intent: {donation.paymentIntentId}</p>}
                  {donation.userId && <p>User: {donation.userId}</p>}
                </div>
              </details>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
