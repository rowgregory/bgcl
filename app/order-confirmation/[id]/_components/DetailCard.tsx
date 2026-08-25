import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface DetailCardProps {
  title: string
  delay?: number
  className?: string
  children: ReactNode
}

export const DetailCard = ({ title, delay = 0, className = '', children }: DetailCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-800/50 ${className}`}
  >
    <h3 className="text-sm font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">{title}</h3>
    {children}
  </motion.div>
)

interface FieldProps {
  label: string
  children: ReactNode
  className?: string
}

export const Field = ({ label, children, className = '' }: FieldProps) => (
  <div>
    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">{label}</p>
    <div className={`text-neutral-900 dark:text-white font-semibold ${className}`}>{children}</div>
  </div>
)
