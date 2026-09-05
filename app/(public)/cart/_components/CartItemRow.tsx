import { formatCurrency } from '@/lib/utils/currency.utils'
import { CartItem, useCartStore } from '@/stores/useCartStore'
import { Minus, Plus } from 'lucide-react'

const stepperCls =
  'w-7 h-7 flex items-center justify-center rounded border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'

export const CartItemRow = ({ item }: { item: CartItem }) => {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeFromCart = useCartStore((s) => s.removeFromCart)

  return (
    <article aria-label={`Cart item: ${item.ticketName}`} className="py-5">
      <div className="flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[15px] font-medium text-neutral-900 dark:text-white truncate">{item.ticketName}</h3>
          <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-600 truncate">{item.eventTitle}</p>
        </div>

        <p className="text-[15px] font-medium text-neutral-900 dark:text-white shrink-0 tabular-nums">
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div role="group" aria-label={`Quantity for ${item.ticketName}`} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateQuantity(item.ticketId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
            className={stepperCls}
          >
            <Minus className="w-3 h-3" aria-hidden="true" />
          </button>

          <span
            aria-live="polite"
            aria-atomic="true"
            aria-label={`Quantity: ${item.quantity}`}
            className="w-6 text-center text-sm text-neutral-900 dark:text-white tabular-nums"
          >
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => updateQuantity(item.ticketId, item.quantity + 1)}
            disabled={item.quantity >= item.maxAvailable}
            aria-label="Increase quantity"
            className={stepperCls}
          >
            <Plus className="w-3 h-3" aria-hidden="true" />
          </button>

          <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-600 tabular-nums hidden sm:inline">
            {formatCurrency(item.price)} each
          </span>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(item.ticketId)}
          aria-label={`Remove ${item.ticketName} from cart`}
          className="text-xs font-medium text-neutral-400 dark:text-neutral-600 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded px-1"
        >
          Remove
        </button>
      </div>
    </article>
  )
}
