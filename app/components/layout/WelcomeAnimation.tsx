'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Picture from '../common/Picture'

export default function WelcomeAnimation() {
  const [isVisible, setIsVisible] = useState(() => {
    // Check localStorage on initial render
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('hasSeenWelcome')
    }
    return true
  })
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    if (!isVisible) return // Already hidden, no need to run timers

    const logoTimer = setTimeout(() => setShowLogo(true), 800)
    const exitTimer = setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem('hasSeenWelcome', 'true')
    }, 4000)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(exitTimer)
    }
  }, [isVisible])

  // Boys & Girls Club colors
  const colors = [
    { base: 'rgb(34, 197, 94)', light: 'rgb(134, 239, 172)', name: 'green' }, // green-500, green-300
    { base: 'rgb(59, 130, 246)', light: 'rgb(147, 197, 253)', name: 'blue' }, // blue-500, blue-300
    { base: 'rgb(168, 85, 247)', light: 'rgb(216, 180, 254)', name: 'purple' }, // purple-500, purple-300
    { base: 'rgb(249, 115, 22)', light: 'rgb(253, 186, 116)', name: 'orange' } // orange-500, orange-300
  ]

  // Generate matrix columns with characters and random colors
  const columns = Array.from({ length: 40 }, (_, i) => {
    const colorScheme = colors[Math.floor(Math.random() * colors.length)]
    const text = 'Boys & Girls Club of Lynn'

    return {
      id: i,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: colorScheme,
      // Repeat the text to fill the column
      chars: Array.from({ length: 15 }, (_, idx) => text[idx % text.length])
    }
  })

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Welcome screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-9999 bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Screen reader narrative */}
          <div aria-live="polite" aria-atomic="false" className="sr-only">
            {isVisible && !showLogo && (
              <p>
                Welcome screen loading. A digital rain animation is falling across the screen in Boys and Girls Club
                colors — blue, green, orange, and purple.
              </p>
            )}
            {showLogo && (
              <>
                <p>
                  The Boys and Girls Club of Lynn logo assembles on screen with a glitch effect, accompanied by a
                  rainbow scan line sweeping downward across the logo.
                </p>
                <p>Text appears letter by letter reading: System Initialized.</p>
              </>
            )}
          </div>
          {/* Digital rain — decorative, hidden from screen readers */}
          <div aria-hidden="true">
            {columns.map((col) => (
              <motion.div
                key={col.id}
                initial={{ y: -500 }}
                animate={{ y: window.innerHeight + 100 }}
                transition={{
                  duration: col.duration,
                  delay: col.delay,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute top-0 flex flex-col gap-1 font-mono text-lg sm:text-xl font-bold"
                style={{ left: `${(col.id / 40) * 100}%` }}
              >
                {col.chars.map((char, idx) => (
                  <motion.span
                    key={idx}
                    animate={{
                      opacity: [0.1, 1, 0.1],
                      color: [col.color.base, col.color.light, col.color.base]
                    }}
                    transition={{ duration: 0.5, delay: idx * 0.05, repeat: Infinity }}
                    style={{ color: col.color.base, textShadow: `0 0 10px ${col.color.base}` }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Logo assembly */}
          {showLogo && (
            <motion.div className="relative z-10" aria-hidden="true">
              {/* Glitch layer — decorative */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0], x: [-5, 5, -5, 5, 0], y: [-5, 5, -5, 5, 0] }}
                transition={{ duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }}
                className="absolute inset-0"
              >
                <Picture
                  src="/images/horizontal-logo-dark.png"
                  className="w-72 sm:w-md opacity-50 mix-blend-screen filter hue-rotate-180"
                  priority={true}
                />
              </motion.div>

              {/* Main logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 1 }}
                className="relative"
              >
                <Picture
                  src="/images/horizontal-logo-dark.png"
                  alt="Boys & Girls Club of Lynn"
                  className="w-72 sm:w-md"
                  priority={true}
                />
                {/* Scan line — decorative */}
                <motion.div
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-1 opacity-50 blur-sm"
                  style={{
                    background:
                      'linear-gradient(90deg, rgb(34, 197, 94), rgb(59, 130, 246), rgb(168, 85, 247), rgb(249, 115, 22))'
                  }}
                />
              </motion.div>

              {/* Typing text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-center"
              >
                <motion.p
                  initial={{ width: 0 }}
                  animate={{ width: 'auto' }}
                  transition={{ duration: 1.5, ease: 'linear' }}
                  className="text-2xl sm:text-4xl font-mono font-bold inline-block overflow-hidden whitespace-nowrap border-r-4"
                  style={{
                    background:
                      'linear-gradient(90deg, rgb(34, 197, 94), rgb(59, 130, 246), rgb(168, 85, 247), rgb(249, 115, 22))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    borderColor: 'rgb(59, 130, 246)'
                  }}
                >
                  SYSTEM INITIALIZED_
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* Grid background — decorative */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(168, 85, 247, .3) 75%, rgba(168, 85, 247, .3) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .3) 25%, rgba(34, 197, 94, .3) 26%, transparent 27%, transparent 74%, rgba(249, 115, 22, .3) 75%, rgba(249, 115, 22, .3) 76%, transparent 77%, transparent)
          `,
              backgroundSize: '50px 50px'
            }}
          />

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => {
              setIsVisible(false)
              localStorage.setItem('hasSeenWelcome', 'true')
            }}
            aria-label="Skip welcome screen"
            className="absolute top-8 right-8 text-white/80 hover:text-white text-sm font-mono font-semibold px-4 py-2 border border-white/30 rounded hover:bg-white/10 transition-all z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            [SKIP]
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
