'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign } from 'lucide-react'

// Mock data type
interface Donation {
  id: string
  amount: number
  donorName: string
  timestamp: Date
}

// Mock donation data
const mockDonations: Donation[] = [
  { id: '1', donorName: 'Sarah Johnson', amount: 50, timestamp: new Date(Date.now() - 1000) },
  { id: '2', donorName: 'Michael Chen', amount: 100, timestamp: new Date(Date.now() - 5000) },
  { id: '3', donorName: 'Emily Davis', amount: 75, timestamp: new Date(Date.now() - 10000) },
  { id: '4', donorName: 'James Wilson', amount: 150, timestamp: new Date(Date.now() - 15000) },
  { id: '5', donorName: 'Lisa Anderson', amount: 200, timestamp: new Date(Date.now() - 20000) },
  { id: '6', donorName: 'Robert Taylor', amount: 125, timestamp: new Date(Date.now() - 25000) },
  { id: '7', donorName: 'Jennifer Brown', amount: 90, timestamp: new Date(Date.now() - 30000) },
  { id: '8', donorName: 'David Martinez', amount: 175, timestamp: new Date(Date.now() - 35000) }
]

export default function DonationNotification() {
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(mockDonations[0])
  const [isVisible, setIsVisible] = useState(true)
  const indexRef = useRef(0)
  const timersRef = useRef<NodeJS.Timeout[]>([])
  const pathname = usePathname()

  useEffect(() => {
    setCurrentDonation(mockDonations[0])
    setIsVisible(true)
    indexRef.current = 0

    const runCycle = () => {
      // Hide after 5 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false)

        // Wait 15 seconds, then show next donation
        const showTimer = setTimeout(() => {
          indexRef.current = (indexRef.current + 1) % mockDonations.length
          setCurrentDonation(mockDonations[indexRef.current])
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
  }, [])

  if (['/admin/', '/program/'].some((link) => pathname.includes(link))) return null

  function getTimeAgo(timestamp: Date): string {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000)

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
              <div className="bg-linear-to-r from-sky-500 to-sky-600 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">New Donation</span>
                  </div>
                  <span className="text-white/80 text-xs">{getTimeAgo(currentDonation.timestamp)}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <p className="dark:text-white text-neutral-900 font-bold text-xl mb-1">
                    ${currentDonation.amount.toFixed(2)}
                  </p>
                  <p className="dark:text-neutral-400 text-neutral-600 text-sm">
                    from{' '}
                    <span className="font-semibold dark:text-neutral-300 text-neutral-700">
                      {currentDonation.donorName}
                    </span>
                  </p>
                </div>

                {/* Footer with links */}
                <div className="flex items-center justify-between pt-3 border-t dark:border-neutral-800 border-neutral-200">
                  <Link
                    href="/donate"
                    className="text-sm font-semibold dark:text-orange-400 text-orange-600 hover:underline"
                  >
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
                      <span className="text-white/80 text-xs">{getTimeAgo(currentDonation.timestamp)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-2xl leading-none">${currentDonation.amount.toFixed(2)}</p>
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
