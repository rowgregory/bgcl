'use client'

import { setCloseTicketSelectionDrawer } from '@/app/lib/store/slices/ticketSlice'
import { store, useTicketSelector } from '@/app/lib/store/store'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import Backdrop from '../../../../../components/common/Backdrop'
import { addToCart, setOpenAddToCartToast } from '@/app/lib/store/slices/cartSlice'
import { drawerVariants } from '@/app/lib/constants/motion'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import Picture from '../../../../../components/common/Picture'
import { GRADIENTS, SUITS } from '@/app/(public)/events/[eventId]/_components/casino/CasinoUiElements'

export function TicketSelectionDrawer() {
  const [quantity, setQuantity] = useState(1)
  const { ticket, ticketSelectionDrawer } = useTicketSelector()
  const { play: increaseQuantity } = useSoundEffect('/sound-effects/casino-16.mp3', true)
  const { play: decreaseQuantity } = useSoundEffect('/sound-effects/casino-11.mp3', true)
  const { play: add } = useSoundEffect('/sound-effects/casino-14.wav', true)
  const { play: close } = useSoundEffect('/sound-effects/casino-18.mp3', true)

  const type = ticket?.ticketType ?? 'GENERAL'
  const grad = GRADIENTS[type] ?? GRADIENTS.GENERAL
  const suit = SUITS[type] ?? '♥'
  const totalPrice = (ticket?.price ?? 0) * quantity
  const maxAvailable = (ticket?.totalQuantity ?? 0) - (ticket?.quantitySold ?? 0)
  const canIncrease = quantity < maxAvailable

  const onClose = () => {
    store.dispatch(setCloseTicketSelectionDrawer())
  }

  const handleAddToCart = () => {
    store.dispatch(addToCart({ ticket, quantity }))
    add()
    onClose()
    store.dispatch(setOpenAddToCartToast({ ticket, quantity }))
  }

  return (
    <AnimatePresence>
      {ticketSelectionDrawer && (
        <>
          <Backdrop
            onClose={() => {
              onClose()
              close()
            }}
          />

          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`max-w-2xl fixed right-0 top-0 h-full w-full bg-neutral-900/95 backdrop-blur-xl border-l border-neutral-700/50 z-50 flex flex-col shadow-2xl overflow-hidden`}
          >
            <div className="flex flex-col h-full bg-black">
              {/* Gradient header */}
              <div className="relative overflow-hidden px-5 pt-5 pb-7 shrink-0" style={{ background: grad.card }}>
                <Picture
                  src="/images/logo-1.webp"
                  alt=""
                  aria-hidden="true"
                  className="absolute top-0 left-0 w-70 h-fit object-contain opacity-10"
                  priority={true}
                />
                {/* Noise */}
                <div
                  className="absolute inset-0 opacity-[0.07] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '150px'
                  }}
                  aria-hidden="true"
                />
                {/* Shine */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(110deg, transparent 30%, ${grad.shimmer} 50%, transparent 70%)`,
                    animation: 'cardShine 3.5s ease-in-out infinite'
                  }}
                  aria-hidden="true"
                />
                {/* Big watermark suit */}
                <div
                  className="absolute -right-2 -bottom-4 text-[100px] font-black leading-none select-none pointer-events-none suit"
                  style={{ color: 'rgba(0,0,0,0.18)', fontFamily: 'Georgia, serif' }}
                  aria-hidden="true"
                >
                  {suit}
                </div>

                {/* Close */}
                <div className="flex justify-end mb-3 relative z-10">
                  <button
                    onClick={() => {
                      onClose()
                      close()
                    }}
                    aria-label="Close ticket selection"
                    className="p-1.5 rounded-lg bg-black/25 hover:bg-black/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    <X className="w-4 h-4 text-white/80" aria-hidden="true" />
                  </button>
                </div>

                {/* Ticket name */}
                <h2
                  className="oswald relative z-10 text-2xl font-black text-white uppercase leading-tight mb-1"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)', letterSpacing: '0.03em' }}
                >
                  {ticket?.name}
                </h2>

                {/* Price */}
                <p
                  className="oswald relative z-10 text-4xl font-black text-white leading-none"
                  style={{ textShadow: '0 0 20px rgba(0,0,0,0.4)' }}
                >
                  <span className="text-xl font-semibold opacity-75 mr-0.5">$</span>
                  {ticket?.price.toLocaleString()}
                </p>
              </div>

              {/* Tear notch */}
              <div className="flex items-center shrink-0" aria-hidden="true">
                <div className="w-4 h-4 rounded-full bg-neutral-950 -ml-2 shrink-0" />
                <div className="flex-1 border-t border-dashed border-white/10" />
                <div className="w-4 h-4 rounded-full bg-neutral-950 -mr-2 shrink-0" />
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                {/* Description */}
                {ticket?.description && <p className="text-sm text-white/40 leading-relaxed">{ticket.description}</p>}

                {/* Availability */}
                <div role="status" aria-live="polite">
                  <p className="text-[10px] oswald font-black uppercase tracking-[0.2em] text-white/25 mb-1">
                    Availability
                  </p>
                  <p className="text-sm text-white/50">
                    <span className="text-white font-semibold">{maxAvailable}</span> ticket
                    {maxAvailable !== 1 ? 's' : ''} remaining
                  </p>
                </div>

                {/* Quantity selector */}
                <div>
                  <label
                    htmlFor="ticket-quantity"
                    className="oswald block text-[10px] font-black uppercase tracking-[0.2em] text-white/25 mb-3"
                  >
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setQuantity(Math.max(1, quantity - 1))
                        decreaseQuantity()
                      }}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-10 h-10 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <input
                      id="ticket-quantity"
                      type="number"
                      min={1}
                      max={maxAvailable}
                      value={quantity}
                      aria-label={`Quantity, currently ${quantity}`}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val)) setQuantity(Math.max(1, Math.min(val, maxAvailable)))
                      }}
                      className="w-16 px-3 py-2 bg-transparent border border-white/15 text-white text-center text-lg font-bold rounded-xl focus:outline-none focus:border-white/40 transition-colors"
                    />

                    <button
                      onClick={() => {
                        setQuantity(quantity + 1)
                        increaseQuantity()
                      }}
                      disabled={!canIncrease}
                      aria-label="Increase quantity"
                      className="w-10 h-10 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div aria-live="polite" aria-label={`Total price: $${totalPrice.toFixed(2)}`}>
                  <p className="oswald text-[10px] font-black uppercase tracking-[0.2em] text-white/25 mb-1">Total</p>
                  <p
                    className="oswald text-4xl font-black leading-none"
                    style={{ color: '#f5e678', textShadow: '0 0 30px rgba(212,175,55,0.5)' }}
                  >
                    <span className="text-xl font-semibold opacity-60 mr-0.5">$</span>
                    {totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 px-5 pb-6 pt-4 border-t border-white/6 space-y-2.5">
                <button
                  onClick={handleAddToCart}
                  className="oswald relative w-full py-3.5 text-[15px] font-black uppercase tracking-widest text-white overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition-all active:scale-[0.98]"
                  style={{ background: grad.card }}
                >
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(90deg, transparent 25%, ${grad.shimmer} 50%, transparent 75%)`,
                      animation: 'btnShine 2.5s infinite linear'
                    }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10">
                    <span className="suit">{suit}</span> Add to Cart
                  </span>
                </button>

                <button
                  onClick={() => {
                    onClose()
                    close()
                  }}
                  className="w-full py-3 text-sm font-medium text-white/35 hover:text-white/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
