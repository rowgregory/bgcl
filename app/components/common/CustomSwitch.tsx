'use client'

import { motion } from 'framer-motion'
import { CreditCard, PersonStanding } from 'lucide-react'

interface CustomSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}

export default function CustomSwitch({ checked, onChange, label, description }: CustomSwitchProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-lg border-2 transition-all ${
        checked
          ? 'dark:bg-sky-500/10 dark:border-sky-500/50 bg-sky-500/10 border-sky-500/50'
          : 'dark:bg-zinc-800/50 dark:border-zinc-700/50 dark:hover:border-zinc-600/50 bg-neutral-100 border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {/* Left Content */}
      <div className="flex items-center gap-3 flex-1 text-left">
        {label === 'Age Group' ? (
          <PersonStanding
            className={`w-5 h-5 shrink-0 transition-colors ${checked ? 'dark:text-sky-400 text-sky-600' : 'dark:text-zinc-500 text-neutral-600'}`}
          />
        ) : (
          <CreditCard
            className={`w-5 h-5 shrink-0 transition-colors ${checked ? 'dark:text-sky-400 text-sky-600' : 'dark:text-zinc-500 text-neutral-600'}`}
          />
        )}
        <div>
          <p
            className={`text-sm font-medium ${checked ? 'dark:text-white text-neutral-900' : 'dark:text-zinc-300 text-neutral-700'}`}
          >
            {label}
          </p>
          {description && <p className="text-xs dark:text-zinc-500 text-neutral-500">{description}</p>}
        </div>
      </div>

      {/* Switch Toggle */}
      <div
        className={`w-12 h-7 rounded-full relative shrink-0 border transition-colors ${
          checked
            ? 'dark:bg-sky-500 dark:border-sky-500 bg-sky-600 border-sky-600'
            : 'dark:bg-zinc-700 dark:border-zinc-600 bg-neutral-200 border-neutral-300'
        }`}
      >
        <div
          className={`w-5 h-5 -mt-px rounded-full absolute top-1 transition-all ${
            checked ? 'dark:bg-zinc-200 bg-white left-6' : 'dark:bg-zinc-600 bg-neutral-400 left-1'
          }`}
        />
      </div>
    </motion.button>
  )
}
