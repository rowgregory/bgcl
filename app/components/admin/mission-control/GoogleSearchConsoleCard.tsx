'use client'

import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

export default function GoogleSearchConsoleCard() {
  const { data: session } = useSession()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="dark:bg-neutral-900 bg-white border dark:border-neutral-800 border-neutral-200 rounded-xl p-6 flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-semibold dark:text-white text-neutral-900">Google Search Console</h3>
              <p className="text-sm dark:text-neutral-400 text-neutral-600">Search Performance & Site Health</p>
            </div>
          </div>
        </div>

        {/* Access Info */}
        <div className="mb-6 flex-1">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2 block">
              Your Access Email
            </label>
            <code className="text-sm text-neutral-900 dark:text-neutral-200 font-mono break-all">
              {session?.user?.email}
            </code>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              You have access to this property via your Google account
            </p>
          </div>
        </div>
      </div>
      {/* Action Button */}
      <a
        href="https://search.google.com/search-console?resource_id=https://www.bgcl.org"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-green-500/20"
      >
        Open Search Console
        <ExternalLink className="w-4 h-4" />
      </a>

      {/* Footer Note */}
      <p className="text-xs text-neutral-500 dark:text-neutral-500 text-center mt-4">
        Monitor search performance, indexing, and site health
      </p>
    </motion.div>
  )
}
