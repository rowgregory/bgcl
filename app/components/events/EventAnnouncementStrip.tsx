'use client'

import Link from 'next/link'
import { ChevronRight, Volume2, VolumeX } from 'lucide-react'
import { IEvent } from '@/types/entities/event'
import { CasinoStyles } from './casino/CasinoUiElements'
import { formatDate } from '@/app/lib/utils/date-utils'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { motion } from 'framer-motion'
import { store, useUiSelector } from '@/app/lib/store/store'
import { setSoundOn } from '@/app/lib/store/slices/uiSlice'

export function EventAnnouncementStrip({ event }: { event: IEvent }) {
  const { soundOn } = useUiSelector()
  const { play } = useSoundEffect('/sound-effects/casino-24.mp3', soundOn)
  const { play: volumeOn } = useSoundEffect('/sound-effects/casino-22.mp3', !soundOn)
  const { play: volumeOff } = useSoundEffect('/sound-effects/casino-20.mp3', soundOn)

  if (!event) return null

  const now = new Date()
  const eventDate = new Date(event.date)
  const isUpcoming = event.status === 'UPCOMING' && eventDate > now
  const isActive = event.status === 'ONGOING' && eventDate >= now

  if (!isUpcoming && !isActive) return null

  return (
    <div className="relative">
      <Link
        onClick={() => play()}
        href={`/events/${event.id}`}
        className="bg-black block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 group"
        aria-label={`${event.title} — ${formatDate(eventDate)}. Click to learn more.`}
      >
        <style>{CasinoStyles}</style>
        <div className="relative overflow-hidden">
          {/* Suit pattern */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
            {['♠', '♥', '♦', '♣'].map((s, i) => (
              <span
                key={i}
                className="absolute text-white font-black opacity-10 text-4xl suit"
                style={{ left: `${15 + i * 24}%`, top: '50%', transform: 'translateY(-50%)' }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Shine sweep */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 30%, rgba(212,175,55,0.06) 50%, transparent 70%)',
              animation: 'btnShine 4s infinite linear'
            }}
            aria-hidden="true"
          />

          {/* Gold top line */}
          <div
            className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f5e678, #d4af37, transparent)' }}
            aria-hidden="true"
          />

          {/* Content */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 pr-12 sm:pr-14">
            {/* Suits — hidden on smallest screens */}
            <span className="text-amber-400/50 text-xs font-black shrink-0 hidden md:block suit" aria-hidden="true">
              ♠ ♥ ♦ ♣
            </span>

            {/* Event info — flex-1 so it fills available space */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-3 min-w-0 flex-1">
              {/* Title */}
              <span className="oswald text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.08em] sm:tracking-[0.12em] text-white/90 truncate">
                {event.title}
              </span>

              <span className="text-amber-500/40 text-xs shrink-0" aria-hidden="true">
                ·
              </span>

              {/* Date */}
              <span
                className="oswald text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.06em] sm:tracking-widest shrink-0"
                style={{ color: '#d4af37' }}
              >
                {formatDate(eventDate)}
              </span>

              {/* Location — only md+ */}
              {event.location && (
                <>
                  <span className="text-amber-500/40 text-xs shrink-0 hidden md:inline" aria-hidden="true">
                    ·
                  </span>
                  <span className="oswald text-xs font-bold uppercase tracking-[0.08em] text-white/40 shrink-0 hidden md:inline truncate max-w-49">
                    {event.location}
                  </span>
                </>
              )}
            </div>

            {/* CTA */}
            <motion.div
              className="oswald relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-widest sm:tracking-[0.15em] text-black shrink-0 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #d4af37, #f5e678, #d4af37)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)',
                  animation: 'btnShine 2s infinite linear'
                }}
                aria-hidden="true"
              />
              <span className="relative z-10 hidden sm:inline">Get Tickets</span>
              <span className="relative z-10 sm:hidden">Buy</span>
              <ChevronRight
                className="relative z-10 w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </motion.div>
          </div>

          {/* Gold bottom line */}
          <div
            className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)' }}
            aria-hidden="true"
          />
        </div>
      </Link>

      {/* Mute button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const next = !soundOn
          store.dispatch(setSoundOn(next))
          if (next) volumeOn()
          else volumeOff()
        }}
        aria-label={soundOn ? 'Mute sounds' : 'Unmute sounds'}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 focus:outline-none z-10 shrink-0"
        style={{
          background: 'linear-gradient(135deg, #1a1000, #2a1c00)',
          border: '1px solid rgba(212,175,55,0.4)',
          boxShadow: '0 0 12px rgba(212,175,55,0.15)'
        }}
      >
        {soundOn ? (
          <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" aria-hidden="true" />
        ) : (
          <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400/50" aria-hidden="true" />
        )}
      </motion.button>
    </div>
  )
}
