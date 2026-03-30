import { getTicketStatus } from '@/app/lib/utils/getTicketStatus'
import { ITicket } from '@/types/entities/ticket'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { store } from '@/app/lib/store/store'
import { hydrateTicket, setOpenTicketSelectionDrawer } from '@/app/lib/store/slices/ticketSlice'
import { setSelectedEvent } from '@/app/lib/store/slices/eventSlice'
import Picture from '../../common/Picture'
import { AlertCircle, CheckCircle2, Clock, Dice5 } from 'lucide-react'
import { GRADIENTS, SUITS } from './CasinoUiElements'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'

const LABELS: Record<string, string> = {
  RAFFLE: 'Raffle',
  TOURNAMENT: 'Tournament',
  SPONSORSHIP: 'Sponsor',
  GENERAL: 'General'
}

export function CasinoTicketCard({
  ticket,
  soundOn
}: {
  ticket: ITicket & { eventId: string; eventTitle: string; registrationDeadline: string }
  soundOn: boolean
  ticketSalesEndDate?: string | null
  ticketSalesStartDate?: string | null
}) {
  const [hov, setHov] = useState(false)
  const { available: ticketAvailable, message: ticketMessage } = getTicketStatus(ticket)
  const isSponsorship = ticket.ticketType === 'SPONSORSHIP'
  const isRaffle = ticket.ticketType === 'RAFFLE'
  const isTournament = ticket.ticketType === 'TOURNAMENT'
  const type = ticket.ticketType ?? 'GENERAL'
  const grad = GRADIENTS[type] ?? GRADIENTS.GENERAL
  const suit = SUITS[type] ?? '♥'
  const label = LABELS[type] ?? 'General'
  const remaining = ticket.totalQuantity - ticket.quantitySold - ticket.quantityReserved
  const soldPct = Math.min((ticket.quantitySold / ticket.totalQuantity) * 100, 100)
  const { play } = useSoundEffect('/sound-effects/casino-3.mp3', soundOn)

  const now = new Date()
  const salesEnded = !!(ticket?.ticketSalesEndDate && new Date(ticket?.ticketSalesEndDate) < now)
  const sponsorDeadline = ticket.registrationDeadline ? new Date(ticket.registrationDeadline) : null
  const sponsorshipExpired = isSponsorship && sponsorDeadline && sponsorDeadline < now

  const available = ticketAvailable && !salesEnded && !sponsorshipExpired
  const almostGone = available && remaining <= 10
  const message = sponsorshipExpired ? 'Sponsorship closed' : salesEnded ? 'Sales closed' : ticketMessage

  const handleSelect = () => {
    if (!available) return

    store.dispatch(hydrateTicket(ticket))
    store.dispatch(setSelectedEvent(ticket.eventId))
    store.dispatch(setOpenTicketSelectionDrawer())
    play()
  }

  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      onClick={available ? handleSelect : undefined}
      className="overflow-hidden bg-black flex flex-col"
      style={{
        boxShadow:
          hov && available
            ? `0 0 0 1px ${grad.glow}, 0 0 60px ${grad.glow}, 0 30px 60px rgba(0,0,0,0.8)`
            : '0 6px 30px rgba(0,0,0,0.7)',
        cursor: available ? 'pointer' : 'not-allowed',
        filter: available ? 'none' : 'grayscale(70%) brightness(0.45)',
        transition: 'box-shadow 0.3s'
      }}
      aria-label={`${ticket.name} — ${available ? `$${ticket.price}` : message}`}
    >
      {/* Gradient header */}
      <div className="relative overflow-hidden px-5 pt-5 pb-8" style={{ background: grad.card }}>
        {/* Noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '150px'
          }}
          aria-hidden="true"
        />
        {/* Shine */}
        {available && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(110deg, transparent 30%, ${grad.shimmer} 50%, transparent 70%)`,
              animation: 'cardShine 3.5s ease-in-out infinite'
            }}
            aria-hidden="true"
          />
        )}
        {/* Big suit watermark */}
        <div
          className="absolute -right-2 -bottom-4 text-[110px] font-black leading-none select-none pointer-events-none suit"
          style={{ color: 'rgba(0,0,0,0.18)' }}
          aria-hidden="true"
        >
          {suit}
        </div>

        {/* Logo watermark */}
        <Picture
          src="/images/logo-1.webp"
          alt=""
          aria-hidden="true"
          className="absolute -top-3 -left-20 w-84 h-fit object-contain opacity-[0.15] pointer-events-none select-none"
          priority={false}
        />

        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <span className="text-[11px] text-white font-black suit" aria-hidden="true">
            {suit}
          </span>
          <span className="oswald text-[9px] font-black uppercase tracking-[0.18em] text-white/90">{label}</span>
          {isRaffle && (
            <>
              <span className="text-white/30 text-[8px]">·</span>
              <Dice5 className="w-2.5 h-2.5 text-white/75" aria-hidden="true" />
              <span className="oswald text-[8px] font-black tracking-[0.12em] text-white/75">NUMBERED</span>
            </>
          )}
        </div>

        {/* Name */}
        <h3
          className="oswald relative z-10 text-xl font-black text-white uppercase leading-tight mb-2"
          style={{ letterSpacing: '0.03em', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
        >
          {ticket.name}
        </h3>

        {/* Price */}
        <p
          className="oswald relative z-10 text-[40px] font-black text-white leading-none"
          style={{ textShadow: '0 0 20px rgba(0,0,0,0.5)' }}
        >
          <span className="text-xl font-semibold mr-0.5 opacity-75">$</span>
          {ticket.price.toLocaleString()}
        </p>
      </div>

      {/* Body */}
      <div className="bg-black px-4.5 pt-3.5 pb-4.5 relative flex flex-col flex-1">
        {/* Tear notch */}
        <div className="absolute top-0 left-0 right-0 flex items-center" aria-hidden="true">
          <div className="w-3.5 h-3.5 rounded-full bg-[#080808] -ml-1.5 shrink-0" />
          <div className="flex-1 border-t border-dashed border-white/8" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#080808] -mr-1.5 shrink-0" />
        </div>

        <div className="pt-2.5 flex flex-col gap-3 flex-1">
          {/* Description */}
          {ticket.description && (
            <p className="text-xs text-white/35 leading-relaxed line-clamp-2">{ticket.description}</p>
          )}

          {/* Availability */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span
                className={`text-[10px] font-bold flex items-center gap-1 ${almostGone ? 'text-orange-400' : available ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {available ? (
                  almostGone ? (
                    <>
                      <AlertCircle className="w-2.5 h-2.5" aria-hidden="true" />
                      Only {remaining} left!
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-2.5 h-2.5" aria-hidden="true" />
                      Available
                    </>
                  )
                ) : (
                  message
                )}
              </span>
              <span className="text-[10px] text-white/20 tabular-nums">
                {ticket.quantitySold}/{ticket.totalQuantity}
              </span>
            </div>
            <div
              className="h-0.5 rounded-full bg-white/6 overflow-hidden"
              role="progressbar"
              aria-valuenow={ticket.quantitySold}
              aria-valuemin={0}
              aria-valuemax={ticket.totalQuantity}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${soldPct}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: available ? grad.card : 'rgba(255,255,255,0.12)' }}
              />
            </div>
          </div>

          {/* Sponsorship deadline */}
          {isSponsorship && sponsorDeadline && !sponsorshipExpired && (
            <p className="text-[10px] text-white/30 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-amber-400/40 shrink-0" aria-hidden="true" />
              Available until{' '}
              <span className="text-white/50 font-medium">
                {sponsorDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </p>
          )}
          {isSponsorship && sponsorshipExpired && (
            <p className="text-[10px] text-red-400/60 flex items-center gap-1.5">
              <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
              Sponsorship period has ended
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA */}
          <button
            disabled={!available}
            onClick={(e) => {
              e.stopPropagation()
              handleSelect()
            }}
            aria-label={available ? `Select ${ticket.name}` : message}
            className="oswald relative w-full py-3 text-[13px] font-black uppercase tracking-widest overflow-hidden border-0 transition-all"
            style={{
              background: available ? grad.card : 'rgba(255,255,255,0.04)',
              color: available ? '#fff' : 'rgba(255,255,255,0.15)',
              cursor: available ? 'pointer' : 'not-allowed',
              boxShadow: available && hov ? `0 0 24px ${grad.glow}` : 'none',
              transition: 'box-shadow 0.3s'
            }}
          >
            {available && (
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent 25%, ${grad.shimmer} 50%, transparent 75%)`,
                  animation: 'btnShine 2.5s infinite linear'
                }}
                aria-hidden="true"
              />
            )}
            <span className="suit">{suit} </span>
            <span className="relative z-10">
              {available
                ? isSponsorship
                  ? 'Become a Sponsor'
                  : isRaffle
                    ? 'Get Raffle Ticket'
                    : isTournament
                      ? 'Enter Tournament'
                      : 'Select Ticket'
                : message}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
