import { formatDate } from '@/lib/utils/date-utils'
import { motion } from 'framer-motion'
import { useCountdown } from '@/lib/hooks/useCountdown'
import { MapPin } from 'lucide-react'
import { EASE } from '@/lib/constants/motion'

const pad = (n: number) => String(n).padStart(2, '0')

export function GalaCountdown({ event }) {
  const c = useCountdown(event.date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
      className="relative z-20 mx-auto -mt-32 max-w-325 px-5 sm:px-8"
    >
      <div className="rounded-xl border border-white/15 bg-linear-to-t from-[#12121c] via-transparent to-transparent px-6 py-7 shadow-2xl shadow-black/60 backdrop-blur-md sm:px-9">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          {!c.done ? (
            <>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold sm:text-3xl">Reserve your seat</p>
                {event.ticketSalesStartDate && (
                  <p className="mt-1 text-sm text-white/50">
                    Tickets on sale{' '}
                    {formatDate(new Date(event.ticketSalesStartDate), { month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>

              <div className="flex gap-8 sm:gap-11">
                {[
                  { v: c.days, l: 'Days' },
                  { v: c.hours, l: 'Hours' },
                  { v: c.minutes, l: 'Minutes' },
                  { v: c.seconds, l: 'Seconds' }
                ].map((u) => (
                  <div key={u.l} className="text-center">
                    <span className="block text-3xl font-bold tabular-nums sm:text-4xl">{pad(u.v)}</span>
                    <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-[0.15em] text-white/40">
                      {u.l}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="w-full text-center text-lg font-semibold">This event has taken place.</p>
          )}

          {event.address && (
            <div className="flex items-start gap-3 text-sm leading-relaxed text-white/70 lg:max-w-50">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
              <span>{event.address}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
