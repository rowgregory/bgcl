import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { IHero } from '@/types/entities/hero'

const FloatingButton = ({ hero }: { hero: IHero }) => {
  const [isHovered, setIsHovered] = useState(false)

  const positionClasses = {
    'top-left': 'top-8 left-8',
    'top-right': 'top-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'bottom-right': 'bottom-8 right-8'
  }

  const icons = {
    none: null,
    arrow: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    ),
    phone: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    email: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    chat: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    help: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )
  }

  const handleClick = () => {
    if (hero.floatingButtonAction === 'modal') {
      alert('Modal would open here')
    } else if (hero.floatingButtonAction === 'drawer') {
      alert('Drawer would slide in here')
    } else if (hero.floatingButtonAction === 'internal') {
    } else if (hero.floatingButtonAction === 'external') {
      window.open(hero.floatingButtonLink, '_blank')
    }
  }

  // Get animation based on type
  const getAnimation = () => {
    const base = { opacity: 1, scale: 1 }

    switch (hero.floatingButtonAnimation) {
      case 'pulse':
        return { ...base, scale: [1, 1.05, 1] }
      case 'bounce':
        return { ...base, y: [0, -10, 0] }
      case 'shake':
        return { ...base, x: [0, -5, 5, -5, 5, 0] }
      default:
        return base
    }
  }

  const getTransition = () => {
    const baseTransition = {
      opacity: { duration: 0.5, delay: 1 },
      scale: { duration: 0.5, delay: 1 }
    }

    switch (hero.floatingButtonAnimation) {
      case 'pulse':
        return {
          ...baseTransition,
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: 1.5
          }
        }
      case 'bounce':
        return {
          ...baseTransition,
          y: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: 1.5
          }
        }
      case 'shake':
        return {
          ...baseTransition,
          x: {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 1.5
          }
        }
      default:
        return baseTransition
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={getAnimation()}
      transition={getTransition()}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={`absolute ${positionClasses[hero.floatingButtonPosition]} z-50 flex items-center gap-2 px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all overflow-hidden`}
      style={{
        backgroundColor: hero.floatingButtonBgColor,
        color: hero.floatingButtonTextColor,
        borderRadius: `${hero.floatingButtonBorderRadius}px`,
        boxShadow: isHovered
          ? `0 15px 35px ${hero.floatingButtonBgColor}60`
          : `0 10px 25px ${hero.floatingButtonBgColor}40`
      }}
    >
      {hero.floatingButtonIcon !== 'none' && (
        <motion.div animate={{ rotate: isHovered ? [0, -10, 10, -10, 0] : 0 }} transition={{ duration: 0.5 }}>
          {icons[hero.floatingButtonIcon]}
        </motion.div>
      )}

      <span className="relative z-10">{hero.floatingButtonText}</span>

      {/* Ripple effect for pulse animation */}
      {hero.floatingButtonAnimation === 'pulse' && (
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            backgroundColor: hero.floatingButtonBgColor,
            borderRadius: `${hero.floatingButtonBorderRadius}px`
          }}
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: [1, 1.5],
            opacity: [0.5, 0]
          }}
          transition={{
            delay: 1.5,
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut' as const
          }}
        />
      )}

      {/* Hover shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0"
        animate={
          isHovered
            ? {
                x: ['-100%', '100%'],
                opacity: [0, 0.2, 0]
              }
            : {}
        }
        transition={{
          duration: 0.6,
          ease: 'easeInOut' as const
        }}
        style={{
          borderRadius: `${hero.floatingButtonBorderRadius}px`
        }}
      />
    </motion.button>
  )
}

export default FloatingButton
