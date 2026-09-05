'use client'

import { formatDate } from '@/lib/utils/date-utils'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { useDonationDrawer } from '@/stores/drawers'
import { DonationWithRelations } from '../../_types/donation.types'

const STATUS_DOT: Record<string, string> = {
  CONFIRMED: 'bg-emerald-500',
  PENDING: 'bg-amber-500',
  FAILED: 'bg-red-500',
  CANCELLED: 'bg-neutral-300 dark:bg-neutral-700',
  REFUNDED: 'bg-neutral-300 dark:bg-neutral-700'
}

// A subscription's own state, which is not the same as whether its last charge
// collected. Cancelling leaves every historic cycle CONFIRMED.
const SUBSCRIPTION_DOT: Record<string, string> = {
  ACTIVE: 'bg-emerald-500',
  CANCELLING: 'bg-amber-500',
  CANCELLED: 'bg-neutral-300 dark:bg-neutral-700'
}

const SUBSCRIPTION_LABEL: Record<string, string> = {
  ACTIVE: 'Active',
  CANCELLING: 'Ending',
  CANCELLED: 'Cancelled'
}

const sentenceCase = (value?: string | null) => (value ? value.charAt(0) + value.slice(1).toLowerCase() : '—')

export default function DonationsTransactionOrderRow({ order }: { order: DonationWithRelations }) {
  const open = useDonationDrawer((s) => s.open)

  const isRecurring = order?.type === 'RECURRING_DONATION'
  const state = order?.subscriptionState

  // Dim a row only when nothing more is coming: a cancelled subscription, or a
  // one-time donation that never collected
  const isDone = state === 'CANCELLED' || (!isRecurring && order?.status === 'CANCELLED')

  const cycleCount = order?.cycleCount ?? 1
  const collected = order?.lifetimeAmount ?? order?.totalAmount ?? 0

  const dot = state ? SUBSCRIPTION_DOT[state] : STATUS_DOT[order?.status]
  const label = state ? SUBSCRIPTION_LABEL[state] : sentenceCase(order?.status)

  return (
    <tr
      onClick={() => open(order)}
      className={`cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50 ${
        isDone ? 'opacity-50' : ''
      }`}
    >
      <td className="py-3 pr-4 text-neutral-900 dark:text-white max-w-40 truncate">{order?.customerName ?? '—'}</td>

      <td className="py-3 pr-4 max-w-48">
        {order?.customerEmail ? (
          <a
            href={`mailto:${order.customerEmail}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sky-600 dark:text-sky-400 hover:underline truncate block"
          >
            {order.customerEmail}
          </a>
        ) : (
          <span className="text-neutral-400 dark:text-neutral-600">—</span>
        )}
      </td>

      <td className="py-3 pr-4 text-neutral-500 dark:text-neutral-400 max-w-36 truncate">{order?.campaign?.name ?? '—'}</td>

      <td className="py-3 pr-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400">
        {isRecurring ? (
          <>
            <span className="capitalize">{order?.recurringFrequency ?? 'Recurring'}</span>
            {cycleCount > 1 && (
              <span className="text-neutral-400 dark:text-neutral-600 tabular-nums"> · {cycleCount} payments</span>
            )}
          </>
        ) : (
          'One-time'
        )}
      </td>

      <td className="py-3 pr-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400 tabular-nums">
        {formatDate(order?.paidAt || order?.createdAt)}
      </td>

      <td className="py-3 pr-4 whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot ?? 'bg-neutral-300'}`} aria-hidden="true" />
          {label}
        </span>

        {state === 'CANCELLING' && order?.subscriptionCancelsAt && (
          <span className="block text-[11px] text-neutral-400 dark:text-neutral-600 tabular-nums">
            through {formatDate(order.subscriptionCancelsAt)}
          </span>
        )}
      </td>

      <td
        className={`py-3 pr-4 text-right whitespace-nowrap tabular-nums ${
          isDone ? 'text-neutral-400 line-through' : 'text-neutral-500 dark:text-neutral-400'
        }`}
      >
        {formatCurrency(order?.totalAmount ?? 0)}
        {isRecurring && (
          <span className="text-neutral-400 dark:text-neutral-600">/{order?.recurringFrequency === 'yearly' ? 'yr' : 'mo'}</span>
        )}
      </td>

      <td className="py-3 text-right whitespace-nowrap font-medium text-neutral-900 dark:text-white tabular-nums">
        {formatCurrency(collected)}
      </td>
    </tr>
  )
}
