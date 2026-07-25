'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import getAuthErrorMessage from '@/app/lib/auth/getAuthErrorMessage'
import { logAuthError } from '@/app/lib/actions/log/logAuthError'

const KNOWN_ERRORS = [
  'AccessDenied',
  'Verification',
  'EmailSignin',
  'OAuthSignin',
  'OAuthCallback',
  'SessionRequired',
  'Configuration'
]

/**
 * Reads the `?error=` search param, renders the redirect-error banner, and
 * logs the auth error as a side effect. Self-contained so the page doesn't
 * need to know about search params or logging.
 */
export function LoginUrlError() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const errorInfo = urlError ? getAuthErrorMessage(urlError) : null

  useEffect(() => {
    if (!urlError || urlError === 'undefined' || urlError === 'null') return
    if (!errorInfo) return

    const savedEmail = localStorage.getItem('lastMagicLinkEmail')

    logAuthError({
      error: urlError,
      title: errorInfo.title,
      message: errorInfo.message,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      email: savedEmail || undefined,
      isKnownError: KNOWN_ERRORS.includes(urlError)
    })
  }, [urlError, errorInfo])

  return (
    <AnimatePresence>
      {urlError && errorInfo && (
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="dark:bg-red-500/10 bg-red-50 border dark:border-red-500/20 border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="dark:text-red-300 text-red-800 font-semibold text-sm mb-0.5">{errorInfo.title}</p>
              <p className="dark:text-red-300/80 text-red-700 text-sm leading-relaxed">{errorInfo.message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
