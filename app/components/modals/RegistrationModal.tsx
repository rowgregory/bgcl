'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Picture from '../common/Picture'

export default function RegistrationModal({ pageContent }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(pathname === '/')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
  }

  if (pathname !== '/') return

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 dark:bg-black/60 bg-white/60 backdrop-blur-sm z-110"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-120 p-4">
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
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="absolute top-5 right-5 z-10 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                </motion.button>

                {/* Content */}
                <div className="p-8 pt-10">
                  {/* Logo */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 flex justify-center"
                  >
                    <div className="w-52 h-auto">
                      <Picture
                        src="/images/horizontal-logo-light.png"
                        alt="Boys & Girls Club of Lynn"
                        className="dark:hidden w-full h-full object-contain"
                        priority={true}
                      />
                      <Picture
                        src="/images/horizontal-logo-dark.png"
                        alt="Boys & Girls Club of Lynn"
                        className="hidden dark:block w-full h-full object-contain"
                        priority={true}
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
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                      {pageContent?.modal?.heading}
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {pageContent?.modal?.subheading}
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
                      href={pageContent?.modal?.button1Link}
                      target="_blank"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      {pageContent?.modal?.button1Text}
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      >
                        <ArrowRight className="hidden sm:block w-5 h-5" />
                      </motion.div>
                    </motion.a>
                    <motion.button
                      onClick={handleClose}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-3 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium transition-colors"
                    >
                      {pageContent?.modal?.button2Text}
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
