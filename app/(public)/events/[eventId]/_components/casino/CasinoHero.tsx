import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { CasinoCountdown } from './CasinoCountdown'
import { TCasinoHero } from '@/types/casino.types'
import { formatDate } from '@/app/lib/utils/date-utils'
import { formatTime } from '@/app/lib/utils/time-utils'
import Picture from '@/app/components/common/Picture'

export function CasinoHero({ data }: { data: TCasinoHero }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="pt-28 lg:pt-18 text-center flex flex-col items-center"
    >
      <Link href="/">
        <Picture
          src="/images/logo-1.webp"
          aria-hidden="true"
          className="w-14 h-fit object-contain opacity-[0.4] hover:opacity-100 duration-150 pointer-events-none select-none mb-2"
          priority={true}
        />
      </Link>

      {/* Org eyebrow */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div
          className="h-px w-10"
          style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }}
          aria-hidden="true"
        />
        <span className="oswald text-[11px] font-bold uppercase tracking-[0.3em] text-amber-400/60">
          Boys &amp; Girls Club of Lynn
        </span>
        <div
          className="h-px w-10"
          style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }}
          aria-hidden="true"
        />
      </div>

      {/* Tagline */}
      {data?.tagline && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[clamp(14px,3vw,20px)] italic text-white/30 tracking-[0.05em] mb-3"
        >
          {data.tagline}
        </motion.p>
      )}

      {/* Main title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="oswald font-black uppercase mb-3 leading-none tracking-tight"
        style={{
          fontSize: 'clamp(56px, 12vw, 120px)',
          background: 'linear-gradient(180deg, #fff 0%, #f5e678 30%, #d4af37 55%, #8b6914 80%, #d4af37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'goldPulse 4s ease-in-out infinite'
        }}
      >
        {data?.title ?? 'Cash Madness'}
      </motion.h1>

      {/* Subtitle */}
      {data?.subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="oswald font-light uppercase tracking-[0.3em] text-amber-600/40 mb-8"
          style={{ fontSize: 'clamp(18px, 4vw, 32px)' }}
        >
          {data.subtitle}
        </motion.p>
      )}

      {/* Grand prize callout */}
      {data?.raffleGrandPrizeLabel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-4 mb-9"
          style={{ animation: 'floatUp 3s ease-in-out infinite' }}
        >
          <span className="text-[28px] text-amber-500/50" aria-hidden="true">
            ✦
          </span>
          <div>
            <p className="oswald text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600/55 mb-1.5">
              Grand Prize
            </p>
            <p
              className="oswald font-black leading-none text-amber-300"
              style={{ fontSize: 'clamp(32px, 7vw, 60px)', textShadow: '0 0 40px rgba(212,175,55,0.8)' }}
            >
              {data.raffleGrandPrizeLabel}
            </p>
          </div>
          <span className="text-[28px] text-amber-500/50" aria-hidden="true">
            ✦
          </span>
        </motion.div>
      )}

      {/* Meta row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5 mb-10"
      >
        {[
          data?.date && {
            Icon: Calendar,
            value: formatDate(data.date, { weekday: 'long' })
          },
          data?.date && {
            Icon: Clock,
            value: formatTime(data.date) + ' EST'
          },
          data?.location && { Icon: MapPin, value: data.location }
        ]
          .filter(Boolean)
          .map(({ Icon, value }: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
              <span className="text-sm text-white/45 font-medium">{value}</span>
            </div>
          ))}
      </motion.div>

      {/* Suits row */}
      <div className="flex justify-center gap-5 mb-12 text-[28px] font-black" aria-hidden="true">
        {['♠', '♥', '♦', '♣'].map((s, i) => (
          <span key={s} className={`${i % 2 === 0 ? 'text-amber-500/50' : 'text-white/10'} suit`}>
            {s}
          </span>
        ))}
      </div>

      {/* Countdown */}
      {(() => {
        const now = new Date()
        const salesStarted = !data?.ticketSalesStartDate || new Date(data.ticketSalesStartDate) <= now

        if (!salesStarted && data?.ticketSalesStartDate) {
          return (
            <div className="inline-block">
              <p className="oswald text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600/50 mb-3 text-center">
                ✦ Tickets On Sale ✦
              </p>
              <CasinoCountdown target={data.ticketSalesStartDate} />
            </div>
          )
        }

        if (data?.raffleDrawDate) {
          return (
            <div className="inline-block">
              <p className="oswald text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600/50 mb-3 text-center">
                ✦ Draw Countdown ✦
              </p>
              <CasinoCountdown target={data.raffleDrawDate} />
            </div>
          )
        }

        return null
      })()}
    </motion.div>
  )
}
