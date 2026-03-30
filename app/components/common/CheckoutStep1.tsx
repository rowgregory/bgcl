'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, Loader2, CheckCircle2, Sparkles } from 'lucide-react'

export function CheckoutStep1({ redirectTo }) {
  const [email, setEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [loadingMagic, setLoadingMagic] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoadingMagic(true)
    setError(null)

    try {
      const res = await signIn('email', { email, redirect: false, redirectTo })
      if (res?.error) {
        setError('Something went wrong. Please try again.')
      } else {
        setMagicSent(true)
      }
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
      <div className="dark:bg-neutral-800/50 dark:border-neutral-700/50 bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold dark:text-white text-neutral-900 mb-1">Sign in to continue</h2>
          <p className="text-sm dark:text-neutral-400 text-neutral-500">
            You'll be returned to checkout after signing in
          </p>

          <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl dark:bg-sky-500/10 dark:border-sky-500/20 bg-sky-50 border-sky-200 border">
            <Sparkles className="w-4 h-4 dark:text-sky-400 text-sky-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm dark:text-sky-300 text-sky-800 leading-relaxed">
              <span className="font-semibold">No account needed.</span> Just enter your email or sign in with Google —
              we'll handle the rest. First time here? You're all set.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {magicSent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center py-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 dark:text-emerald-400 text-emerald-600" aria-hidden="true" />
              </div>
              <p className="text-base font-semibold dark:text-white text-neutral-900 mb-1">Check your email</p>
              <p className="text-sm dark:text-neutral-400 text-neutral-500 mb-4">
                We sent a magic link to <span className="font-medium dark:text-white text-neutral-900">{email}</span>
              </p>
              <button
                onClick={() => {
                  setMagicSent(false)
                  setEmail('')
                }}
                className="text-xs dark:text-sky-400 text-sky-600 hover:underline"
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
              className="space-y-4"
            >
              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={loadingGoogle || loadingMagic}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border dark:border-neutral-700 border-neutral-200 dark:bg-neutral-700/30 bg-neutral-50 dark:hover:bg-neutral-700/60 hover:bg-neutral-100 dark:text-white text-neutral-900 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                aria-label="Sign in with Google"
              >
                {loadingGoogle ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3" aria-hidden="true">
                <div className="flex-1 h-px dark:bg-neutral-700 bg-neutral-200" />
                <span className="text-xs dark:text-neutral-500 text-neutral-400 font-medium">or</span>
                <div className="flex-1 h-px dark:bg-neutral-700 bg-neutral-200" />
              </div>

              {/* Magic link form */}
              <form onSubmit={handleMagicLink} className="space-y-3" noValidate>
                <div>
                  <label
                    htmlFor="signin-email"
                    className="block text-xs font-medium dark:text-neutral-300 text-neutral-700 mb-1.5"
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
                    disabled={loadingMagic || loadingGoogle}
                    className="w-full px-4 py-2.5 rounded-xl border dark:border-neutral-700 border-neutral-200 dark:bg-neutral-900 bg-neutral-50 dark:text-white text-neutral-900 dark:placeholder-neutral-500 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500 dark:text-red-400" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!email || loadingMagic || loadingGoogle}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-sky-500/25"
                >
                  {loadingMagic ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      Send Magic Link
                      <ArrowRight className="w-4 h-4 ml-auto" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="text-[11px] dark:text-neutral-600 text-neutral-400 text-center mt-5 leading-relaxed">
          By signing in you agree to our{' '}
          <a href="/terms" className="dark:text-neutral-500 text-neutral-500 hover:underline">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" className="dark:text-neutral-500 text-neutral-500 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
