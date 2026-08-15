'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

type Props = {
  label: string
  isSubmitting: boolean
  isValid?: boolean
}

export function SubmitButton({ label, isSubmitting, isValid = true }: Props) {
  const ready = isValid && !isSubmitting

  return (
    <motion.button
      type="submit"
      disabled={!ready}
      whileHover={ready ? { scale: 1.01 } : {}}
      whileTap={ready ? { scale: 0.98 } : {}}
      aria-disabled={!ready}
      className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 flex items-center justify-center gap-2 ${
        ready
          ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/25 cursor-pointer'
          : 'dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-600 text-neutral-400 dark:border-neutral-700 border-neutral-200 border cursor-not-allowed'
      }`}
    >
      {isSubmitting ? (
        <span className="flex itemsy-center gap-2" aria-live="polite">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="block w-4 h-4 border-2 dark:border-white/30 border-neutral-300 dark:border-t-white border-t-neutral-600 rounded-full"
            aria-hidden="true"
          />
          Processing...
        </span>
      ) : (
        <>
          {label}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </>
      )}
    </motion.button>
  )
}
