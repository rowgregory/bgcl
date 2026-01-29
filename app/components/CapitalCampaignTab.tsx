'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, ArrowRight, ChevronUp } from 'lucide-react'

const CAPITAL_CAMPAIGN_LINKS = ['/admin/', '/program/', '/supporter']

export default function CapitalCampaignTab() {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(true)
  const [isMobileExpanded, setIsMobileExpanded] = useState(false)

  useEffect(() => {
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
  }, [])

  if (CAPITAL_CAMPAIGN_LINKS.some((link) => pathname.includes(link))) return null

  const goalAmount = 30000000
  const raisedAmount = 17071500
  const progressPercent = (raisedAmount / goalAmount) * 100

  return (
    <>
      {/* Desktop Version - Side Tab */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <AnimatePresence>
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
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
                      <span>{progressPercent.toFixed(2)}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${progressPercent}%` }}
                        className={`h-full bg-linear-to-r from-sky-500 to-sky-600 rounded-full`}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Click to learn more →</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Version - Bottom Sticky Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <AnimatePresence>
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative"
          >
            {/* Expandable content */}
            <AnimatePresence>
              {isMobileExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 overflow-hidden"
                >
                  <div className="px-4 py-3">
                    <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide mb-1">
                      Capital Campaign
                    </p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Help us build the future</p>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1.5">
                        <span>$17.1M raised</span>
                        <span>85%</span>
                      </div>
                      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-linear-to-r from-sky-500 to-sky-600 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main banner - always visible */}
            <Link
              href="/capital-campaign"
              className="block bg-linear-to-r from-sky-600 to-sky-700 text-white"
              onClick={(e) => {
                if (!isMobileExpanded) {
                  e.preventDefault()
                  setIsMobileExpanded(true)
                } else {
                  setIsMobileExpanded(false)
                }
              }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-90">Capital Campaign</p>
                    <p className="text-sm font-bold">$17.1M / $24.5M Goal</p>
                  </div>
                </div>

                {/* Toggle/Arrow button */}
                <motion.div
                  animate={{ rotate: isMobileExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronUp className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Progress bar on banner */}
              <div className="h-1 bg-sky-800/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  className="h-full bg-white/90"
                />
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
