'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { DollarSign } from 'lucide-react'
import { usePathname } from 'next/navigation'

const originalWarn = console.warn
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('non-static position')) return
  originalWarn(...args)
}

interface ICurrentDonation {
  id: string
  customerName: string
  customerEmail: string
  amount: number
  frequency: string
  nextBillingDate: string | Date
  startDate: string | Date
  status: string
  stripeSubscriptionId: string
  type: string
}

export default function DonationNotification({ donations }) {
  const [currentDonation, setCurrentDonation] = useState<ICurrentDonation | null>(donations[0])
  const [isVisible, setIsVisible] = useState(true)
  const indexRef = useRef(0)
  const timersRef = useRef<NodeJS.Timeout[]>([])
  const pathname = usePathname()

  const [gradient, setGradient] = useState('from-sky-500 to-cyan-600')

  useEffect(() => {
    const gradients = [
      'from-sky-500 to-cyan-600',
      'from-purple-500 to-indigo-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-orange-600'
    ]

    const getRandomGradient = (currentGradient: string) => {
      let next: string
      do {
        next = gradients[Math.floor(Math.random() * gradients.length)]
      } while (next === currentGradient)
      return next
    }

    setCurrentDonation(donations[0])
    setIsVisible(true)
    indexRef.current = 0
    let currentGradient = gradient

    const runCycle = (index: number) => {
      if (index >= donations.length) return

      const hideTimer = setTimeout(() => {
        setIsVisible(false)

        const showTimer = setTimeout(() => {
          const nextIndex = index + 1

          if (nextIndex < donations.length) {
            indexRef.current = nextIndex
            setCurrentDonation(donations[nextIndex])
            currentGradient = getRandomGradient(currentGradient)
            setGradient(currentGradient)
            setIsVisible(true)
            runCycle(nextIndex)
          }
        }, 15000)

        timersRef.current.push(showTimer)
      }, 5000)

      timersRef.current.push(hideTimer)
    }

    runCycle(0)

    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer))
      timersRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donations])

  if (['/admin/', '/program/', '/supporter', '/cart'].some((link) => pathname.includes(link))) return null

  function getTimeAgo(timestamp: string | Date): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp

    if (isNaN(date?.getTime())) return 'Just now'

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const donorName = currentDonation?.customerName ?? currentDonation?.customerName ?? 'A supporter'

  return (
    <AnimatePresence mode="wait">
      {currentDonation && isVisible && (
        <div aria-live="off">
          {/* Desktop Version - Bottom Left */}
          <motion.div
            key={`desktop-${currentDonation.id}-${indexRef.current}`}
            initial={{ opacity: 0, x: -400, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -400, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed bottom-6 left-6 z-50 w-80 hidden md:block"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`New donation from ${donorName}`}
          >
            <div className="dark:bg-neutral-900/95 dark:border-neutral-800 bg-white/95 border-neutral-200 rounded-2xl shadow-2xl border overflow-hidden backdrop-blur-xl">
              {/* Header */}
              <div className={`bg-linear-to-r ${gradient} px-4 py-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md"
                      aria-hidden="true"
                    >
                      <DollarSign className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-white font-semibold text-sm">New Donation</span>
                  </div>
                  <span className="text-white/80 text-xs" aria-hidden="true">
                    {getTimeAgo(currentDonation?.startDate)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-4">
                  <p className="dark:text-white text-neutral-900 font-bold text-lg mb-2">{donorName}</p>
                  <p className="dark:text-neutral-400 text-neutral-600 text-sm">became a supporter</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t dark:border-neutral-800 border-neutral-200">
                  <Link
                    href="/donate"
                    className="text-sm font-semibold underline hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    Join them
                    <span aria-hidden="true"> →</span>
                  </Link>

                  <a
                    href="https://sqysh.io?lead_source=bgcl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Powered by Sqysh - opens in a new tab"
                    className="text-xs dark:text-neutral-500 text-neutral-500 hover:dark:text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    Powered by Sqysh
                  </a>
                </div>
              </div>

              {/* Progress bar */}
              <div className={`h-1 bg-linear-to-r ${gradient}`} aria-hidden="true" />
            </div>
          </motion.div>

          {/* Mobile Version - Bottom Full Width */}
          <motion.div
            key={`mobile-${currentDonation.id}-${indexRef.current}`}
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 200 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-60 md:hidden"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`New donation from ${donorName}`}
          >
            <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 shadow-2xl border-t overflow-hidden">
              {/* Progress bar */}
              <div className="h-1 bg-linear-to-r from-sky-500 to-sky-600" aria-hidden="true" />

              {/* Header */}
              <div className="bg-linear-to-r from-sky-500 to-sky-600 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center" aria-hidden="true">
                    <DollarSign className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-semibold text-sm block">New Donation</span>
                    <span className="text-white/80 text-xs" aria-hidden="true">
                      {getTimeAgo(currentDonation?.startDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-3">
                <p className="dark:text-white text-neutral-900 font-semibold text-base mb-1">{donorName}</p>
                <p className="dark:text-neutral-400 text-neutral-600 text-sm mb-3">just became a supporter</p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <Link
                    href="/donate"
                    className="text-sm font-semibold underline hover:no-underline bg-linear-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    Join them
                    <span aria-hidden="true"> →</span>
                  </Link>

                  <a
                    href="https://sqysh.io?lead_source=bgcl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Powered by Sqysh - opens in a new tab"
                    className="text-xs dark:text-neutral-500 text-neutral-400 hover:dark:text-neutral-400 hover:text-neutral-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    Powered by Sqysh
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
