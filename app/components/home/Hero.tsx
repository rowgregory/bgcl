'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Heart, Play, Pause } from 'lucide-react'

// Respect reduced motion at the variant level
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, easing: 'easeOut', delay }
  })
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, easing: 'easeOut', delay }
  })
}

export const Hero = ({ hero }) => {
  const [isVideoPaused, setIsVideoPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parallax scroll effect on the video
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

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

  return (
    <div ref={containerRef} className="w-full h-225 overflow-hidden -mt-37.5 relative">
      {/* Video Background with parallax */}
      <motion.div className="absolute inset-0 motion-reduce:transform-none" style={{ y: videoY }}>
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
          <source src="/videos/landing.mov" type="video/mp4" />
        </video>

        {/* Fallback for reduced motion users */}
        <div className="absolute inset-0 bg-sky-900 hidden motion-reduce:block" aria-hidden="true" />
      </motion.div>

      {/* Dark Overlay — fades out subtly on scroll */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-linear-to-r from-black/50 via-black/60 to-black/50 dark:from-black/60 dark:via-black/75 dark:to-black/60"
      />

      {/* Content — subtle upward parallax on scroll */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-20"
      >
        <div className="max-w-6xl w-full gap-12 items-center">
          <div className="flex flex-col justify-start items-start sm:justify-center sm:items-center space-y-6">
            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="text-5xl md:text-6xl lg:text-7xl leading-tight uppercase tracking-tight text-white font-bold text-left sm:text-center"
            >
              {hero?.heading ?? 'Empowering Lynn Youth'}
            </motion.h1>

            {/* Body text */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="text-lg lg:text-center text-white leading-relaxed"
            >
              {hero?.bodyText}
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
              className="flex flex-col sm:flex-row sm:items-center gap-y-3 sm:gap-x-3"
            >
              {/* Primary Button */}
              {hero?.button1Link && (
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={hero.button1Link}
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-sky-500 to-sky-600 text-white font-semibold rounded-2xl transition-all overflow-hidden h-15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-600"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-linear-to-r from-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
                    />
                    <span className="relative z-10">{hero?.button1Text ?? 'Learn More'}</span>
                    <ArrowRight
                      aria-hidden="true"
                      className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </motion.div>
              )}

              {/* Secondary Button */}
              {hero?.button2Link && (
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={hero.button2Link}
                    aria-label={`${hero?.button2Text ?? 'Donate'} - opens in a new tab`}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 dark:bg-white/5 backdrop-blur-sm border-2 border-white/20 dark:border-white/10 hover:border-sky-500/50 text-white font-semibold rounded-2xl transition-all h-15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  >
                    <Heart
                      aria-hidden="true"
                      className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                      strokeWidth={2.5}
                    />
                    {hero?.button2Text ?? 'Donate'}
                  </a>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Pause/Play button — fades in after content */}
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
        className="absolute bottom-6 right-6 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {isVideoPaused ? (
          <Play aria-hidden="true" className="w-4 h-4" />
        ) : (
          <Pause aria-hidden="true" className="w-4 h-4" />
        )}
      </motion.button>
    </div>
  )
}
