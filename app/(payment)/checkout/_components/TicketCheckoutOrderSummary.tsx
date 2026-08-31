import { motion } from 'framer-motion'
import { calculateStripeFees } from '@/lib/utils/calculateStripeFees'

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function TicketCheckoutOrderSummary({ items, coverFees }) {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const processingFee = Math.round(calculateStripeFees(totalPrice) * 100) / 100
  const finalTotal = coverFees ? totalPrice + processingFee : totalPrice

  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="lg:col-span-1 order-2 lg:order-1 lg:sticky lg:top-24 self-start"
    >
      <h2 className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">Your order</h2>

      <ul
        role="list"
        className="divide-y divide-neutral-100 dark:divide-neutral-900 border-y border-neutral-200 dark:border-neutral-800 list-none p-0 m-0"
      >
        {items.map((item) => (
          <li key={`${item.eventId}-${item.ticketId}`} className="py-4 flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-neutral-900 dark:text-white truncate">{item.ticketName}</p>

              <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-600 truncate">{item.eventTitle}</p>

              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-600 tabular-nums">
                ×{item.quantity}
                {item.guestCount > 1 && ` · ${item.guestCount * item.quantity} guests`}
              </p>
            </div>

            <p className="text-[15px] font-medium text-neutral-900 dark:text-white shrink-0 tabular-nums">
              {usd(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <dt className="text-sm text-neutral-500 dark:text-neutral-400">Subtotal</dt>
          <dd className="text-sm text-neutral-900 dark:text-white tabular-nums">{usd(totalPrice)}</dd>
        </div>

        {coverFees && (
          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-neutral-500 dark:text-neutral-400">Processing fee</dt>
            <dd className="text-sm text-neutral-900 dark:text-white tabular-nums">{usd(processingFee)}</dd>
          </div>
        )}

        <div className="flex items-baseline justify-between pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800">
          <dt className="text-sm font-medium text-neutral-900 dark:text-white">Total</dt>
          <dd className="text-xl font-semibold text-neutral-900 dark:text-white tabular-nums">{usd(finalTotal)}</dd>
        </div>
      </dl>

      <p className="mt-5 text-xs text-neutral-400 dark:text-neutral-600">
        Payments are secured by Stripe. Your card details never reach our servers.
      </p>
    </motion.aside>
  )
}
