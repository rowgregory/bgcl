'use client'

import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ShoppingCart, X } from 'lucide-react'
import Link from 'next/link'

import useSoundEffect from '@/lib/hooks/useSoundEffect'
import { useAddToCartToast } from '@/stores/useAddToCartToast'
import { useCartCount } from '@/stores/useCartStore'
import { usePreferencesStore } from '@/stores/usePreferencesStore'

const DISMISS_MS = 5000

export function GalaAddToCartToast() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isOpen = useAddToCartToast((s) => s.isOpen)
  const ticket = useAddToCartToast((s) => s.ticket)
  const quantity = useAddToCartToast((s) => s.quantity)
  const hide = useAddToCartToast((s) => s.hide)

  const cartCount = useCartCount()
  const soundOn = usePreferencesStore((s) => s.soundOn)

  const { play: chime } = useSoundEffect('/sound-effects/casual-click-pop-ui.mp3', soundOn)

  const onClose = useCallback(() => hide(), [hide])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!isOpen) return

    timerRef.current = setTimeout(onClose, DISMISS_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isOpen, ticket?.id, quantity, onClose])

  return (
    <AnimatePresence>
      {isOpen && ticket && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed left-4 right-4 top-4 z-100 sm:left-auto sm:w-80"
        >
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#12121c] shadow-2xl shadow-black/60">
            {/* cyan hairline, the page's structural accent */}
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)' }}
              aria-hidden="true"
            />

            {/* time remaining */}
            <motion.div
              key={`${ticket.id}-${quantity}`}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: DISMISS_MS / 1000, ease: 'linear' }}
              style={{ transformOrigin: 'left' }}
              className="h-0.5 w-full bg-[#9b1b3c]"
              aria-hidden="true"
            />

            <div className="p-4">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400/15"
                    aria-hidden="true"
                  >
                    <Check className="h-2.5 w-2.5 text-cyan-400" />
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">Added to cart</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    chime()
                  }}
                  aria-label="Dismiss notification"
                  className="rounded p-1 text-white/30 transition-colors hover:text-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Ticket row, framed like a stub */}
              <div className="mb-4 flex items-stretch gap-3">
                <span className="w-0.5 shrink-0 rounded-full bg-[#9b1b3c]" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-tight text-white/90">{ticket.name}</p>
                  <p className="mt-0.5 truncate text-xs text-white/40">{ticket.eventTitle}</p>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    <p className="text-sm font-bold tabular-nums text-white">${Number(ticket.price).toFixed(2)}</p>
                    <span className="text-white/20" aria-hidden="true">
                      ·
                    </span>
                    <p className="text-xs text-white/40">Qty {quantity}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#9b1b3c] py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#b52148] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12121c]"
                >
                  Checkout
                  {cartCount > 0 && (
                    <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  onClick={onClose}
                  aria-label="View cart"
                  className="rounded-md border border-white/10 px-3 py-2.5 text-white/40 transition-colors hover:border-cyan-400/40 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
