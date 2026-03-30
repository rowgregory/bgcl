import { getTicketStatus } from '@/app/lib/utils/getTicketStatus'
import { AnimatePresence, motion } from 'framer-motion'
import { GRADIENTS, SUITS } from './CasinoUiElements'
import { store, useUiSelector } from '@/app/lib/store/store'
import { addToCart, removeFromCart, updateQuantity } from '@/app/lib/store/slices/cartSlice'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { TCasinoCartDropdown } from '@/types/casino.types'

export function CasinoCartDropdown({ setOpen, items, data, open }: TCasinoCartDropdown) {
  const { soundOn } = useUiSelector()
  const { play: decrease } = useSoundEffect('/sound-effects/casino-11.mp3', soundOn)
  const { play: increase } = useSoundEffect('/sound-effects/casino-16.mp3', soundOn)
  const { play: proceed } = useSoundEffect('/sound-effects/casino-17.mp3', soundOn)
  const { play: close } = useSoundEffect('/sound-effects/casual-click-pop-ui.mp3', soundOn)
  const { play: remove } = useSoundEffect('/sound-effects/casino-7.wav', soundOn)
  const total = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setOpen(false)
              close()
            }}
            className="fixed inset-0 z-40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm overflow-hidden z-50 bg-black"
            style={{
              border: '1px solid rgba(212,175,55,0.2)',
              boxShadow: '0 0 0 1px rgba(212,175,55,0.08), 0 0 50px rgba(212,175,55,0.06), 0 24px 48px rgba(0,0,0,0.8)'
            }}
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Gold top line */}
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f5e678, #d4af37, transparent)' }}
              aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
              <div className="flex items-center gap-2">
                <span className="text-amber-400/60 text-base suit" aria-hidden="true">
                  ♠
                </span>
                <p className="oswald text-sm font-black uppercase tracking-[0.15em] text-white/70">Your Cart</p>
              </div>
              <button
                onClick={() => {
                  setOpen(false)
                  close()
                }}
                aria-label="Close cart"
                className="p-1 rounded-lg text-white/30 hover:text-white/70 transition-colors focus:outline-none"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div className="px-4 py-6">
                <div className="text-center mb-4">
                  <p className="text-2xl mb-1 suit" aria-hidden="true">
                    ♠
                  </p>
                  <p className="oswald text-sm font-black uppercase tracking-[0.15em] text-white/20">No tickets yet</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  {data?.tickets?.map((ticket: any) => {
                    const { available } = getTicketStatus(ticket)
                    if (!available) return null
                    const type = ticket.ticketType ?? 'GENERAL'
                    const grad = GRADIENTS[type] ?? GRADIENTS.GENERAL
                    const suit = SUITS[type] ?? '♥'

                    return (
                      <button
                        key={ticket.id}
                        onClick={() => {
                          store.dispatch(
                            addToCart({
                              ticket: {
                                ...ticket,
                                eventId: data.id,
                                eventTitle: data.title,
                                ticketSalesEndDate: data.ticketSalesEndDate,
                                ticketSalesStartDate: data.ticketSalesStartDate
                              },
                              quantity: 1
                            })
                          )
                          increase()
                        }}
                        className="relative flex items-center gap-0 w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 active:scale-[0.98] transition-transform"
                        style={{
                          border: '1px solid rgba(255,255,255,0.06)',
                          boxShadow: `0 0 12px ${grad.glow}`
                        }}
                        aria-label={`Add ${ticket.name} to cart`}
                      >
                        {/* Shine */}
                        <span
                          className="absolute inset-0 pointer-events-none z-10"
                          style={{
                            background: `linear-gradient(90deg, transparent 25%, ${grad.shimmer} 50%, transparent 75%)`,
                            animation: 'btnShine 3s infinite linear'
                          }}
                          aria-hidden="true"
                        />

                        {/* Suit thumbnail */}
                        <span
                          className="flex items-center justify-center w-9 h-9 shrink-0 text-base font-black suit"
                          style={{ background: grad.card }}
                          aria-hidden="true"
                        >
                          {suit}
                        </span>

                        {/* Name */}
                        <span
                          className="flex-1 flex items-center h-9 px-3"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          <span className="oswald text-[11px] font-black uppercase tracking-[0.06em] text-white/80 truncate">
                            {ticket.name}
                          </span>
                        </span>

                        {/* Price */}
                        <span
                          className="flex items-center justify-center h-9 px-2.5 shrink-0"
                          style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <span className="oswald text-[11px] font-black" style={{ color: '#f5e678' }}>
                            ${ticket.price.toLocaleString()}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-white/5" aria-label="Cart items">
                {items.map((item: any) => {
                  const type = item.ticketType ?? 'GENERAL'
                  const grad = GRADIENTS[type] ?? GRADIENTS.GENERAL
                  const suit = SUITS[type] ?? '♥'
                  return (
                    <li key={item.ticketId} className="px-4 py-3 space-y-2">
                      {/* Top row — icon + name + subtotal + remove */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 flex items-center justify-center text-base font-black shrink-0 suit"
                          style={{ background: grad.card }}
                          aria-hidden="true"
                        >
                          {suit}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white/80 truncate leading-tight">
                            {item.ticketName}
                          </p>
                          <p className="text-xs text-white/30 tabular-nums mt-0.5">
                            ${item.price.toLocaleString()} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <p
                            className="oswald text-sm font-black tabular-nums"
                            style={{ color: '#f5e678' }}
                            aria-live="polite"
                            aria-label={`Subtotal: $${(item.price * item.quantity).toLocaleString()}`}
                          >
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                          <button
                            onClick={() => {
                              store.dispatch(removeFromCart(item.ticketId))
                              remove()
                            }}
                            aria-label={`Remove ${item.ticketName} from cart`}
                            className="p-1 rounded text-white/20 hover:text-red-400 transition-colors focus:outline-none"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 pl-11">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              store.dispatch(removeFromCart(item.ticketId))
                              remove()
                            } else {
                              store.dispatch(updateQuantity({ ticketId: item.ticketId, quantity: item.quantity - 1 }))
                              decrease()
                            }
                          }}
                          aria-label={`Decrease quantity of ${item.ticketName}`}
                          className="w-6 h-6 rounded-md border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all flex items-center justify-center focus:outline-none shrink-0"
                        >
                          <Minus className="w-3 h-3" aria-hidden="true" />
                        </button>

                        <span
                          className="oswald text-sm font-black tabular-nums text-white/70 w-6 text-center"
                          aria-live="polite"
                          aria-label={`Quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => {
                            store.dispatch(updateQuantity({ ticketId: item.ticketId, quantity: item.quantity + 1 }))
                            increase()
                          }}
                          aria-label={`Increase quantity of ${item.ticketName}`}
                          className="w-6 h-6 rounded-md border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all flex items-center justify-center focus:outline-none shrink-0"
                        >
                          <Plus className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-4 py-4 border-t border-white/6 space-y-3">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <p className="oswald text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Total</p>
                  <p
                    className="oswald text-2xl font-black"
                    style={{ color: '#f5e678', textShadow: '0 0 20px rgba(212,175,55,0.5)' }}
                  >
                    ${total.toLocaleString()}
                  </p>
                </div>

                {/* Checkout */}
                <Link
                  href="/checkout"
                  onClick={() => {
                    setOpen(false)
                    proceed()
                  }}
                  className="oswald relative block w-full py-3 text-[13px] font-black uppercase tracking-widest text-white text-center overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 active:scale-[0.98] transition-transform"
                  style={{
                    background: 'linear-gradient(135deg, #7f0000 0%, #c0392b 45%, #e74c3c 65%, #922b21 100%)'
                  }}
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
                  <span className="relative z-10">
                    <span className="suit">♠</span> Proceed to Checkout
                  </span>
                </Link>
              </div>
            )}

            {/* Gold bottom line */}
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)' }}
              aria-hidden="true"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
