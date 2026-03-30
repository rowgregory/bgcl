'use client'

import { hydrateTicket, setOpenTicketSelectionDrawer } from '@/app/lib/store/slices/ticketSlice'
import { store } from '@/app/lib/store/store'
import { setSelectedEvent } from '@/app/lib/store/slices/eventSlice'
import { ITicket } from '@/types/entities/ticket'
import { FC } from 'react'
import { AlertCircle, CheckCircle2, Dice5 } from 'lucide-react'
import { getTicketStatus } from '@/app/lib/utils/getTicketStatus'

export const TicketCard: FC<{ ticket: ITicket }> = ({ ticket }) => {
  const { available, message } = getTicketStatus(ticket)

  const isSponsorship = ticket.ticketType === 'SPONSORSHIP'
  const isRaffle = ticket.ticketType === 'RAFFLE'
  const isTournament = ticket.ticketType === 'TOURNAMENT'

  const scheme = {
    accent: '#0ea5e9',
    suit: isSponsorship ? '♦' : isRaffle ? '♠' : isTournament ? '♣' : '♥',
    bar: 'from-sky-500 to-blue-400',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30'
  }

  const remaining = ticket.totalQuantity - ticket.quantitySold - ticket.quantityReserved
  const almostGone = available && remaining <= 10
  const soldPercent = Math.min((ticket.quantitySold / ticket.totalQuantity) * 100, 100)

  const handleTicketSelect = (ticket: ITicket) => {
    store.dispatch(hydrateTicket(ticket))
    store.dispatch(setSelectedEvent(ticket.eventId))
    store.dispatch(setOpenTicketSelectionDrawer())
  }

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all flex flex-col ${
        available
          ? 'bg-neutral-800/50 border-neutral-700 hover:border-neutral-500 hover:shadow-lg hover:shadow-black/20'
          : 'bg-neutral-900/30 border-neutral-800/50'
      }`}
      aria-label={`${ticket.name} — ${available ? `$${ticket.price}` : message}`}
    >
      {/* Top band */}
      <div
        className="h-1.5"
        style={{
          background: available
            ? `linear-gradient(90deg, ${scheme.accent}99, ${scheme.accent}, ${scheme.accent}99)`
            : undefined
        }}
        aria-hidden="true"
      />

      {/* Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                {ticket.ticketType && ticket.ticketType !== 'GENERAL' && (
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${scheme.badge}`}
                  >
                    {ticket.ticketType}
                  </span>
                )}
                {isRaffle && (
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border flex items-center gap-1 ${scheme.badge}`}
                  >
                    <Dice5 className="w-3 h-3" aria-hidden="true" />
                    Numbered
                  </span>
                )}
              </div>
              <h3
                className={`text-base sm:text-lg font-bold leading-tight ${available ? 'text-white' : 'text-neutral-500'}`}
              >
                {ticket.name}
              </h3>
            </div>
            <span
              className="text-3xl font-black shrink-0 leading-none"
              style={{ color: available ? `${scheme.accent}25` : undefined }}
              aria-hidden="true"
            >
              {scheme.suit}
            </span>
          </div>

          {/* Description */}
          {ticket.description && (
            <p className={`text-xs sm:text-sm leading-relaxed ${available ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {ticket.description}
            </p>
          )}

          {/* Sponsor impact */}
          {isSponsorship && ticket.sponsorImpact && (
            <div className="mt-3 p-3 rounded-lg border border-neutral-600/30 bg-neutral-700/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Your Impact</p>
              <p className="text-xs text-neutral-200/80 leading-relaxed">{ticket.sponsorImpact}</p>
            </div>
          )}

          {/* Sponsor perks */}
          {isSponsorship && ticket.sponsorPerks && ticket.sponsorPerks.length > 0 && (
            <ul className="mt-3 space-y-1.5" aria-label="Included perks">
              {ticket.sponsorPerks.map((perk, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                  <CheckCircle2
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    style={{ color: scheme.accent }}
                    aria-hidden="true"
                  />
                  {perk}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom */}
        <div className="space-y-3">
          {/* Price */}
          <p
            className={`text-2xl sm:text-3xl font-black tabular-nums ${available ? 'text-white' : 'text-neutral-600'}`}
          >
            <span className="text-base font-semibold mr-0.5" style={{ color: available ? scheme.accent : undefined }}>
              $
            </span>
            {ticket.price.toLocaleString()}
          </p>

          {/* Availability bar */}
          <div aria-label={`${ticket.quantitySold} of ${ticket.totalQuantity} sold`}>
            <div className="flex items-center justify-between mb-1.5">
              {available ? (
                almostGone ? (
                  <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                    Only {remaining} left
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    Available
                  </span>
                )
              ) : (
                <span
                  className={`text-[11px] font-bold uppercase tracking-wide ${message === 'Sold out' ? 'text-red-400' : 'text-neutral-500'}`}
                >
                  {message}
                </span>
              )}
              <span className="text-[11px] text-neutral-500 tabular-nums">
                {ticket.quantitySold} / {ticket.totalQuantity} sold
              </span>
            </div>
            <div
              className="h-1.5 rounded-full bg-neutral-700 overflow-hidden"
              role="progressbar"
              aria-valuenow={ticket.quantitySold}
              aria-valuemin={0}
              aria-valuemax={ticket.totalQuantity}
            >
              <div
                className={`h-full rounded-full bg-linear-to-r ${available ? scheme.bar : 'from-neutral-600 to-neutral-500'}`}
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tear line */}
      <div className="relative flex items-center bg-neutral-800/50" aria-hidden="true">
        <div className="absolute -left-2.5 w-5 h-5 rounded-full bg-neutral-950 border border-neutral-700 z-10" />
        <div className="flex-1 border-t-2 border-dashed border-neutral-700 mx-4" />
        <span className="text-[10px] text-neutral-600 px-1 select-none rotate-90">✂</span>
        <div className="flex-1 border-t-2 border-dashed border-neutral-700 mx-4" />
        <div className="absolute -right-2.5 w-5 h-5 rounded-full bg-neutral-950 border border-neutral-700 z-10" />
      </div>

      {/* Stub */}
      <div className="bg-neutral-900/50 px-5 sm:px-6 py-4">
        <button
          disabled={!available}
          onClick={() => {
            if (available) handleTicketSelect(ticket)
          }}
          aria-label={available ? `Select ticket: ${ticket.name}` : `${ticket.name} — ${message}`}
          className={`relative w-full py-2.5 sm:py-3 rounded-lg text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 overflow-hidden ${
            available
              ? 'active:scale-[0.98] text-white focus-visible:ring-sky-500'
              : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
          }`}
          style={
            available ? { background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.accent}cc)` } : undefined
          }
        >
          {available && (
            <span className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden" aria-hidden="true">
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '200%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.25) 50%, transparent 75%)',
                  animation: 'btnShine 2.5s infinite linear'
                }}
              />
            </span>
          )}
          <span className="relative z-10">
            {available
              ? isSponsorship
                ? 'Become a Sponsor'
                : isRaffle
                  ? 'Get Raffle Ticket'
                  : isTournament
                    ? 'Register for Tournament'
                    : 'Select Ticket'
              : message}
          </span>
        </button>
      </div>
    </div>
  )
}
