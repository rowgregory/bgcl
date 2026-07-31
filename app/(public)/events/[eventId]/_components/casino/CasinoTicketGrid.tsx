'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Dice5 } from 'lucide-react'
import { ITicket } from '@/types/entities/ticket'
import { getTicketStatus } from '@/lib/utils/getTicketStatus'
import { store } from '@/lib/store/store'
import { hydrateTicket, setOpenTicketSelectionDrawer } from '@/lib/store/slices/ticketSlice'
import { setSelectedEvent } from '@/lib/store/slices/eventSlice'
import { IEvent } from '@/types/entities/event'

// ── Per-type visual config ────────────────────────────────────────────────────
const TYPE_THEME: Record<
  string,
  {
    suit: string
    gradient: string
    glow: string
    accentText: string
    badgeBg: string
    shimmer: string
    label: string
  }
> = {
  RAFFLE: {
    suit: '♠',
    label: 'Raffle',
    gradient: 'linear-gradient(135deg, #7f0000 0%, #c0392b 40%, #e74c3c 60%, #922b21 100%)',
    glow: 'rgba(231,76,60,0.6)',
    accentText: '#ff6b6b',
    badgeBg: 'rgba(231,76,60,0.25)',
    shimmer: 'rgba(255,100,100,0.3)'
  },
  TOURNAMENT: {
    suit: '♣',
    label: 'Tournament',
    gradient: 'linear-gradient(135deg, #3d006e 0%, #7b2fbe 40%, #9b59b6 60%, #5b0fa8 100%)',
    glow: 'rgba(155,89,182,0.6)',
    accentText: '#c084fc',
    badgeBg: 'rgba(155,89,182,0.25)',
    shimmer: 'rgba(192,132,252,0.3)'
  },
  SPONSORSHIP: {
    suit: '♦',
    label: 'Sponsor',
    gradient: 'linear-gradient(135deg, #7a3500 0%, #d4af37 40%, #f5e678 60%, #b8860b 100%)',
    glow: 'rgba(212,175,55,0.7)',
    accentText: '#f5e678',
    badgeBg: 'rgba(212,175,55,0.2)',
    shimmer: 'rgba(245,230,120,0.35)'
  },
  GENERAL: {
    suit: '♥',
    label: 'General',
    gradient: 'linear-gradient(135deg, #003d7a 0%, #0ea5e9 40%, #38bdf8 60%, #0284c7 100%)',
    glow: 'rgba(14,165,233,0.6)',
    accentText: '#7dd3fc',
    badgeBg: 'rgba(14,165,233,0.2)',
    shimmer: 'rgba(125,211,252,0.3)'
  }
}

