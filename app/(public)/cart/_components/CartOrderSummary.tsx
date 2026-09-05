'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { CartItem, useCartStore } from '@/stores/useCartStore'

export const CartOrderSummary = ({ items }: { items: CartItem[] }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [hasClicked, setHasClicked] = useState(false)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const clearCart = useCartStore((s) => s.clearCart)

  // The checkout page loads saved cards and user details on the server, so the
  // click can sit for a beat before anything moves
  const isNavigating = hasClicked || isPending

  const goToCheckout = () => {
    setHasClicked(true)
    startTransition(() => router.push('/checkout'))
  }

  return (
    <aside aria-label="Order summary" className="lg:col-span-1 lg:sticky lg:top-24 self-start">
      <h2 className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">Summary</h2>

      <dl className="space-y-2">
        <div className="flex items-baseline justify-between">
          <dt className="text-sm text-neutral-500 dark:text-neutral-400">
            {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'}
          </dt>
          <dd className="text-sm text-neutral-900 dark:text-white tabular-nums">{formatCurrency(subtotal)}</dd>
        </div>

        <div className="flex items-baseline justify-between pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800">
          <dt className="text-sm font-medium text-neutral-900 dark:text-white">Total</dt>
          <dd className="text-xl font-semibold text-neutral-900 dark:text-white tabular-nums">{formatCurrency(subtotal)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={goToCheckout}
        disabled={isNavigating || itemCount === 0}
        aria-busy={isNavigating}
        className="flex items-center justify-center gap-2 w-full mt-6 px-5 py-4 text-center text-[15px] font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer sm:px-5 lg:px-8 sm:py-3 lg:py-4 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 sm:rounded-xl shadow-lg shadow-sky-500/25 whitespace-nowrap focus-visible:ring-offset-2 focus-visible:ring-offset-sky-600 text-xs sm:text-sm"
      >
        {isNavigating && <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />}
        {isNavigating ? 'Loading checkout' : 'Proceed to checkout'}
      </button>

      <button
        type="button"
        onClick={clearCart}
        disabled={isNavigating}
        aria-label="Clear all items from cart"
        className="block w-full mt-3 text-xs text-neutral-400 dark:text-neutral-600 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded py-1"
      >
        Clear cart
      </button>

      <p className="mt-6 text-xs text-neutral-400 dark:text-neutral-600">
        Payments are secured by Stripe. Your card details never reach our servers.
      </p>
    </aside>
  )
}
