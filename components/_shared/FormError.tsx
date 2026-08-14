'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export default function FormError() {
  const {
    formState: { errors }
  } = useFormContext()

  return (
    <AnimatePresence>
      {errors.root && (
        <motion.p
          key="error"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="alert"
          aria-live="assertive"
          className="text-xs text-red-500 dark:text-red-400 font-mono flex items-start gap-2"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          {errors.root.message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
