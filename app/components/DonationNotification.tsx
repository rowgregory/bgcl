'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Donation {
  id: string
  donorName: string
  amount: number
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

  return (
    <AnimatePresence mode="wait">
      {currentDonation && isVisible && (
        <motion.div
          key={`${currentDonation.id}-${indexRef.current}`}
          initial={{ opacity: 0, x: -400, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -400, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 z-50"
        >
          <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-xl shadow-2xl border overflow-hidden backdrop-blur-sm dark:backdrop-blur-md">
            {/* Gradient accent bar */}
            <div className="h-1 bg-linear-to-r from-sky-500 to-sky-600" />

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Heart Icon */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="shrink-0"
                >
                  <div className="w-10 h-10 dark:bg-red-500/20 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                </motion.div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <p className="dark:text-neutral-300 text-neutral-700 text-sm">
                    <span className="font-semibold dark:text-white text-neutral-900">{currentDonation.donorName}</span>{' '}
                    donated
                  </p>
                  <p className="text-lg font-bold dark:text-sky-400 text-sky-600">
                    ${currentDonation.amount.toFixed(2)}
                  </p>
                  <p className="text-xs dark:text-neutral-500 text-neutral-500 mt-1">
                    Thank you for supporting our mission!
                  </p>
                </div>
              </div>
            </div>

            {/* Progress bar - 5 seconds visible */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5, ease: 'linear' }}
              className="h-1 dark:bg-neutral-800 bg-neutral-200 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
