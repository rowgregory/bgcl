'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface LoginErrorProps {
  /** When present, the banner is shown; when empty/undefined, nothing renders. */
  message?: string
}

/**
 * Inline validation error banner (e.g. "Enter a valid email address").
 * Presentational — animates in/out based on whether a message is passed.
 */
export function LoginError({ message }: LoginErrorProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="dark:bg-red-500/10 bg-red-50 border dark:border-red-500/20 border-red-200 rounded-lg px-3.5 py-2.5 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
            <p className="text-sm dark:text-red-300 text-red-700">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
