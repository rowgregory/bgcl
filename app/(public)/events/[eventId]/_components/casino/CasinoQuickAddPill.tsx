import { getTicketStatus } from '@/lib/utils/getTicketStatus'
import { ITicket } from '@/types/entities/ticket'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { GRADIENTS, SUITS } from './CasinoUiElements'
import useSoundEffect from '@/lib/hooks/useSoundEffect'
import { useCartStore } from '@/stores/useCartStore'
import { useAddToCartToast } from '@/stores/useAddToCartToast'

type Props = {
  ticket: ITicket
  eventId: string
  eventTitle: string
  ticketSalesStartDate: Date
  ticketSalesEndDate: Date
  soundOn: boolean
}

export function CasinoQuickAddPill({
  ticket,
  eventId,
  eventTitle,
  ticketSalesStartDate,
  ticketSalesEndDate,
  soundOn
}: Props) {
  const items = useCartStore((s) => s.items)
  const { available } = getTicketStatus(ticket)
  const cartItem = items.find((i: any) => i.ticketId === ticket.id)
  const cartQty = cartItem?.quantity ?? 0
  const { play } = useSoundEffect('/sound-effects/casino-4.mp3', soundOn)

  const type = ticket.ticketType ?? 'GENERAL'
  const grad = GRADIENTS[type] ?? GRADIENTS.GENERAL
  const suit = SUITS[type] ?? '♥'
  const addToCart = useCartStore((s) => s.addToCart)
  const show = useAddToCartToast((s) => s.show)

  const handleAdd = () => {
    if (!available) return

    addToCart({ ...ticket, eventId, eventTitle, ticketSalesStartDate, ticketSalesEndDate }, 1)

    show({ ...ticket, eventId, eventTitle }, 1)
    play()
  }

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03 }}
      onClick={handleAdd}
      disabled={!available}
      aria-label={available ? `Add one ${ticket.name} to cart` : `${ticket.name} unavailable`}
      className="relative flex items-center gap-0 shrink-0 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      style={{
        boxShadow: available ? `0 0 24px ${grad.glow}, 0 4px 20px rgba(0,0,0,0.6)` : 'none',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {/* Shine */}
      {available && (
        <span
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `linear-gradient(90deg, transparent 25%, ${grad.shimmer} 50%, transparent 75%)`,
            animation: 'btnShine 3s infinite linear'
          }}
          aria-hidden="true"
        />
      )}

      {/* Thumbnail — gradient square like the casino game image */}
      <span
        className="relative flex items-center justify-center w-10 h-10 shrink-0 text-xl font-black"
        style={{ background: grad.card }}
        aria-hidden="true"
      >
        {suit}
      </span>

      {/* Content */}
      <span
        className="relative flex items-center gap-2 px-3 py-2 h-10"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <span className="oswald text-[12px] font-black uppercase tracking-[0.06em] text-white leading-none whitespace-nowrap">
          {ticket.name}
        </span>

        <span
          className="oswald text-[11px] font-black text-black px-1.5 py-0.5 whitespace-nowrap shrink-0"
          style={{ background: 'linear-gradient(135deg, #d4af37, #f5e678)' }}
        >
          ${ticket.price.toLocaleString()}
        </span>

        {cartQty > 0 && (
          <span
            className="oswald text-[10px] font-black px-1.5 py-0.5 text-black whitespace-nowrap shrink-0"
            style={{ background: 'rgba(255,255,255,0.9)' }}
            aria-label={`${cartQty} in cart`}
          >
            {cartQty} ✓
          </span>
        )}
      </span>

      {/* Plus — right edge block */}
      <span
        className="relative flex items-center justify-center w-8 h-10 shrink-0"
        style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
        aria-hidden="true"
      >
        <Plus className="w-3.5 h-3.5 text-white/70" />
      </span>
    </motion.button>
  )
}
