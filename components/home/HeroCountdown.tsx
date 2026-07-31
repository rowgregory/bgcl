'use client'

import { IHero } from '@/types/entities/hero'
import { useEffect, useState } from 'react'

/* ─── Types ──────────────────────────────────────────────────────────── */
interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface HeroCountdownProps {
  hero: IHero | null
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
const getTimeLeft = (targetDate: string): TimeLeft | null => {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

/* ─── Unit Block ─────────────────────────────────────────────────────── */
const Unit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
      {/* Card */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl" />
      {/* Number */}
      <span className="relative z-10 text-2xl sm:text-3xl font-black text-white tabular-nums leading-none">
        {pad(value)}
      </span>
    </div>
    <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{label}</span>
  </div>
)

/* ─── Separator ──────────────────────────────────────────────────────── */
const Sep = () => (
  <div className="flex flex-col gap-2 pb-5" aria-hidden="true">
    <div className="w-1 h-1 rounded-full bg-white/40" />
    <div className="w-1 h-1 rounded-full bg-white/40" />
  </div>
)

/* ─── Component ──────────────────────────────────────────────────────── */
export const HeroCountdown = ({ hero }: HeroCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!hero?.showCountdown || !hero?.countdownDate) return
    setMounted(true)
    setTimeLeft(getTimeLeft(hero.countdownDate))
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(hero.countdownDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [hero?.showCountdown, hero?.countdownDate])

  if (!hero?.showCountdown || !hero?.countdownDate || !mounted) return null

  return (
    <div
      className="inline-flex flex-col items-center gap-4"
      role="timer"
      aria-label={`${hero.countdownLabel}: ${timeLeft ? `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds` : 'Event has passed'}`}
      aria-live="off"
    >
      {/* Label */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-px bg-white/30" aria-hidden="true" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">{hero.countdownLabel}</p>
        <div className="w-8 h-px bg-white/30" aria-hidden="true" />
      </div>

      {timeLeft ? (
        <div className="flex items-end gap-2 sm:gap-3">
          <Unit value={timeLeft.days} label="Days" />
          <Sep />
          <Unit value={timeLeft.hours} label="Hours" />
          <Sep />
          <Unit value={timeLeft.minutes} label="Minutes" />
          <Sep />
          <Unit value={timeLeft.seconds} label="Seconds" />
        </div>
      ) : (
        <p className="text-sm font-semibold text-white/60 uppercase tracking-widest">Event has passed</p>
      )}
    </div>
  )
}
