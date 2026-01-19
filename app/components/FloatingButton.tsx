'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { MotionLink } from './common/MotionLink'
import { usePathname } from 'next/navigation'

export default function FloatingDonateButton() {
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()

  if (pathname === '/donate' || pathname.includes('/admin')) return

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        {/* Pulse Ring Background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
          from 0deg,
          #0284c7 0deg 90deg,
          #a855f7 90deg 180deg,
          #22c55e 180deg 270deg,
          #f97316 270deg 360deg
        )`
          }}
          animate={{
            boxShadow: isHovered
              ? [
                  '0 0 0 0px rgba(2, 132, 199, 0.7)',
                  '0 0 0 20px rgba(2, 132, 199, 0.3)',
                  '0 0 0 40px rgba(2, 132, 199, 0)'
                ]
              : '0 0 0 0px rgba(2, 132, 199, 0)'
          }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        />

        {/* Main Button */}
        <MotionLink
          href="/donate"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group cursor-pointer overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 50%, #22c55e 100%)'
          }}
          whileHover={{
            scale: 1.15,
            rotate: 360
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          {/* Rotating Border */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Heart Icon */}
          <motion.div
            className="relative z-10"
            animate={{
              scale: 1,
              opacity: 1
            }}
            transition={{ duration: 0.2 }}
          >
            <Heart className="w-7 h-7 text-white fill-white" />
          </motion.div>
        </MotionLink>

        {/* Floating Text Label */}
        <motion.div
          animate={{
            x: isHovered ? -30 : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="absolute right-20 top-1/2 -translate-y-1/2 whitespace-nowrap"
        >
          <div className="dark:bg-neutral-900 bg-white dark:border-neutral-800 border-neutral-200 rounded-lg px-4 py-2 border shadow-xl">
            <p className="dark:text-white text-neutral-900 font-bold text-sm">Make a Difference</p>
            <p className="dark:text-neutral-400 text-neutral-600 text-xs">Every gift helps</p>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
