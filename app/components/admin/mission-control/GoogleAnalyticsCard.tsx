'use client'

import { ExternalLink, Key, User, Check, Copy, EyeOff, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface AnalyticsCredentials {
  analyticsId: string
  email: string
  password: string
  gcpUrl: string
}

export default function GoogleAnalyticsCard() {
  const [showPassword, setShowPassword] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)

  const credentials: AnalyticsCredentials = {
    analyticsId: 'G-XXXXXXXXXX',
    email: 'dev.bgc.lynn@gmail.com',
    password: process.env.NEXT_PUBLIC_GOOGLE_ANALYRICS_PASSWORD,
    gcpUrl:
      'https://analytics.google.com/analytics/web/#/a337968536p518966189/reports/intelligenthome?params=_u..nav%3Dmaui'
  }

  const handleCopy = async (text: string, type: 'email' | 'password') => {
    await navigator.clipboard.writeText(text)
    if (type === 'email') {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      setCopiedPassword(true)
      setTimeout(() => setCopiedPassword(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dark:bg-neutral-900 bg-white border dark:border-neutral-800 border-neutral-200 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold dark:text-white text-neutral-900">Google Analytics</h3>
            <p className="text-sm dark:text-neutral-400 text-neutral-600">Analytics & Cloud Platform Access</p>
          </div>
        </div>
      </div>

      {/* Credentials */}
      <div className="space-y-4 mb-6">
        {/* Analytics ID */}
        <div className="group">
          <label className="text-xs font-medium dark:text-neutral-400 text-neutral-600 uppercase tracking-wide mb-1 block">
            Analytics ID
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 dark:bg-neutral-800 bg-neutral-100 border dark:border-neutral-700 border-neutral-200 rounded-lg">
              <code className="text-sm dark:text-neutral-200 text-neutral-800 font-mono">
                {credentials.analyticsId}
              </code>
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="group">
          <label className="text-xs font-medium dark:text-neutral-400 text-neutral-600 uppercase tracking-wide mb-1 flex items-center gap-1">
            <User className="w-3 h-3" />
            Email
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 dark:bg-neutral-800 bg-neutral-100 border dark:border-neutral-700 border-neutral-200 rounded-lg">
              <code className="text-sm dark:text-neutral-200 text-neutral-800 font-mono">{credentials.email}</code>
            </div>
            <button
              onClick={() => handleCopy(credentials.email, 'email')}
              className="flex-1 sm:flex-none px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors"
              title="Copy email"
            >
              {copiedEmail ? (
                <Check className="w-4 h-4 text-green-500 dark:text-sky-400 mx-auto" />
              ) : (
                <Copy className="-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors mx-auto" />
              )}
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="group">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-1">
            <Key className="w-3 h-3" />
            Password
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <code className="block text-neutral-900 dark:text-sky-400 font-mono text-xs sm:text-sm break-all">
                {showPassword ? credentials.password : '••••••••••••••••••'}
              </code>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="flex-1 sm:flex-none px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-neutral-600 dark:text-neutral-400 mx-auto" />
                ) : (
                  <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400 mx-auto" />
                )}
              </button>
              <button
                onClick={() => handleCopy(credentials.password, 'password')}
                className="flex-1 sm:flex-none px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors"
                title="Copy password"
              >
                {copiedPassword ? (
                  <Check className="w-4 h-4 text-green-500 dark:text-sky-400 mx-auto" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors mx-auto" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <a
        href={credentials.gcpUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-sky-500/20"
      >
        Open Google Analytics Platform
        <ExternalLink className="w-4 h-4" />
      </a>

      {/* Footer Note */}
      <p className="text-xs dark:text-neutral-500 text-neutral-500 text-center mt-4">
        Keep these credentials secure and do not share publicly
      </p>
    </motion.div>
  )
}
