import { CartItem, useCartStore } from '@/stores/useCartStore'
import Link from 'next/link'

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const CartOrderSummary = ({ items }: { items: CartItem[] }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const clearCart = useCartStore((s) => s.clearCart)

  return (
    <aside aria-label="Order summary" className="lg:col-span-1 lg:sticky lg:top-24 self-start">
      <h2 className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">Summary</h2>

      <dl className="space-y-2">
        <div className="flex items-baseline justify-between">
          <dt className="text-sm text-neutral-500 dark:text-neutral-400">
            {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'}
          </dt>
          <dd className="text-sm text-neutral-900 dark:text-white tabular-nums">{usd(subtotal)}</dd>
        </div>

        <div className="flex items-baseline justify-between pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-800">
          <dt className="text-sm font-medium text-neutral-900 dark:text-white">Total</dt>
          <dd className="text-xl font-semibold text-neutral-900 dark:text-white tabular-nums">{usd(subtotal)}</dd>
        </div>
      </dl>

      <Link
        href="/checkout"
        className="block w-full mt-6 px-5 py-4 text-center text-[15px] font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        Proceed to checkout
      </Link>

      <button
        type="button"
        onClick={clearCart}
        aria-label="Clear all items from cart"
        className="block w-full mt-3 text-xs text-neutral-400 dark:text-neutral-600 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded py-1"
      >
        Clear cart
      </button>

      <p className="mt-6 text-xs text-neutral-400 dark:text-neutral-600">
        Payments are secured by Stripe. Your card details never reach our servers.
      </p>
    </aside>
  )
}
