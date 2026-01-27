'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign } from 'lucide-react'

interface Donation {
  customerName: string
  id: string
  amount: number
  donorName: string
  startDate: Date
  createdAt: Date
}

export default function DonationNotification({ donations }) {
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(donations[0])
  const [isVisible, setIsVisible] = useState(true)
  const indexRef = useRef(0)
  const timersRef = useRef<NodeJS.Timeout[]>([])
  const pathname = usePathname()

  useEffect(() => {
    setCurrentDonation(donations[0])
    setIsVisible(true)
    indexRef.current = 0

    const runCycle = () => {
      // Hide after 5 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false)

        // Wait 15 seconds, then show next donation
        const showTimer = setTimeout(() => {
          indexRef.current = (indexRef.current + 1) % donations.length
          setCurrentDonation(donations[indexRef.current])
          setIsVisible(true)
          runCycle()
        }, 15000)

        timersRef.current.push(showTimer)
      }, 5000)

      timersRef.current.push(hideTimer)
    }

    runCycle()

    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer))
      timersRef.current = []
    }
  }, [donations])

  if (['/admin/', '/program/', '/supporter'].some((link) => pathname.includes(link))) return null

  function getTimeAgo(timestamp: string | Date): string {
    // Convert to Date if it's a string
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Just now'
    }

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <AnimatePresence mode="wait">
      {currentDonation && isVisible && (
        <>
          {/* Desktop Version - Bottom Left */}
          <motion.div
            key={`desktop-${currentDonation.id}-${indexRef.current}`}
            initial={{ opacity: 0, x: -400, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -400, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed bottom-6 left-6 z-50 w-80 hidden md:block"
          >
            <div className="dark:bg-neutral-900/95 dark:border-neutral-800 bg-white/95 border-neutral-200 rounded-2xl shadow-2xl border overflow-hidden backdrop-blur-xl">
              {/* Header with linear */}
              <div className="bg-linear-to-r from-sky-500 to-sky-600 px-4 py-3 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <DollarSign className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className="text-white font-semibold text-sm">New Donation</span>
                  </div>
                  <span className="text-white/80 text-xs">{getTimeAgo(currentDonation.startDate)}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-4">
                  <p className="dark:text-white text-neutral-900 font-black text-3xl mb-1">
                    ${(currentDonation.amount / 100).toFixed(2)}
                  </p>
                  <p className="dark:text-neutral-400 text-neutral-600 text-sm">
                    from{' '}
                    <span className="font-semibold dark:text-neutral-300 text-neutral-700">
                      {currentDonation.donorName ?? currentDonation.customerName}
                    </span>
                  </p>
                </div>

                {/* Footer with links */}
                <div className="flex items-center justify-between pt-3 border-t dark:border-neutral-800 border-neutral-200">
                  <Link href="/donate" className="text-sm font-semibold dark:text-sky-400 text-sky-600 hover:underline">
                    Donate Now →
                  </Link>
                  <a
                    href="https://sqysh.io?lead_source=bgcl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs dark:text-neutral-500 text-neutral-500 hover:dark:text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    Powered by Sqysh
                  </a>
                </div>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-1 bg-linear-to-r from-sky-500 to-sky-600 origin-left"
              />
            </div>
          </motion.div>
          {/* Mobile Version - Bottom (Full Width, Covers Campaign Banner) */}
          <motion.div
            key={`mobile-${currentDonation.id}-${indexRef.current}`}
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 200 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-60 md:hidden"
          >
            <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 shadow-2xl border-t overflow-hidden">
              {/* Progress bar at top */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-1 bg-linear-to-r from-sky-500 to-sky-600 origin-left"
              />

              {/* Header with linear */}
              <div className="bg-linear-to-r from-sky-500 to-sky-600 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-white font-semibold text-sm block">New Donation</span>
                      <span className="text-white/80 text-xs">
                        {getTimeAgo(currentDonation?.startDate || currentDonation?.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-2xl leading-none">
                      ${(currentDonation.amount / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-3">
                <p className="dark:text-neutral-400 text-neutral-600 text-sm mb-3">
                  from{' '}
                  <span className="font-semibold dark:text-neutral-200 text-neutral-800">
                    {currentDonation.donorName}
                  </span>
                </p>

                {/* Footer with links */}
                <div className="flex items-center justify-between">
                  <Link
                    href="/donate"
                    className="text-sm font-semibold dark:text-orange-400 text-orange-600 hover:underline flex items-center gap-1"
                  >
                    Donate Now →
                  </Link>
                  <a
                    href="https://sqysh.io?lead_source=bgcl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs dark:text-neutral-500 text-neutral-400 hover:dark:text-neutral-400 hover:text-neutral-500 transition-colors"
                  >
                    Powered by Sqysh
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
