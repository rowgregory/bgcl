'use client'

import { CalendarClock, Check, Minus, Plus, Ticket as TicketIcon, X } from 'lucide-react'
import type { Ticket } from '@prisma/client'

import { formatCurrency } from '@/lib/utils/currency.utils'
import { getTicketStatus } from '@/lib/utils/getTicketStatus'
import { useCartStore, useCartTotal } from '@/stores/useCartStore'
import { usePreferencesStore } from '@/stores/usePreferencesStore'

type Props = {
  tickets: Ticket[]
  eventTitle: string
  ticketSalesStartDate: Date | null
  ticketSalesEndDate: Date | null
  /** Short lead-in shown beside the section title. */
  blurb?: string | null
}

/** Nothing to sell — say which of the several reasons applies. */
function Unavailable({ icon: Icon, title, body }: { icon: typeof TicketIcon; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-white/10 bg-[#12121c] px-8 py-14 text-center">
      <Icon className="mx-auto h-8 w-8 text-cyan-400" aria-hidden="true" />
      <p className="mt-5 text-xl font-bold">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
    </div>
  )
}

export function GalaTicketSection({ tickets, eventTitle, ticketSalesStartDate, ticketSalesEndDate, blurb }: Props) {
  const items = useCartStore((s) => s.items)
  const total = useCartTotal()
  const soundOn = usePreferencesStore((s) => s.soundOn)

  const addToCart = useCartStore((s) => s.addToCart)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeFromCart = useCartStore((s) => s.removeFromCart)

  const qtyOf = (id: string) => items.find((i) => i.ticketId === id)?.quantity ?? 0

  const step = (ticket: Ticket, delta: number) => {
    const current = qtyOf(ticket.id)
    const next = current + delta

    if (next <= 0) {
      removeFromCart(ticket.id)
      if (soundOn) void new Audio('/sound-effects/gala-2.mp3').play().catch(() => {})
      return
    }

    if (current === 0) {
      addToCart({ ...ticket, eventTitle, ticketSalesStartDate, ticketSalesEndDate }, 1)
      if (soundOn) void new Audio('/sound-effects/gala-1.mp3').play().catch(() => {})
      return
    }

    updateQuantity(ticket.id, next)
  }

  // ── What, if anything, can be bought right now ──────────────────────────────
  const now = Date.now()
  const published = tickets.filter((t) => t.isPublished)
  const anyAvailable = published.some((t) => getTicketStatus(t).available)
  const allSoldOut = published.length > 0 && published.every((t) => t.totalQuantity - t.quantitySold <= 0)

  const closed = ticketSalesEndDate ? new Date(ticketSalesEndDate).getTime() < now : false

  const wrapper = 'mx-auto max-w-325 scroll-mt-8 pt-10 pb-20'

  if (published.length === 0) {
    return (
      <section id="tickets" className={wrapper}>
        <Unavailable
          icon={TicketIcon}
          title="Tickets coming soon"
          body="Ticketing for this event has not opened yet. Check back shortly, or get in touch if you would like to be notified."
        />
      </section>
    )
  }

  if (closed) {
    return (
      <section id="tickets" className={wrapper}>
        <Unavailable
          icon={CalendarClock}
          title="Ticket sales have closed"
          body="Online sales for this event are finished. Please contact us if you still hope to attend."
        />
      </section>
    )
  }

  if (allSoldOut || !anyAvailable) {
    return (
      <section id="tickets" className={wrapper}>
        <Unavailable
          icon={TicketIcon}
          title="Sold out"
          body="Every ticket for this event has been claimed. Contact us to be added to the waiting list."
        />
      </section>
    )
  }

  return (
    <section id="tickets" className={wrapper}>
      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        {/* ── Tiers ── */}
        <div className="grid gap-5 sm:grid-cols-2">
          {published.map((ticket) => {
            const { available } = getTicketStatus(ticket)
            const remaining = ticket.totalQuantity - ticket.quantitySold
            const qty = qtyOf(ticket.id)
            const low = available && remaining <= ticket.totalQuantity * 0.2

            return (
              <div
                key={ticket.id}
                className={`flex flex-col rounded-xl border p-6 text-center transition-all ${
                  qty > 0
                    ? 'border-cyan-400/70 bg-linear-to-t from-cyan-400/35 via-[#15151f] via-55% to-[#15151f] shadow-lg shadow-cyan-400/15'
                    : 'border-white/10 bg-linear-to-t from-cyan-400/15 via-[#12121c] via-50% to-[#12121c] hover:border-cyan-400/30 hover:from-cyan-400/25'
                } ${available ? '' : 'opacity-50'}`}
              >
                <h3 className="text-2xl font-bold">{ticket.name}</h3>
                <p className="mt-1 text-xl font-semibold tabular-nums text-white/90">{formatCurrency(Number(ticket.price))}</p>
                <p className="mt-1 text-xs text-white/40">Admits {ticket.guestCount}</p>
                {low && <p className="mt-2 text-xs font-semibold text-amber-400">Only {remaining} left</p>}

                {(ticket.sponsorPerks?.length > 0 || ticket.description) && (
                  <>
                    <p className="mt-6 text-sm font-semibold">Includes</p>
                    <div className="mx-auto mt-3 h-px w-full max-w-50 bg-white/10" aria-hidden="true" />
                  </>
                )}

                {ticket.description && <p className="mt-4 text-sm text-white/55">{ticket.description}</p>}

                {ticket.sponsorPerks?.length > 0 && (
                  <ul className="mt-4 space-y-2 text-left">
                    {ticket.sponsorPerks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-sm text-white/75">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden="true" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Stepper pinned to the bottom, so the cards line up */}
                <div className="mt-auto pt-8">
                  {available ? (
                    <div className="flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => step(ticket, -1)}
                        disabled={qty === 0}
                        aria-label={`Remove one ${ticket.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white/70 transition-colors hover:border-white/35 hover:text-white disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>

                      <span className="min-w-8 text-lg font-bold tabular-nums" aria-live="polite">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => step(ticket, 1)}
                        disabled={qty >= remaining}
                        aria-label={`Add one ${ticket.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-[#9b1b3c] text-white transition-colors hover:bg-[#b52148] disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/35">Sold out</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Cart ── */}
        <aside className="rounded-xl border border-white/10 bg-[#12121c] p-6 lg:sticky lg:top-8">
          <h3 className="text-xl font-bold">Your seats</h3>

          {items.length === 0 ? (
            <p className="mt-6 text-sm text-white/45">Nothing selected yet.</p>
          ) : (
            <>
              <ul className="mt-5 divide-y divide-white/10">
                {items.map((item) => (
                  <li key={item.ticketId} className="py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-semibold">
                        {item.ticketName} <span className="text-cyan-400">×{item.quantity}</span>
                      </p>
                      <p className="text-sm font-semibold tabular-nums">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="text-xs text-white/40">{formatCurrency(item.price)} each</p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.ticketId)}
                        className="flex items-center gap-1 text-xs text-white/40 transition-colors hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-baseline justify-between border-t border-white/10 pt-5">
                <p className="text-lg font-bold">Total</p>
                <p className="text-2xl font-bold tabular-nums">{formatCurrency(total)}</p>
              </div>
            </>
          )}

          <a
            href="/checkout"
            aria-disabled={items.length === 0}
            className={`mt-6 block rounded-md py-3.5 text-center text-xs font-bold uppercase tracking-[0.2em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12121c] ${
              items.length === 0 ? 'pointer-events-none bg-white/10 text-white/30' : 'bg-[#9b1b3c] text-white hover:bg-[#b52148]'
            }`}
          >
            Checkout
          </a>
        </aside>
      </div>
    </section>
  )
}
