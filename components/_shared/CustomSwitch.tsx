'use client'

import { motion } from 'framer-motion'
import { CreditCard, Eye, PersonStanding, Ticket, Zap } from 'lucide-react'

export interface CustomSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}

export default function CustomSwitch({ checked, onChange, label, description }: CustomSwitchProps) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`w-full flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 ${
        checked
          ? 'dark:bg-sky-500/10 dark:border-sky-500/50 bg-sky-500/10 border-sky-500/50'
          : 'dark:bg-zinc-800/50 dark:border-zinc-700/50 dark:hover:border-zinc-600/50 bg-neutral-100 border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {/* Left content */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 text-left min-w-0">
        {label === 'Age Group' ? (
          <PersonStanding
            className={`w-4 h-4 shrink-0 transition-colors ${checked ? 'dark:text-sky-400 text-sky-600' : 'dark:text-zinc-500 text-neutral-600'}`}
            aria-hidden="true"
          />
        ) : label === 'Active Campaign' ? (
          <Zap
            className={`w-4 h-4 shrink-0 transition-colors ${checked ? 'dark:text-green-400 text-green-600' : 'dark:text-zinc-500 text-neutral-600'}`}
            aria-hidden="true"
          />
        ) : label === 'Listed Campaign' ? (
          <Eye
            className={`w-4 h-4 shrink-0 transition-colors ${checked ? 'dark:text-purple-400 text-purple-600' : 'dark:text-zinc-500 text-neutral-600'}`}
            aria-hidden="true"
          />
        ) : label === 'Raffle Event' ? (
          <Ticket
            className={`w-4 h-4 shrink-0 transition-colors ${checked ? 'dark:text-sky-400 text-sky-600' : 'dark:text-zinc-500 text-neutral-600'}`}
            aria-hidden="true"
          />
        ) : label === 'Published Ticket' ? (
          <Eye
            className={`w-4 h-4 shrink-0 transition-colors ${checked ? 'dark:text-sky-400 text-sky-600' : 'dark:text-zinc-500 text-neutral-600'}`}
            aria-hidden="true"
          />
        ) : (
          <CreditCard
            className={`w-4 h-4 shrink-0 transition-colors ${checked ? 'dark:text-sky-400 text-sky-600' : 'dark:text-zinc-500 text-neutral-600'}`}
            aria-hidden="true"
          />
        )}

        <div className="min-w-0 flex-1">
          <p
            className={`text-xs sm:text-sm font-medium leading-snug ${checked ? 'dark:text-white text-neutral-900' : 'dark:text-zinc-300 text-neutral-700'}`}
          >
            {label}
          </p>
          {description && (
            <p className="text-[10px] sm:text-xs dark:text-zinc-500 text-neutral-500 mt-0.5 leading-snug line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Toggle */}
      <div
        className={`w-10 h-6 rounded-full relative shrink-0 border transition-colors ${
          checked
            ? 'dark:bg-sky-500 dark:border-sky-500 bg-sky-600 border-sky-600'
            : 'dark:bg-zinc-700 dark:border-zinc-600 bg-neutral-200 border-neutral-300'
        }`}
        aria-hidden="true"
      >
        <div
          className={`w-4 h-4 rounded-full absolute top-1 transition-all ${
            checked ? 'dark:bg-zinc-200 bg-white left-5' : 'dark:bg-zinc-600 bg-neutral-400 left-1'
          }`}
        />
      </div>
    </motion.button>
  )
}
