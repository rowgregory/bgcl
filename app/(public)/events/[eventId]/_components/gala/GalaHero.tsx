import { useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { Eyebrow } from './Eyebrow'
import { formatDate } from '@/lib/utils/date-utils'
import { GalaTicketMarquee } from './GalaTicketMarquee'
import { EASE, riseUp, stagger } from '@/lib/constants/motion'
import { GalaSignIn } from './GalaSignIn'

export function GalaHero({ event, videoRef }) {
  const heroRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  // Backdrop fades and settles as the hero scrolls out from over it
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const videoOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  // Hero copy drifts up a little faster than the page, so it detaches
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const eventDate = new Date(event.date)

  return (
    <>
      {/* —— Video —— */}
      <motion.div
        style={reduced ? undefined : { opacity: videoOpacity, scale: videoScale }}
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/silver-2-poster.jpg"
          className="h-full w-full object-cover"
        >
          <source src="/videos/silver-2.mp4" type="video/mp4" />
          <source src="/videos/silver-2.webm" type="video/webm" />
        </video>

        {/* Scrims: hold the middle open for the title, close the edges down */}
        <div className="absolute inset-0 bg-[#0a0a12]/55" />
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0a12] via-transparent to-[#0a0a12]" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(10,10,18,0.7) 78%)' }}
        />
      </motion.div>

      {/* —— Hero —— */}
      <header ref={heroRef} className="relative z-10 min-h-150 lg:min-h-200">
        <div className="relative mx-auto flex min-h-150 max-w-325 flex-col px-5 pb-44 pt-8 sm:px-8 sm:pt-10 lg:min-h-200 lg:pb-52">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <Link
              href="/events"
              className="inline-flex w-fit items-center gap-1.5 rounded px-1 py-1 text-sm font-medium text-white/60 transition-colors hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a12]"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              All Events
            </Link>

            <GalaSignIn />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            style={reduced ? undefined : { y: heroY, opacity: heroFade }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            {event.subtitle && (
              <motion.div variants={riseUp}>
                <Eyebrow>{event.subtitle}</Eyebrow>
              </motion.div>
            )}

            {/* Small caps line over the foil script, as on the invitation */}
            <h1 className="mt-5">
              {event.titlePrefix && (
                <motion.span
                  variants={riseUp}
                  className="block text-lg font-semibold uppercase tracking-[0.45em] text-white sm:text-2xl"
                >
                  {event.titlePrefix}
                </motion.span>
              )}
              {/* The script gets its own, slower entrance */}
              <motion.span
                initial={{ opacity: 0, y: 34, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.1, delay: 0.34, ease: EASE }}
                className="foil-text block pb-8 font-pinyon text-7xl leading-[1.05] sm:text-8xl lg:text-[10rem]"
              >
                {event.titleScript || event.title}
              </motion.span>
            </h1>

            {/* Date and venue, inline */}
            <motion.div variants={riseUp} className="flex flex-col items-center gap-3 sm:flex-row sm:gap-10">
              <p className="flex items-center gap-2.5 text-base text-white/90">
                <CalendarDays className="h-4.5 w-4.5 shrink-0 text-cyan-400" aria-hidden="true" />
                {formatDate(eventDate, { month: 'long', day: 'numeric', year: 'numeric' })}
                <span className="text-white/50">
                  · {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </p>

              <p className="flex items-center gap-2.5 text-base text-white/90">
                <MapPin className="h-4.5 w-4.5 shrink-0 text-cyan-400" aria-hidden="true" />
                {event.location}
              </p>
            </motion.div>

            {/* Quick add */}
            {event.tickets?.length > 0 && (
              <motion.div variants={riseUp} className="mt-14 w-full max-w-120">
                <GalaTicketMarquee
                  tickets={event.tickets}
                  eventId={event.id}
                  eventTitle={event.title}
                  ticketSalesStartDate={event.ticketSalesStartDate}
                  ticketSalesEndDate={event.ticketSalesEndDate}
                  fadeColor="transparent"
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </header>
    </>
  )
}
