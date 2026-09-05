'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-4 border-t border-neutral-200 dark:border-neutral-800"
    >
      <h2 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </motion.section>
  )
}

export function Field({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 dark:text-neutral-600">{label}</p>
      <div className={`mt-0.5 text-sm text-neutral-900 dark:text-white ${className}`}>{children}</div>
    </div>
  )
}
