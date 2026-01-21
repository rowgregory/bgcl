'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Building2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CapitalCampaignTab() {
  const pathname = usePathname()
  const [isDismissed, setIsDismissed] = useState(false)
  const [isHovered, setIsHovered] = useState(true)

  useEffect(() => {
    if (isDismissed) return

    let isMounted = true

    const sequence = () => {
      if (!isMounted) return

      // Open
      setIsHovered(true)
      // Close after 4 seconds
      setTimeout(() => {
        if (!isMounted) return
        setIsHovered(false)
        // Re-open after 2 seconds
        setTimeout(() => {
          if (!isMounted) return
          sequence() // repeat the sequence
        }, 2000)
      }, 4000)
    }

    sequence()

    return () => {
      isMounted = false
    }
  }, [isDismissed])

  if (isDismissed || pathname.includes('/admin')) return null

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
      <AnimatePresence>
        <motion.div
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          exit={{ x: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Dismiss button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-white flex items-center justify-center transition-colors z-10"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>

          <Link
            href="/capital-campaign"
            className="group flex flex-col items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Tab */}
            <div
              className={`relative bg-linear-to-b from-sky-600 to-sky-700 text-white px-3 py-6 rounded-l-xl shadow-lg dark:shadow-sky-900/20 transition-all duration-300 ${
                isHovered ? 'from-sky-500 to-sky-600 pr-5' : ''
              }`}
            >
              {/* Vertical text */}
              <div
                className="text-sm font-semibold tracking-wide whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                CAPITAL CAMPAIGN
              </div>

              {/* Icon */}
              <div className="mt-4 flex justify-center">
                <Building2 className="w-5 h-5" />
              </div>

              {/* Arrow indicator with pulsing */}
              <motion.div
                className={`absolute left-1/2 -translate-x-1/2 bottom-2 transition-opacity ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                animate={{
                  y: [0, 3, 0],
                  scale: isHovered ? [1, 1.2, 1] : 1
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'loop'
                }}
              >
                <ArrowRight className="w-4 h-4 -rotate-90 text-white" />
              </motion.div>
            </div>

            {/* Expanded preview */}
            <div
              className={`absolute right-full top-1/2 -translate-y-1/2 mr-2 pointer-events-none transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl dark:shadow-neutral-950/50 p-4 w-64 border border-neutral-200 dark:border-neutral-800">
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide mb-1">
                  Capital Campaign
                </p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white mb-2">Help us build the future</p>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                    <span>$17.1M raised</span>
                    <span>85%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-linear-to-r from-sky-500 to-sky-600 rounded-full" />
                  </div>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Click to learn more →</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
