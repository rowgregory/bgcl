'use client'

import { motion } from 'framer-motion'
import { CreditCard } from 'lucide-react'

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
        checked ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50'
      }`}
    >
      {/* Left Content */}
      <div className="flex items-center gap-3 flex-1 text-left">
        <CreditCard className={`w-5 h-5 shrink-0 transition-colors ${checked ? 'text-indigo-400' : 'text-zinc-500'}`} />
        <div>
          <p className={`text-sm font-medium ${checked ? 'text-white' : 'text-zinc-300'}`}>{label}</p>
          {description && <p className="text-xs text-zinc-500">{description}</p>}
        </div>
      </div>

      {/* Switch Toggle */}
      <motion.div
        animate={{
          backgroundColor: checked ? '#8481dc' : '#52525b'
        }}
        className="w-12 h-7 rounded-full relative shrink-0"
      >
        <motion.div
          animate={{
            x: checked ? 20 : 2
          }}
          className={`${checked ? 'bg-[#202138]' : 'bg-[#1e1e21]'} w-5 h-5 rounded-full absolute top-1 left-1`}
        />
      </motion.div>
    </motion.button>
  )
}
