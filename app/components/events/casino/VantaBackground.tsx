'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export function VantaBackgroundFog({ children }: { children: React.ReactNode }) {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (vantaEffect) return
    ;(window as any).THREE = THREE

    const init = async () => {
      const imported = await import('vanta/dist/vanta.fog.min')
      const FOG = imported.default
      if (!containerRef.current) return

      setVantaEffect(
        FOG({
          THREE,
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0x282828,
          midtoneColor: 0x2a2a2a,
          lowlightColor: 0x222222,
          baseColor: 0x0,
          blurFactor: 0.24,
          speed: 0.7,
          zoom: 3.0
        })
      )
    }

    init()

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 -z-10 bg-black" />
      <div className="relative z-0">{children}</div>
    </>
  )
}
export function VantaBackgroundWaves({ children }: { children: React.ReactNode }) {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (vantaEffect) return
    ;(window as any).THREE = THREE

    const init = async () => {
      const imported = await import('vanta/dist/vanta.waves.min')
      const WAVES = imported.default
      if (!containerRef.current) return

      setVantaEffect(
        WAVES({
          THREE,
          el: containerRef.current,
          mouseControls: false,
          touchControls: false,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          color: 0x0,
          shininess: 50,
          waveHeight: 10,
          waveSpeed: 0.75,
          zoom: 20
        })
      )
    }

    init()

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 -z-10 bg-black" />
      <div className="relative z-0">{children}</div>
    </>
  )
}

export function VantaBackgroundDots({ children }: { children: React.ReactNode }) {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (vantaEffect) return
    ;(window as any).THREE = THREE

    const init = async () => {
      const imported = await import('vanta/dist/vanta.dots.min')
      const DOTS = imported.default
      if (!containerRef.current) return

      setVantaEffect(
        DOTS({
          THREE,
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x5c5c5c,
          color2: 0x252525,
          backgroundColor: 0x0,
          size: 1.3,
          showLines: false
        })
      )
    }

    init()

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 -z-10 bg-black" />
      <div className="relative z-0">{children}</div>
    </>
  )
}

export function VantaBackgroundCells({ children }: { children: React.ReactNode }) {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (vantaEffect) return
    ;(window as any).THREE = THREE

    const init = async () => {
      const imported = await import('vanta/dist/vanta.cells.min')
      const CELLS = imported.default
      if (!containerRef.current) return

      setVantaEffect(
        CELLS({
          THREE,
          el: containerRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          color1: 0x0,
          color2: 0x373737,
          size: 0.9,
          speed: 2.0
        })
      )
    }

    init()

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 -z-10 bg-black" />
      <div className="relative z-0">{children}</div>
    </>
  )
}
