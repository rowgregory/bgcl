import { setCloseAddToCartToast } from '@/app/lib/store/slices/cartSlice'
import { store, useCartSelector, useUiSelector } from '@/app/lib/store/store'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingCart, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { GRADIENTS, SUITS } from '../events/casino/CasinoUiElements'
import Link from 'next/link'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'

export default function AddToCartToast() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { item, addToCartToast, items } = useCartSelector()
  const { soundOn } = useUiSelector()
  const { play: proceed } = useSoundEffect('/sound-effects/casino-15.wav', soundOn)
  const { play: viewCart } = useSoundEffect('/sound-effects/casino-15.wav', soundOn)
  const { play: close } = useSoundEffect('/sound-effects/casual-click-pop-ui.mp3', soundOn)
  const onClose = useCallback(() => {
    store.dispatch(setCloseAddToCartToast())
  }, [])
  const ticket = item?.ticket
  const quantity = item?.quantity ?? 1
  const cartCount = items?.reduce((sum, i) => sum + i.quantity, 0)

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
          className="fixed top-20 right-4 left-4 sm:left-auto sm:w-80 z-100"
        >
          <div
            className="bg-black overflow-hidden"
            style={{
              border: '1px solid rgba(212,175,55,0.25)',
              boxShadow: '0 0 0 1px rgba(212,175,55,0.06), 0 0 40px rgba(212,175,55,0.06), 0 24px 48px rgba(0,0,0,0.8)'
            }}
          >
            {/* Gold top line */}
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f5e678, #d4af37, transparent)' }}
              aria-hidden="true"
            />

            {/* Progress bar */}
            <motion.div
              key={ticket.id}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: 'linear' }}
              style={{
                transformOrigin: 'left',
                background: 'linear-gradient(90deg, #7f0000, #c0392b, #e74c3c)'
              }}
              className="h-0.5 w-full"
              aria-hidden="true"
            />

            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400/60 text-base suit" aria-hidden="true">
                    ♠
                  </span>
                  <p className="oswald text-sm font-black uppercase tracking-[0.15em] text-white/70">Added to Cart</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    close()
                  }}
                  aria-label="Dismiss notification"
                  className="p-1 rounded-lg text-white/25 hover:text-white/60 transition-colors focus:outline-none"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Ticket row */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 flex items-center justify-center text-lg font-black shrink-0 suit"
                  style={{ background: GRADIENTS[ticket.ticketType ?? 'GENERAL']?.card ?? GRADIENTS.GENERAL.card }}
                  aria-hidden="true"
                >
                  {SUITS[ticket.ticketType ?? 'GENERAL'] ?? '♥'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white/80 truncate leading-tight">{ticket.name}</p>
                  <p className="text-xs text-white/30 truncate mt-0.5">{ticket.eventTitle}</p>
                  <div className="flex items-center gap-2.5 mt-1">
                    <p className="oswald text-xs font-black text-amber-400">${ticket.price.toFixed(2)}</p>
                    <span className="text-white/15" aria-hidden="true">
                      ·
                    </span>
                    <p className="text-xs text-white/30">Qty: {quantity}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href="/checkout"
                  type="button"
                  onClick={() => {
                    onClose()
                    proceed()
                  }}
                  className="oswald relative flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-black uppercase tracking-widest text-white overflow-hidden focus:outline-none active:scale-[0.98] transition-transform"
                  style={{ background: 'linear-gradient(135deg, #7f0000 0%, #c0392b 45%, #e74c3c 65%, #922b21 100%)' }}
                >
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 25%, rgba(255,120,120,0.25) 50%, transparent 75%)',
                      animation: 'btnShine 2.5s infinite linear'
                    }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center gap-1.5">
                    Checkout
                    {cartCount > 0 && (
                      <span
                        className="oswald text-[10px] font-black px-1.5 py-0.5 rounded-full text-black"
                        style={{ background: 'linear-gradient(135deg, #d4af37, #f5e678)' }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </span>
                </Link>

                <Link
                  onClick={() => viewCart()}
                  href="/cart"
                  className="oswald py-2.5 px-3 text-[12px] font-black uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors focus:outline-none"
                  aria-label="View cart"
                >
                  <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Gold bottom line */}
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)' }}
              aria-hidden="true"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
