'use client'

import { motion } from 'framer-motion'
import { GalaAddToCartToast, GalaFooter, GalaTicketSection, GalaVideoBand } from './index'
import { GalaHero } from './GalaHero'
import { GalaCountdown } from './GalaCountdown'
import { GalaAboutSection } from './GalaAboutSection'
import { useAutoplayVideo } from '@/lib/hooks/useAutoPlayVideo'
import { EASE } from '@/lib/constants/motion'
import { useCartCount, useCartTotal } from '@/stores/useCartStore'
import { formatCurrency } from '@/lib/utils/currency.utils'
import Link from 'next/link'

/** For sections below the fold — plays once, when scrolled to. */
const enterOnView = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease: EASE }
}

export function GalaEventClient({ data: event }) {
  const videoRef = useAutoplayVideo()
  const cartCount = useCartCount()
  const total = useCartTotal()

  return (
    <>
      <GalaAddToCartToast />

      {cartCount > 0 && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          className="fixed left-0 right-0 bottom-0 z-100 border-t border-white/10 bg-[#12121c]/95 px-5 py-3 backdrop-blur-md lg:hidden"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm">
              <span className="font-bold">{cartCount}</span> selected
              <span className="ml-2 text-white/50">{formatCurrency(total)}</span>
            </p>
            <Link
              href="/checkout"
              className="rounded-md bg-[#9b1b3c] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em]"
            >
              Checkout
            </Link>
          </div>
        </motion.div>
      )}

      <div className="min-h-screen bg-[#0a0a12] text-white">
        {/* —— Hero —— */}
        <GalaHero event={event} videoRef={videoRef} />

        {/* —— Countdown —— */}
        <GalaCountdown event={event} />

        <div className="relative z-10 bg-[#0a0a12]">
          <div
            className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-linear-to-b from-transparent to-[#0a0a12]"
            aria-hidden="true"
          />

          <div className="px-5 sm:px-8">
            {/* —— About —— */}
            {event.description && <GalaAboutSection event={event} />}

            <GalaVideoBand className="h-72 lg:h-100">
              <motion.div {...enterOnView} className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-end">
                <h2 className="text-6xl font-black uppercase tracking-tight sm:text-7xl lg:text-8xl">Tickets</h2>
                {event.tagline && (
                  <p className="max-w-sm text-sm leading-relaxed text-white/70 lg:pb-3">{event.tagline}</p>
                )}
              </motion.div>
            </GalaVideoBand>

            {/* —— Tickets —— */}
            <motion.div {...enterOnView}>
              <GalaTicketSection
                tickets={event.tickets}
                eventTitle={event.title}
                ticketSalesStartDate={event.ticketSalesStartDate}
                ticketSalesEndDate={event.ticketSalesEndDate}
                blurb={event.tagline}
              />
            </motion.div>

            <GalaFooter missionStatement={event.missionStatement} host={event.host} />
          </div>
        </div>
      </div>
    </>
  )
}
