'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const SUITS = ['♠', '♥', '♦', '♣']

export function CasinoIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'cards' | 'title' | 'done'>('cards')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('title'), 1200)
    const t2 = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, 3200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden"
          style={{ background: '#000' }}
          aria-hidden="true"
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700;900&display=swap');
            @keyframes goldPulse {
              0%,100% { text-shadow: 0 0 20px rgba(212,175,55,0.4); }
              50%      { text-shadow: 0 0 80px rgba(212,175,55,1), 0 0 120px rgba(212,175,55,0.6); }
            }
            @keyframes shimmer {
              0%   { background-position: -200% center; }
              100% { background-position:  200% center; }
            }
          `}</style>

          {/* Ambient radial glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
          />

          {/* ── Phase 1: Flying cards ── */}
          <AnimatePresence>
            {phase === 'cards' && (
              <>
                {SUITS.map((suit, i) => {
                  const angle = (i / 4) * Math.PI * 2
                  const startX = Math.cos(angle) * 600
                  const startY = Math.sin(angle) * 400
                  const delay = i * 0.08

                  const colors = [
                    'linear-gradient(135deg, #7f0000, #c0392b, #e74c3c)',
                    'linear-gradient(135deg, #6b2d00, #d4af37, #f5e678)',
                    'linear-gradient(135deg, #7f0000, #c0392b, #e74c3c)',
                    'linear-gradient(135deg, #3d006e, #7b2fbe, #a855f7)'
                  ]

                  return (
                    <motion.div
                      key={suit}
                      initial={{ x: startX, y: startY, opacity: 0, rotate: Math.random() * 360, scale: 0.5 }}
                      animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ scale: 20, opacity: 0 }}
                      transition={{ duration: 0.7, delay, ease: 'easeIn' }}
                      className="absolute flex items-center justify-center"
                      style={{
                        width: 100,
                        height: 140,
                        borderRadius: 8,
                        background: colors[i],
                        border: '1px solid rgba(255,255,255,0.15)',
                        boxShadow: `0 0 40px rgba(212,175,55,0.3), 0 20px 60px rgba(0,0,0,0.8)`,
                        fontSize: 56,
                        color: '#fff',
                        fontWeight: 900,
                        transformOrigin: 'center',
                        x: `${(i - 1.5) * 110}px`
                      }}
                    >
                      {suit}
                    </motion.div>
                  )
                })}
              </>
            )}
          </AnimatePresence>

          {/* ── Phase 2: Title reveal ── */}
          <AnimatePresence>
            {phase === 'title' && (
              <motion.div
                key="title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4 text-center px-4"
              >
                {/* Org */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }} />
                  <p
                    style={{
                      fontFamily: 'Oswald, sans-serif',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3em',
                      color: 'rgba(212,175,55,0.6)'
                    }}
                  >
                    Boys &amp; Girls Club of Lynn
                  </p>
                  <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
                </motion.div>

                {/* Main title */}
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: 'clamp(48px, 12vw, 96px)',
                    fontWeight: 900,
                    lineHeight: 0.9,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    backgroundImage:
                      'linear-gradient(90deg, #8b6914, #d4af37, #f5e678, #fff, #f5e678, #d4af37, #8b6914)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer 2s linear infinite'
                  }}
                >
                  Cash Madness
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: 'clamp(16px, 4vw, 28px)',
                    fontWeight: 300,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4em',
                    color: 'rgba(212,175,55,0.45)'
                  }}
                >
                  Casino Night
                </motion.p>

                {/* Suits */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex gap-5 text-2xl font-black"
                >
                  {SUITS.map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.07 }}
                      style={{ color: i % 2 === 0 ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.1)' }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Loading bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="w-48 mt-2"
                >
                  <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.9, duration: 1.2, ease: 'easeInOut' }}
                      style={{
                        height: '100%',
                        transformOrigin: 'left',
                        background: 'linear-gradient(90deg, #d4af37, #f5e678)'
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
