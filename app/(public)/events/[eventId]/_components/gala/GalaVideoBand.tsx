'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type Props = {
  /** Band height. Tailwind arbitrary values are fine, e.g. 'h-80 lg:h-100'. */
  className?: string
  /** Sits over the footage — a section heading, usually. */
  children?: ReactNode
  src?: string
  poster?: string
}

/**
 * A shallow band of the waves footage, faded to the page ground at both edges
 * and parallaxed as it passes. Meant to sit between two flat sections.
 */
export function GalaVideoBand({
  className = 'h-72 lg:h-96',
  children,
  src = '/videos/silver',
  poster = '/images/silver-poster.jpg'
}: Props) {
  const bandRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Runs from the band entering the viewport to it leaving
  const { scrollYProgress } = useScroll({ target: bandRef, offset: ['start end', 'end start'] })

  // Drifts slower than the page, and dims at both ends of the pass
  const y = useTransform(scrollYProgress, [0, 1], ['-14%', '14%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => (q.matches ? el.pause() : void el.play().catch(() => {}))

    apply()
    q.addEventListener('change', apply)
    return () => q.removeEventListener('change', apply)
  }, [])

  return (
    <div ref={bandRef} className={`relative -mx-5 overflow-hidden sm:-mx-8 ${className}`}>
      {/* Over-tall so the parallax shift never exposes an edge */}
      <motion.div style={{ y, opacity }} className="absolute inset-x-0 -top-[14%] h-[128%]" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          className="h-full w-full object-cover"
        >
          <source src={`${src}.mp4`} type="video/mp4" />
          <source src={`${src}.webm`} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-[#0a0a12]/50" />
      </motion.div>

      {/* Fades into the flat sections above and below */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-[#0a0a12] to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#0a0a12] to-transparent"
        aria-hidden="true"
      />

      {children && (
        <div className="relative flex h-full items-end px-5 pb-10 sm:px-8">
          <div className="mx-auto w-full max-w-325">{children}</div>
        </div>
      )}
    </div>
  )
}
