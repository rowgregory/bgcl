'use client'

import { useEffect, useRef, type RefObject } from 'react'

/**
 * Autoplays a looping background video, and holds it on the first frame for
 * anyone who has asked for reduced motion. Returns the ref to attach.
 */
export function useAutoplayVideo(): RefObject<HTMLVideoElement | null> {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')

    const apply = () => {
      if (query.matches) el.pause()
      // Autoplay can still be refused (low power mode, for one) — not our problem
      else void el.play().catch(() => {})
    }

    apply()
    query.addEventListener('change', apply)

    return () => query.removeEventListener('change', apply)
  }, [])

  return videoRef
}