// ── Single ticket card ─────────────────────────────────────────────────────────
export function CasinoTicketCard({ ticket }: { ticket: ITicket & { eventId: string; eventTitle: string } }) {
  const [hovered, setHovered] = useState(false)
  const { available, message } = getTicketStatus(ticket)

  const isSponsorship = ticket.ticketType === 'SPONSORSHIP'
  const isRaffle = ticket.ticketType === 'RAFFLE'
  const isTournament = ticket.ticketType === 'TOURNAMENT'

  const theme = TYPE_THEME[ticket.ticketType ?? 'GENERAL'] ?? TYPE_THEME.GENERAL
  const remaining = ticket.totalQuantity - ticket.quantitySold - ticket.quantityReserved
  const almostGone = available && remaining <= 10
  const soldPct = Math.min((ticket.quantitySold / ticket.totalQuantity) * 100, 100)

  const handleSelect = () => {
    if (!available) return
    store.dispatch(hydrateTicket(ticket))
    store.dispatch(setSelectedEvent(ticket.eventId))
    store.dispatch(setOpenTicketSelectionDrawer())
  }

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={available ? handleSelect : undefined}
      className={`${available ? 'cursor-pointer' : 'cursor-not-allowed'} aspect-square`}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        background: '#0a0a0a',
        boxShadow:
          hovered && available
            ? `0 0 0 1px ${theme.glow}, 0 0 40px ${theme.glow}, 0 24px 48px rgba(0,0,0,0.7)`
            : '0 4px 24px rgba(0,0,0,0.6)',
        transition: 'box-shadow 0.3s',
        filter: available ? 'none' : 'grayscale(60%) brightness(0.5)'
      }}
      aria-label={`${ticket.name} — ${available ? `$${ticket.price}` : message}`}
    >
      {/* ── Gradient header ── */}
      <div
        style={{
          background: theme.gradient,
          padding: '20px 20px 28px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Noise texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '120px'
          }}
          aria-hidden="true"
        />

        {/* Shine sweep */}
        {available && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(105deg, transparent 30%, ${theme.shimmer} 50%, transparent 70%)`,
              animation: 'cardShine 3s ease-in-out infinite',
              pointerEvents: 'none'
            }}
            aria-hidden="true"
          />
        )}

        {/* Big suit watermark */}
        <div
          style={{
            position: 'absolute',
            right: -8,
            bottom: -12,
            fontSize: 96,
            fontWeight: 900,
            color: 'rgba(0,0,0,0.2)',
            lineHeight: 1,
            userSelect: 'none',
            fontFamily: 'Georgia, serif'
          }}
          aria-hidden="true"
        >
          {theme.suit}
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 10px',
            borderRadius: 99,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            marginBottom: 10
          }}
        >
          <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }} aria-hidden="true">
            {theme.suit}
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'Oswald, sans-serif'
            }}
          >
            {theme.label}
          </span>
          {isRaffle && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>·</span>
              <Dice5 style={{ width: 10, height: 10, color: 'rgba(255,255,255,0.7)' }} aria-hidden="true" />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.1em',
                  fontFamily: 'Oswald, sans-serif'
                }}
              >
                NUMBERED
              </span>
            </>
          )}
        </div>

        {/* Ticket name */}
        <h3
          style={{
            fontSize: 22,
            fontWeight: 900,
            lineHeight: 1.1,
            color: '#fff',
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            fontFamily: 'Oswald, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            position: 'relative',
            zIndex: 1
          }}
        >
          {ticket.name}
        </h3>

        {/* Price */}
        <p
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: '#fff',
            textShadow: `0 0 20px rgba(0,0,0,0.5)`,
            fontFamily: 'Oswald, sans-serif',
            lineHeight: 1,
            marginTop: 8,
            position: 'relative',
            zIndex: 1
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 600, marginRight: 2, opacity: 0.8 }}>$</span>
          {ticket.price.toLocaleString()}
        </p>
      </div>

      {/* ── Bottom half ── */}
      <div style={{ padding: '16px 18px 18px', background: '#111', position: 'relative' }}>
        {/* Tear notch line */}
        <div
          style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center' }}
          aria-hidden="true"
        >
          <div
            style={{ width: 12, height: 12, borderRadius: '50%', background: '#0a0a0a', flexShrink: 0, marginLeft: -6 }}
          />
          <div style={{ flex: 1, borderTop: '1px dashed rgba(255,255,255,0.1)' }} />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#0a0a0a',
              flexShrink: 0,
              marginRight: -6
            }}
          />
        </div>

        {/* Description */}
        {ticket.description && (
          <p
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.6,
              marginBottom: 12,
              marginTop: 6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {ticket.description}
          </p>
        )}

        {/* Sponsor impact */}
        {isSponsorship && ticket.sponsorImpact && (
          <div
            style={{
              marginBottom: 10,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.15)'
            }}
          >
            <p
              style={{
                fontSize: 9,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#d4af37',
                marginBottom: 3,
                fontFamily: 'Oswald, sans-serif'
              }}
            >
              Impact
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{ticket.sponsorImpact}</p>
          </div>
        )}

        {/* Sponsor perks */}
        {isSponsorship && ticket.sponsorPerks?.length > 0 && (
          <ul style={{ marginBottom: 12, listStyle: 'none', padding: 0 }} aria-label="Sponsor perks">
            {ticket.sponsorPerks.slice(0, 3).map((perk: string, i: number) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 6,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.7
                }}
              >
                <span style={{ color: '#d4af37', flexShrink: 0, marginTop: 1 }}>✦</span>
                {perk}
              </li>
            ))}
          </ul>
        )}

        {/* Availability bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: almostGone ? '#f97316' : available ? '#4ade80' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              {available ? (
                almostGone ? (
                  <>
                    <AlertCircle style={{ width: 10, height: 10 }} aria-hidden="true" /> Only {remaining} left!
                  </>
                ) : (
                  <>
                    <CheckCircle2 style={{ width: 10, height: 10 }} aria-hidden="true" /> Available
                  </>
                )
              ) : (
                message
              )}
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontVariantNumeric: 'tabular-nums' }}>
              {ticket.quantitySold}/{ticket.totalQuantity}
            </span>
          </div>
          <div
            style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}
            role="progressbar"
            aria-valuenow={ticket.quantitySold}
            aria-valuemin={0}
            aria-valuemax={ticket.totalQuantity}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${soldPct}%` }}
              transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
              style={{
                height: '100%',
                borderRadius: 99,
                background: available ? theme.gradient : 'rgba(255,255,255,0.15)'
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          disabled={!available}
          onClick={(e) => {
            e.stopPropagation()
            handleSelect()
          }}
          aria-label={available ? `Select ${ticket.name}` : message}
          style={{
            width: '100%',
            padding: '11px 0',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'Oswald, sans-serif',
            cursor: available ? 'pointer' : 'not-allowed',
            border: 'none',
            position: 'relative',
            overflow: 'hidden',
            color: available ? '#fff' : 'rgba(255,255,255,0.2)',
            background: available ? theme.gradient : 'rgba(255,255,255,0.04)',
            boxShadow: available && hovered ? `0 0 20px ${theme.glow}` : 'none',
            transition: 'box-shadow 0.3s'
          }}
        >
          {available && (
            <span
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: `linear-gradient(90deg, transparent 25%, ${theme.shimmer} 50%, transparent 75%)`,
                animation: 'btnShine 2.5s infinite linear'
              }}
              aria-hidden="true"
            />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>
            {available
              ? isSponsorship
                ? `${theme.suit} Become a Sponsor`
                : isRaffle
                  ? `${theme.suit} Get Raffle Ticket`
                  : isTournament
                    ? `${theme.suit} Enter Tournament`
                    : `${theme.suit} Select Ticket`
              : message}
          </span>
        </button>
      </div>
    </motion.div>
  )
}

// ── All tickets grid (no tabs — all visible) ──────────────────────────────────
export function CasinoTicketGrid({ data, items }: { data: IEvent; items: any[] }) {
  const tickets = [
    ...data.tickets.filter((t: ITicket) => t.ticketType === 'RAFFLE'),
    ...data.tickets.filter((t: ITicket) => t.ticketType === 'TOURNAMENT'),
    ...data.tickets.filter((t: ITicket) => !t.ticketType || t.ticketType === 'GENERAL'),
    ...data.tickets.filter((t: ITicket) => t.ticketType === 'SPONSORSHIP')
  ]

  return (
    <div>
      <style>{`
        @keyframes cardShine {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          60%  { transform: translateX(200%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        @keyframes btnShine {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(50%);  }
        }
      `}</style>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24
        }}
      >
        {tickets.map((ticket: ITicket) => (
          <CasinoTicketCard key={ticket.id} ticket={{ ...ticket, eventId: data.id, eventTitle: data.title }} />
        ))}
      </div>
    </div>
  )
}
