import { setCloseAddToCartToast } from '@/app/lib/store/slices/cartSlice'
import { store, useCartSelector } from '@/app/lib/store/store'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle, ShoppingCart, Ticket, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

export default function AddToCartToast() {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { item, addToCartToast, items } = useCartSelector()
  const onClose = useCallback(() => store.dispatch(setCloseAddToCartToast()), [])

  const ticket = item?.ticket
  const quantity = item?.quantity ?? 1
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  useEffect(() => {
    if (addToCartToast) {
      timerRef.current = setTimeout(() => onClose(), 4000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [addToCartToast, item, onClose])

  return (
    <AnimatePresence>
      {addToCartToast && ticket && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`${ticket.name} added to cart`}
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed top-4 right-4 left-4 sm:left-auto sm:w-95 z-50"
        >
          <div className="dark:bg-neutral-900 dark:border-neutral-700 bg-white border-neutral-200 rounded-2xl border shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
            {/* ── Progress bar ── */}
            <motion.div
              key={ticket.id}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: 'linear' }}
              style={{ transformOrigin: 'left' }}
              className="h-0.5 w-full bg-sky-500"
              aria-hidden="true"
            />

            <div className="p-4">
              {/* ── Header ── */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">Added to cart</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Dismiss notification"
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 shrink-0"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* ── Item details ── */}
              <div className="flex items-start gap-3 mb-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{ticket.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{ticket.eventTitle}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                      ${(ticket.price / 100).toFixed(2)}
                    </p>
                    <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">
                      ·
                    </span>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Qty: {quantity}</p>
                  </div>
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    router.push('/cart')
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white text-xs font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
                >
                  <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
                  View Cart
                  {cartCount > 0 && (
                    <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    router.push('/checkout')
                  }}
                  className="flex items-center gap-1.5 py-2.5 px-3 border border-neutral-200 dark:border-neutral-700 hover:border-sky-500/50 dark:hover:border-sky-500/50 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  aria-label="Proceed to checkout"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
