import { CartItem, clearCart } from '@/app/lib/store/slices/cartSlice'
import { useAppDispatch } from '@/app/lib/store/store'
import { Lock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export const CartOrderSummary = ({ items }: { items: CartItem[] }) => {
  const dispatch = useAppDispatch()

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <aside aria-label="Order summary" className="lg:sticky lg:top-6">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Order Summary</h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5" aria-live="polite" aria-atomic="true">
            {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'}
          </p>
        </div>

        {/* Line items */}
        <ul role="list" aria-label="Order line items" className="list-none p-0 m-0 px-5 sm:px-6 py-4 space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start justify-between gap-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="text-neutral-700 dark:text-neutral-300 font-medium leading-tight truncate">
                  {item.ticketName}
                </p>
                <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-0.5 truncate">{item.eventTitle}</p>
                <p className="text-neutral-400 dark:text-neutral-500 text-xs">× {item.quantity}</p>
              </div>
              <span className="font-semibold text-neutral-900 dark:text-white shrink-0 tabular-nums">
                $
                {(item.price * item.quantity)?.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </li>
          ))}
        </ul>

        {/* Totals + CTA */}
        <div className="px-5 sm:px-6 pb-5 pt-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
            <span className="font-medium text-neutral-900 dark:text-white tabular-nums">
              ${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <span className="text-base font-semibold text-neutral-900 dark:text-white">Total</span>
            <span
              className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums"
              aria-label={`Total: $${subtotal.toFixed(2)}`}
            >
              ${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <Link
            href="/checkout"
            className="inline-block text-center w-full py-3 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-sky-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-offset-white"
          >
            Proceed to Checkout
          </Link>

          <button
            onClick={() => dispatch(clearCart())}
            aria-label="Clear all items from cart"
            className="w-full py-2 text-xs text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-lg"
          >
            Clear cart
          </button>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-4 flex items-center justify-center gap-4">
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
    </aside>
  )
}
