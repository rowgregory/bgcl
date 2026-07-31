import { calculateStripeFees } from '@/lib/utils/calculateStripeFees'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, Ticket, Users } from 'lucide-react'

export function TicketCheckoutOrderSummary({ items, coverFees }) {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const processingFee = Math.round(calculateStripeFees(totalPrice) * 100) / 100
  const finalTotal = coverFees ? totalPrice + processingFee : totalPrice
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-6">
      <h2 className="text-2xl font-bold dark:text-white text-neutral-900">Your Order</h2>

      {/* Items */}
      <ul role="list" className="space-y-3">
        {items.map((item) => (
          <li
            key={`${item.eventId}-${item.ticketId}`}
            className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className="shrink-0 w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center mt-0.5"
                  aria-hidden="true"
                >
                  <Ticket className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{item.ticketName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">{item.eventTitle}</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                    Qty: {item.quantity}
                    {(item.guestCount ?? 1) > 1 && (
                      <>
                        <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">·</span>
                        <Users className="w-3 h-3 inline mb-0.5" aria-hidden="true" />
                        <span className="ml-1">{item.guestCount} guests</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white shrink-0 tabular-nums">
                $
                {(item.price * item.quantity)?.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">Subtotal</span>
          <span className="text-sm font-medium text-neutral-900 dark:text-white tabular-nums">
            ${totalPrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        {coverFees && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Processing Fee
              <span className="ml-1.5 text-[10px] text-neutral-400 dark:text-neutral-600">(optional)</span>
            </span>
            <span className="text-sm font-medium text-neutral-900 dark:text-white tabular-nums">
              ${processingFee?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}
        <div className="pt-3 border-t border-neutral-200 dark:border-zinc-800 flex justify-between items-center">
          <span className="text-sm font-bold text-neutral-900 dark:text-white">Total</span>
          <span
            className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums"
            aria-label={`Total: $${finalTotal.toFixed(2)}`}
          >
            ${finalTotal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
          <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          Secure checkout
        </div>
        <div className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          SSL encrypted
        </div>
      </div>
    </motion.div>
  )
}
