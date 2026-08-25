'use client'

import { useRef } from 'react'

import { getTicketStatus } from '@/lib/utils/getTicketStatus'
import { usePreferencesStore } from '@/stores/usePreferencesStore'
import { TGalaTicketMarquee } from '@/types/event.types'
import { GalaQuickAddPill } from './GalaQuickAddPill'

// Brochure palette: cyan for structure, crimson for the ribbon accent
const CYAN = 'rgba(34,211,238,0.25)'

export function GalaTicketMarquee({
  tickets,
  eventId,
  eventTitle,
  ticketSalesStartDate,
  ticketSalesEndDate,
  fadeColor = '#0a0a12'
}: TGalaTicketMarquee & { fadeColor?: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const soundOn = usePreferencesStore((s) => s.soundOn)

  const pause = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
  }
  const resume = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
  }

  const available = tickets.filter((t) => getTicketStatus(t).available && t.name !== 'Individual Ticket')
  if (available.length === 0) return null

  // Duplicate for seamless loop
  const tripled = [...available, ...available, ...available, ...available, ...available, ...available]

  return (
    <div className="w-full overflow-hidden py-3 relative" aria-label="Quick add tickets" role="region">
      <style>{`
        @keyframes galaMarqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .gala-marquee-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .gala-marquee-track { animation: none !important; }
        }
      `}</style>

      {/* Scrolling track */}
      <div className="relative">
        {/* Edge fades, so pills enter and leave rather than snapping */}

        <div
          ref={trackRef}
          className="gala-marquee-track flex items-center gap-3"
          style={{
            width: 'max-content',
            animation: `galaMarqueeScroll ${available.length * 12}s linear infinite`
          }}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          {tripled.map((ticket, i) => (
            <GalaQuickAddPill
              key={`${ticket.id}-${i}`}
              ticket={ticket}
              eventId={eventId}
              eventTitle={eventTitle}
              ticketSalesStartDate={ticketSalesStartDate}
              ticketSalesEndDate={ticketSalesEndDate}
              soundOn={soundOn}
              // The duplicated half is decorative; only the first pass is announced
              aria-hidden={i >= available.length}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
