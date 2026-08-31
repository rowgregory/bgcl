'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon'
import Link from 'next/link'

const buttonBase =
  'w-full flex items-center justify-center gap-2 px-5 py-4 rounded-lg text-[15px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'

export function CheckoutStep1({ redirectTo }) {
  const [email, setEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [loadingMagic, setLoadingMagic] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const busy = loadingMagic || loadingGoogle

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setError('Enter a valid email address')
      return
    }

    setLoadingMagic(true)
    setError(null)

    try {
      const res = await signIn('email', { email: trimmed, redirect: false, redirectTo })

      if (res?.error) {
        setError('Something went wrong. Please try again.')
        return
      }

      setMagicSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoadingMagic(false)
    }
  }

  async function handleGoogle() {
    setLoadingGoogle(true)
    setError(null)
    await signIn('google', { redirect: true, redirectTo })
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">Sign in to continue</h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          No account needed. Enter your email or use Google, and we will bring you back here.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {magicSent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="status"
            aria-live="polite"
          >
            <p className="text-base font-medium text-neutral-900 dark:text-white">Check your email</p>

            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              We sent a sign-in link to <span className="text-neutral-900 dark:text-white">{email.trim()}</span>. Open
              it and you will land back on checkout.
            </p>

            <button
              type="button"
              onClick={() => {
                setMagicSent(false)
                setEmail('')
              }}
              className="mt-4 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              Use a different email
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              aria-busy={loadingGoogle}
              className={`${buttonBase} gap-3 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:border-neutral-300 dark:hover:border-neutral-700`}
            >
              <GoogleIcon />
              {loadingGoogle ? 'Connecting…' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3" aria-hidden="true">
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-xs text-neutral-400 dark:text-neutral-600">or</span>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            </div>

            <form onSubmit={handleMagicLink} className="space-y-3" noValidate>
              <div>
                <label
                  htmlFor="signin-email"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  Email address
                </label>

                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={busy}
                  className="w-full px-5 py-4 text-[15px] bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!email || busy}
                aria-busy={loadingMagic}
                className={`${buttonBase} bg-sky-600 hover:bg-sky-500 text-white`}
              >
                {loadingMagic ? 'Sending…' : 'Send sign-in link'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-xs text-neutral-400 dark:text-neutral-600 text-center leading-relaxed">
        By signing in you agree to our{' '}
        <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-neutral-300 underline transition-colors">
          Terms
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy-policy"
          className="hover:text-neutral-900 dark:hover:text-neutral-300 underline transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
