'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Heart, Play, Pause } from 'lucide-react'
import { IHero } from '@/types/entities/hero'
import { fadeIn, fadeUp } from '@/lib/constants/motion'
import { HeroCountdown } from './HeroCountdown'
import Thermometer from './Thermometer'
import GrowthTree from './GrowthTree'

export const Hero = ({ hero }: { hero: IHero | null }) => {
  const [isVideoPaused, setIsVideoPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const overlayOp = useTransform(scrollYProgress, [0, 0.8], [0, 0.4])

  const isVideo = hero?.backgroundType === 'video'

  const activeWidgets = [hero?.showCountdown, hero?.showThermometer, hero?.showGrowthTree].filter(Boolean).length

  const heroHeight = 800 + activeWidgets * 120

  const toggleVideo = () => {
    if (!videoRef.current) return
    if (isVideoPaused) {
      videoRef.current.play()
      setIsVideoPaused(false)
    } else {
      videoRef.current.pause()
      setIsVideoPaused(true)
    }
  }

  /* ── Shared CTA class ─────────────────────────────────────────────── */
  const cta1Class =
    'group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-2xl transition-all overflow-hidden h-15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-600'
  const cta2Class =
    'group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 dark:bg-white/5 backdrop-blur-sm border-2 border-white/20 dark:border-white/10 hover:border-sky-500/50 text-white font-semibold rounded-2xl transition-all h-15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
  const cta1Glow = (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-linear-to-r from-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
    />
  )

  return (
    <div ref={containerRef} className="w-full overflow-hidden relative" style={{ height: `${heroHeight}px` }}>
      {/* ── Background ────────────────────────────────────────────────── */}
      <motion.div className="absolute inset-0 z-0 motion-reduce:transform-none" style={{ y: videoY }}>
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              role="presentation"
              className="w-full h-full object-cover scale-130 motion-reduce:hidden"
            >
              <source src={hero?.backgroundVideo} type="video/mp4" />
              <source src={hero?.backgroundVideo} type="video/quicktime" />
            </video>
            <div className="absolute inset-0 bg-sky-900 hidden motion-reduce:block" aria-hidden="true" />
          </>
        ) : (
          <img src={hero?.backgroundImage} alt="" aria-hidden="true" className="w-full h-full object-cover scale-130" />
        )}
      </motion.div>

      {/* ── Static overlay ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ backgroundColor: `rgba(0, 0, 0, ${hero?.overlayOpacity ?? 0.5})` }}
        className="absolute top-0 left-0 right-0 bottom-0 z-10 w-full h-full"
      />

      {/* ── Scroll-driven vignette ────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: overlayOp }}
        className="absolute inset-0 z-20 bg-linear-to-r from-black/50 via-black/60 to-black/50 dark:from-black/60 dark:via-black/75 dark:to-black/60"
      />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-30 h-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-20"
      >
        <div className="max-w-6xl w-full">
          <div className="flex flex-col justify-start items-start sm:justify-center sm:items-center space-y-6">
            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-5xl md:text-6xl lg:text-7xl leading-tight uppercase tracking-tight text-white font-bold text-left sm:text-center"
            >
              {hero?.title ?? 'Empowering Lynn Youth'}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="text-lg lg:text-center text-white leading-relaxed"
            >
              {hero?.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
              className="flex flex-col sm:flex-row sm:items-center gap-y-3 sm:gap-x-3"
            >
              {hero?.cta1Link && (
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {hero.cta1LinkType === 'external' ? (
                    <a
                      href={hero.cta1Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${hero.cta1Text} — opens in a new tab`}
                      className={cta1Class}
                    >
                      {cta1Glow}
                      <span className="relative z-10">{hero.cta1Text}</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"
                      />
                    </a>
                  ) : (
                    <Link href={hero.cta1Link} className={cta1Class}>
                      {cta1Glow}
                      <span className="relative z-10">{hero.cta1Text}</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  )}
                </motion.div>
              )}

              {hero?.showCta2 && hero?.cta2Link && (
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {hero.cta2LinkType === 'external' ? (
                    <a
                      href={hero.cta2Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${hero.cta2Text} — opens in a new tab`}
                      className={cta2Class}
                    >
                      <Heart
                        aria-hidden="true"
                        className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                        strokeWidth={2.5}
                      />
                      {hero.cta2Text}
                    </a>
                  ) : (
                    <Link href={hero.cta2Link} className={cta2Class}>
                      <Heart
                        aria-hidden="true"
                        className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                        strokeWidth={2.5}
                      />
                      {hero.cta2Text}
                    </Link>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Widgets */}
            {activeWidgets > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.7}
                className="flex flex-wrap justify-center items-end gap-6"
              >
                <HeroCountdown hero={hero} />
                <Thermometer hero={hero} />
                <GrowthTree hero={hero} />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Pause/Play ────────────────────────────────────────────────── */}
      {isVideo && (
        <motion.button
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={0.9}
          onClick={toggleVideo}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isVideoPaused ? 'Play background video' : 'Pause background video'}
          aria-pressed={isVideoPaused}
          className="absolute bottom-6 right-6 z-40 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {isVideoPaused ? (
            <Play aria-hidden="true" className="w-4 h-4" />
          ) : (
            <Pause aria-hidden="true" className="w-4 h-4" />
          )}
        </motion.button>
      )}
    </div>
  )
}
