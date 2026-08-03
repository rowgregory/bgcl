'use client'

import { motion } from 'framer-motion'
import { Plus, ChevronDown } from 'lucide-react'
import { useActionMenuStore } from '@/stores/useActionMenuStore'

export default function ActionMenuButton() {
  const isOpen = useActionMenuStore((s) => s.isOpen)
  const toggle = useActionMenuStore((s) => s.toggle)

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className="px-4 py-2 dark:bg-linear-to-r dark:from-cyan-600 dark:to-sky-600 dark:hover:from-sky-600 dark:hover:to-cyan-600 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-500 text-white rounded-lg transition-all flex items-center space-x-2 font-medium dark:shadow-lg shadow text-sm cursor-pointer"
    >
      <Plus className="w-4 h-4" aria-hidden="true" />
      <span>Actions</span>
      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
    </motion.button>
  )
}
