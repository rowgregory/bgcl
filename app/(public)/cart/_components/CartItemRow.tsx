import { CartItem, useCartStore } from '@/stores/useCartStore'
import { motion } from 'framer-motion'
import { Minus, Plus, Ticket, Trash2 } from 'lucide-react'

export const CartItemRow = ({ item, index }: { item: CartItem; index: number }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.06 }}
      aria-label={`Cart item: ${item.ticketName}`}
      className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-sky-200 dark:hover:border-sky-500/30 transition-all duration-200"
    >
      {/* Hover accent */}
      <div
        className="h-0.5 bg-linear-to-r from-sky-500 to-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        aria-hidden="true"
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon */}
          <div
            className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center"
            aria-hidden="true"
          >
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 dark:text-sky-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + price */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white truncate leading-tight">
                  {item.ticketName}
                </h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">{item.eventTitle}</p>
              </div>
              <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white shrink-0 tabular-nums">
                $
                {(item.price * item.quantity)?.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              {/* Quantity stepper */}
              <div role="group" aria-label={`Quantity for ${item.ticketName}`} className="flex items-center gap-2">
                <button
                  onClick={() => useCartStore.getState().updateQuantity(item.ticketId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <Minus className="w-3 h-3 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                </button>

                <span
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={`Quantity: ${item.quantity}`}
                  className="w-7 text-center text-sm font-semibold text-neutral-900 dark:text-white tabular-nums"
                >
                  {item.quantity}
                </span>

                <button
                  onClick={() => useCartStore.getState().updateQuantity(item.ticketId, item.quantity + 1)}
                  disabled={item.quantity >= item.maxAvailable}
                  aria-label="Increase quantity"
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <Plus className="w-3 h-3 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                </button>

                <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1 hidden sm:inline">
                  @ ${item.price.toFixed(2)} ea
                </span>
              </div>

              {/* Remove */}
              <button
                onClick={() => useCartStore.getState().removeFromCart(item.ticketId)}
                aria-label={`Remove ${item.ticketName} from cart`}
                className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md px-2 py-1"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
