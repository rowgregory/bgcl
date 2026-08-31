'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils/date-utils'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { getMySubscriptionSummary } from '@/lib/actions/stripe/getMySubscriptionSummary'
import { useCancelSubscriptionDrawer } from '@/stores/drawers'
import { sentenceCase } from '@/lib/utils/sentenceCase'
import { getMyDonationReceipt } from '@/lib/actions/user/getMyDonationReceipt'

const itemVariants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }

const STATUS_DOT: Record<string, string> = {
  CONFIRMED: 'bg-emerald-500',
  PENDING: 'bg-amber-500',
  FAILED: 'bg-red-500',
  CANCELLED: 'bg-neutral-300 dark:bg-neutral-700'
}

const dtCls = 'text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600'
const ddCls = 'text-[13px] text-neutral-900 dark:text-white'

export const SupporterDonationRow = ({ donation }) => {
  const [expanded, setExpanded] = useState(false)
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const openCancel = useCancelSubscriptionDrawer((s) => s.open)

  const isRecurring = donation.type === 'RECURRING_DONATION'
  const cycleCount = donation.cycleCount ?? 1
  const lifetime = donation.lifetimeAmount ?? donation.totalAmount
  const cadence = donation.recurringFrequency === 'yearly' ? 'yr' : 'mo'
  const [receiptLoading, setReceiptLoading] = useState(false)

  const statusLabel = donation.subscriptionCanceledAt
    ? `Ended ${formatDate(donation.subscriptionCanceledAt)}`
    : donation.subscriptionCancelsAt
      ? `Ends ${formatDate(donation.subscriptionCancelsAt)}`
      : sentenceCase(donation.status)

  const statusColor = donation.subscriptionCanceledAt
    ? 'bg-neutral-300 dark:bg-neutral-700'
    : donation.subscriptionCancelsAt
      ? 'bg-amber-500'
      : (STATUS_DOT[donation.status] ?? 'bg-neutral-300')

  const openReceipt = async () => {
    setReceiptLoading(true)
    setError('')

    const result = await getMyDonationReceipt(donation.id)

    setReceiptLoading(false)

    if (!result.success || !result.data) {
      setError(result.error ?? 'Receipt not available')
      return
    }

    window.open(result.data.url, '_blank', 'noopener,noreferrer')
  }

  const toggle = async () => {
    const next = !expanded
    setExpanded(next)

    if (!next || summary || !donation.stripeSubscriptionId) return

    setLoading(true)
    setError('')

    const result = await getMySubscriptionSummary(donation.stripeSubscriptionId)

    setLoading(false)

    if (!result.success) {
      setError(result.error ?? 'Could not load details')
      return
    }

    setSummary(result.data)
  }

  return (
    <motion.li variants={itemVariants} className="py-4">
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-base font-semibold text-neutral-900 dark:text-white tabular-nums">
              {formatCurrency(lifetime)}
            </p>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
              {isRecurring
                ? `${formatCurrency(donation.totalAmount)}/${cadence} · ${cycleCount} ${cycleCount === 1 ? 'payment' : 'payments'}`
                : 'One-time'}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-neutral-400 dark:text-neutral-600">
            <span className="inline-flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColor}`} aria-hidden="true" />
              {statusLabel}
            </span>

            <span aria-hidden="true">·</span>

            <time
              dateTime={new Date(donation.firstPaidAt ?? donation.createdAt).toISOString()}
              className="tabular-nums"
            >
              {isRecurring ? 'since ' : ''}
              {formatDate(donation.firstPaidAt ?? donation.createdAt)}
            </time>

            {donation.campaign && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-40">{donation.campaign.name}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {isRecurring && donation.stripeSubscriptionId ? (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={expanded}
              className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
            >
              {expanded ? 'Hide' : 'Manage'}
            </button>
          ) : (
            <button
              type="button"
              onClick={openReceipt}
              disabled={receiptLoading}
              className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
            >
              {receiptLoading ? 'Opening…' : 'Receipt'}
            </button>
          )}
        </div>
      </div>

      {!expanded && error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}

      {expanded && (
        <div className="mt-5 pl-4 border-l border-neutral-200 dark:border-neutral-800 space-y-6">
          {loading && <p className="text-xs text-neutral-400 dark:text-neutral-600">Loading details…</p>}

          {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

          {summary && (
            <>
              {summary.willCancelAtPeriodEnd && (
                <p className="text-[13px] text-amber-600 dark:text-amber-400">
                  Ends {formatDate(summary.currentPeriodEnd)}. You can restart any time before then.
                </p>
              )}

              {summary.isPastDue && (
                <p className="text-[13px] text-red-600 dark:text-red-400">
                  The last payment did not go through. Update your card to keep this going.
                </p>
              )}

              <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 items-baseline">
                {!summary.isCancelled && summary.currentPeriodEnd && (
                  <>
                    <dt className={dtCls}>{summary.willCancelAtPeriodEnd ? 'Ends' : 'Next charge'}</dt>
                    <dd className={`${ddCls} tabular-nums`}>
                      {formatCurrency(summary.amount ?? donation.totalAmount)} on {formatDate(summary.currentPeriodEnd)}
                    </dd>
                  </>
                )}

                {summary.card && (
                  <>
                    <dt className={dtCls}>Card</dt>
                    <dd className={`${ddCls} capitalize tabular-nums`}>
                      {summary.card.brand} ending {summary.card.last4}
                    </dd>
                  </>
                )}

                {summary.startedAt && (
                  <>
                    <dt className={dtCls}>Started</dt>
                    <dd className={`${ddCls} tabular-nums`}>{formatDate(summary.startedAt)}</dd>
                  </>
                )}
              </dl>

              <div className="flex items-center gap-4">
                {!summary.isCancelled && !summary.willCancelAtPeriodEnd && (
                  <button
                    type="button"
                    onClick={() =>
                      openCancel({
                        subscriptionAmount: (summary.amount ?? donation.totalAmount) * 100,
                        nextBillingDate: summary.currentPeriodEnd,
                        subscriptionId: donation.stripeSubscriptionId
                      })
                    }
                    className="ml-auto text-xs font-medium text-neutral-400 dark:text-neutral-600 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    Cancel donation
                  </button>
                )}
              </div>
            </>
          )}

          {summary?.invoices?.length > 0 && (
            <div>
              <p className={`${dtCls} mb-2`}>Payment history</p>

              <table className="w-full text-[13px]">
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {summary.invoices.map((invoice: any) => (
                    <tr key={invoice.id}>
                      <td className="py-2 pr-4 text-neutral-500 dark:text-neutral-400 tabular-nums whitespace-nowrap">
                        {formatDate(invoice.created)}
                      </td>

                      <td className="py-2 pr-4 text-xs text-neutral-400 dark:text-neutral-600 font-mono whitespace-nowrap">
                        {invoice.number}
                      </td>

                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-600">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              invoice.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            aria-hidden="true"
                          />
                          {sentenceCase(invoice.status)}
                        </span>
                      </td>

                      <td
                        className={`py-2 pr-4 text-right tabular-nums ${
                          invoice.status === 'paid'
                            ? 'text-neutral-900 dark:text-white'
                            : 'text-neutral-400 dark:text-neutral-600'
                        }`}
                      >
                        {formatCurrency(invoice.amountPaid)}
                      </td>

                      <td className="py-2 text-right whitespace-nowrap">
                        {invoice.pdfUrl && (
                          <a
                            href={invoice.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                          >
                            Invoice
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </motion.li>
  )
}
