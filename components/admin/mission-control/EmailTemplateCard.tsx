'use client'

import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'

export default function EmailTemplateCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="dark:bg-neutral-900 bg-white border dark:border-neutral-800 border-neutral-200 rounded-xl p-6 opacity-60 cursor-not-allowed relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              {/* Lock badge on icon */}
              <div className="absolute -top-1 -right-1 bg-neutral-200 dark:bg-neutral-700 rounded-full p-1 border-2 border-white dark:border-neutral-900">
                <Lock className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold dark:text-neutral-400 text-neutral-500">Email Templates</h3>
              <p className="text-sm dark:text-neutral-500 text-neutral-400">AI-Powered Email Generation</p>
            </div>
          </div>

          {/* Locked badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700">
            <Lock className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Locked</span>
          </div>
        </div>

        {/* Locked Info */}
        <div className="mb-6 relative z-10">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2 block items-center gap-2">
              Premium Feature
            </label>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Contact Sqysh to unlock AI-powered email template generation
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6 space-y-2 relative z-10">
          <div className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-500">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1 shrink-0"></div>
            <span className="">AI-powered email generation</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-500">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1 shrink-0"></div>
            <span className="">Send to all subscribers</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-500">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1 shrink-0"></div>
            <span className="">Custom tone and style options</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-500">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-1 shrink-0"></div>
            <span className="">Track email performance</span>
          </div>
        </div>
      </div>
      {/* Action Button - Disabled */}
      <button
        disabled
        className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 font-semibold rounded-lg cursor-not-allowed relative z-10"
      >
        <Lock className="w-4 h-4" />
        Contact Sqysh to Build This
      </button>

      {/* Footer Note */}
      <p className="text-xs text-neutral-400 dark:text-neutral-600 text-center mt-4 relative z-10">
        Generate professional emails with AI assistance
      </p>
    </motion.div>
  )
}
