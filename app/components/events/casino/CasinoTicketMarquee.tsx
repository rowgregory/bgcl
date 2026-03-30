import { getTicketStatus } from '@/app/lib/utils/getTicketStatus'
import { ShoppingCart } from 'lucide-react'
import { useRef } from 'react'
import { CasinoQuickAddPill } from './CasinoQuickAddPill'
import { useUiSelector } from '@/app/lib/store/store'
import { TCasinoTicketMarquee } from '@/types/casino.types'

export function CasinoTicketMarquee({
  tickets,
  eventId,
  eventTitle,
  ticketSalesStartDate,
  ticketSalesEndDate
}: TCasinoTicketMarquee) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { soundOn } = useUiSelector()

  const pause = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
  }
  const resume = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
  }

  const available = tickets.filter((t) => getTicketStatus(t).available)
  if (available.length === 0) return null

  // Duplicate for seamless loop
  const doubled = [...available, ...available]

  return (
    <div className="w-full overflow-hidden py-3 relative" aria-label="Quick add tickets" role="region">
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="mb-3 flex items-center gap-3">
        <div
          className="h-px flex-1"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2))' }}
          aria-hidden="true"
        />
        <div className="flex items-center gap-2 shrink-0">
          <ShoppingCart className="w-3.5 h-3.5 text-amber-400/50" aria-hidden="true" />
          <p className="oswald text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            Tap to add tickets instantly
          </p>
          <ShoppingCart className="w-3.5 h-3.5 text-amber-400/50" aria-hidden="true" />
        </div>
        <div
          className="h-px flex-1"
          style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.2), transparent)' }}
          aria-hidden="true"
        />
      </div>

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="marquee-track flex items-center gap-3"
        style={{
          width: 'max-content',
          animation: `marqueeScroll ${available.length * 7}s linear infinite`
        }}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        {doubled.map((ticket, i) => (
          <CasinoQuickAddPill
            key={`${ticket.id}-${i}`}
            ticket={ticket}
            eventId={eventId}
            eventTitle={eventTitle}
            ticketSalesStartDate={ticketSalesStartDate}
            ticketSalesEndDate={ticketSalesEndDate}
            soundOn={soundOn}
          />
        ))}
      </div>
    </div>
  )
}
