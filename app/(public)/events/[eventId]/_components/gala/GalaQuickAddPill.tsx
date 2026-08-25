'use client'

import { Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency.utils'
import { getTicketStatus } from '@/lib/utils/getTicketStatus'
import { useCartStore } from '@/stores/useCartStore'
import { TGalaQuickAddPill } from '@/types/event.types'
import { useAddToCartToast } from '@/stores/useAddToCartToast'

export function GalaQuickAddPill({
  ticket,
  eventId,
  eventTitle,
  ticketSalesStartDate,
  ticketSalesEndDate,
  soundOn,
  ...rest
}: TGalaQuickAddPill) {
  const { available } = getTicketStatus(ticket)

  const handleAdd = () => {
    if (!available) return

    useCartStore.getState().addToCart({ ...ticket, eventTitle, ticketSalesStartDate, ticketSalesEndDate }, 1)
    useAddToCartToast.getState().show({ ...ticket, eventId, eventTitle }, 1)

    if (soundOn) void new Audio('/sound-effects/gala-1.mp3').play().catch(() => {})
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!available}
      aria-label={`Add ${ticket.name}, ${formatCurrency(Number(ticket.price))}, to cart`}
      className="group flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-[#12121c] py-2 pl-4 pr-2 transition-colors hover:border-cyan-400/50 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a12]"
      {...rest}
    >
      <span className="text-sm font-medium whitespace-nowrap text-white/85">{ticket.name}</span>
      <span className="text-sm font-bold tabular-nums text-cyan-400">{formatCurrency(Number(ticket.price))}</span>
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9b1b3c] transition-colors group-hover:bg-[#b52148]"
        aria-hidden="true"
      >
        <Plus className="h-4 w-4 text-white" />
      </span>
    </button>
  )
}
