'use client'

import { ExternalLink, Video } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

interface HotjarCredentials {
  email: string
  dashboardUrl: string
}

export default function HotjarCard() {
  const { data: session } = useSession()

  const credentials: HotjarCredentials = {
    email: session?.user?.email,
    dashboardUrl: 'https://insights.hotjar.com'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="dark:bg-neutral-900 bg-white border dark:border-neutral-800 border-neutral-200 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900">Hotjar</h3>
            <p className="text-sm dark:text-neutral-400 text-neutral-600">Heatmaps & Session Recordings</p>
          </div>
        </div>
      </div>

      {/* Access Info */}
      <div className="mb-6">
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
            Your Access Email
          </label>
          <code className="text-sm text-neutral-900 dark:text-neutral-200 font-mono break-all">
            {credentials.email}
          </code>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            Log in with your Hotjar/Contentsquare account credentials
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6 space-y-2">
        <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 shrink-0"></div>
          <span>Watch session recordings to see user behavior</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 shrink-0"></div>
          <span>View heatmaps to identify popular content</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 shrink-0"></div>
          <span>Analyze user feedback and surveys</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 shrink-0"></div>
          <span>Discover UX issues and friction points</span>
        </div>
      </div>

      {/* Action Button */}
      <a
        href={credentials.dashboardUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-orange-500/20"
      >
        Open Hotjar Dashboard
        <ExternalLink className="w-4 h-4" />
      </a>

      {/* Footer Note */}
      <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center mt-4">
        Understand user behavior with visual insights
      </p>
    </motion.div>
  )
}
