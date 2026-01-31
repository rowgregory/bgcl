'use client'

import { Share2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MetaPixelCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="dark:bg-neutral-900 bg-white border dark:border-neutral-800 border-neutral-200 rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-bewteen"
    >
      <div>
        {/* Coming Soon Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-linear-to-r from-pink-500 to-blue-500 text-white text-xs font-semibold rounded-full">
            Coming Soon
          </span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-pink-500 to-blue-600 flex items-center justify-center opacity-50">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white opacity-50">Meta Pixel</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 opacity-50">
                Facebook & Instagram Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="mb-6">
          <div className="p-4 bg-linear-to-br from-pink-50 to-blue-50 dark:from-pink-900/10 dark:to-blue-900/10 border border-pink-200 dark:border-pink-800/30 rounded-lg">
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
              <strong>Track social media performance</strong>
            </p>
            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1 ml-4 list-disc">
              <li>Monitor Facebook & Instagram ad conversions</li>
              <li>Retarget website visitors</li>
              <li>Measure social media ROI</li>
              <li>Track donation attribution</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disabled Button */}
      <button
        disabled
        className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 font-semibold rounded-lg cursor-not-allowed opacity-50"
      >
        Configuration Pending
      </button>

      {/* Footer Note */}
      <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center mt-4">
        Feature will be available in a future update
      </p>
    </motion.div>
  )
}
