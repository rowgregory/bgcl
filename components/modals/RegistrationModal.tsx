'use client'

import { useState, useRef } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Picture from '../_shared/Picture'
import { useOverlayAccessibility } from '@/lib/hooks/useOverlayAccessibility'

export default function RegistrationModal({ modal }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(pathname === '/' && modal?.toggleModal)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useOverlayAccessibility(isOpen)

  // Trap focus inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
      return
    }

    if (e.key !== 'Tab') return

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    const modal = e.currentTarget as HTMLElement
    const focusableElements = Array.from(modal.querySelectorAll<HTMLElement>(focusableSelectors))
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (pathname !== '/' && !modal?.toggleModal) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 dark:bg-black/60 bg-white/60 backdrop-blur-sm z-110"
            aria-hidden="true"
          />

          {/* Modal container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-modal-heading"
            aria-describedby="registration-modal-description"
            onKeyDown={handleKeyDown}
            className="fixed inset-0 flex items-center justify-center z-120 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: 0.4
              }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass card */}
              <div className="relative bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden">
                {/* Close button */}
                <motion.button
                  ref={closeButtonRef}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="absolute top-5 right-5 z-10 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  aria-label="Close registration modal"
                >
                  <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
                </motion.button>

                {/* Content */}
                <div className="p-8 pt-10">
                  {/* Logo */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 flex justify-center"
                    aria-hidden="true"
                  >
                    <div className="w-52 h-auto">
                      <Picture
                        src="/images/horizontal-logo-light.png"
                        alt=""
                        decorative
                        className="dark:hidden w-full h-full object-contain"
                        priority
                      />
                      <Picture
                        src="/images/horizontal-logo-dark.png"
                        alt=""
                        decorative
                        className="hidden dark:block w-full h-full object-contain"
                        priority
                      />
                    </div>
                  </motion.div>

                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center mb-6"
                  >
                    <h2
                      id="registration-modal-heading"
                      className="text-2xl font-bold text-neutral-900 dark:text-white mb-3"
                    >
                      {modal?.heading}
                    </h2>
                    <p
                      id="registration-modal-description"
                      className="text-neutral-600 dark:text-neutral-400 leading-relaxed"
                    >
                      {modal?.subheading}
                    </p>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-3"
                  >
                    <motion.a
                      href={modal?.button1Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${modal?.button1Text ?? 'Register now'} - opens in a new tab`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                    >
                      {modal?.button1Text}
                      <motion.div
                        aria-hidden="true"
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      >
                        <ArrowRight className="hidden sm:block w-5 h-5" aria-hidden="true" />
                      </motion.div>
                    </motion.a>

                    <motion.button
                      onClick={handleClose}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-3 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    >
                      {modal?.button2Text ?? 'Maybe later'}
                    </motion.button>
                  </motion.div>

                  {/* Footer note */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-center text-sm text-neutral-500 dark:text-neutral-500 mt-6"
                  >
                    Quick and easy enrollment • Takes less than 15 minutes
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
