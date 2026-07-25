'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { LoginError } from './LoginError'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Either auth method in flight — used to disable the whole form.
  const busy = isSubmitting || googleLoading

  const handleGoogleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setErrorMsg('')

    try {
      setGoogleLoading(true)
      await signIn('google', {
        redirect: true,
        redirectTo: '/auth/login'
      })
      // On success the browser redirects away, so no need to reset loading here.
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ''

      setErrorMsg(
        errorMessage.includes('popup')
          ? 'Please allow popups and try again.'
          : 'Unable to connect with Google. Please try again.'
      )
      setGoogleLoading(false)
    }
  }

  const handleMagicLink = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!email) {
      setErrorMsg('Enter a valid email address')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMsg('')
      localStorage.setItem('lastMagicLinkEmail', email)

      const result = await signIn('email', {
        email,
        redirect: false,
        redirectTo: '/auth/login'
      })

      if (result?.ok) {
        setEmailSent(true)
        setErrorMsg('')
      } else if (result?.error) {
        setErrorMsg(
          result.error === 'EmailSignin'
            ? 'That email address looks invalid. Check it and try again.'
            : 'Something went wrong sending your link. Please try again.'
        )
      }
    } catch (error) {
      setErrorMsg('Unable to send the sign-in link. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Success state ───────────────────────────────────────────────────────────
  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-center py-4"
      >
        <div
          aria-hidden="true"
          className="inline-flex items-center justify-center w-14 h-14 dark:bg-sky-500/10 bg-sky-50 border dark:border-sky-500/20 border-sky-100 rounded-full mb-4"
        >
          <Mail className="w-6 h-6 text-sky-600 dark:text-sky-400" />
        </div>
        <h2 className="dark:text-white text-neutral-900 text-lg font-semibold mb-2">Check your email</h2>
        <p className="dark:text-neutral-400 text-neutral-600 text-sm mb-6 leading-relaxed">
          We sent a sign-in link to{' '}
          <span className="dark:text-sky-400 text-sky-600 font-medium">
            <span className="sr-only">the address </span>
            {email}
          </span>
          . The link expires shortly, so use it soon.
        </p>
        <button
          type="button"
          onClick={() => setEmailSent(false)}
          className="inline-flex items-center gap-1.5 dark:text-neutral-400 text-neutral-600 hover:dark:text-white hover:text-neutral-900 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 rounded px-2 py-1"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Use a different email
        </button>
      </motion.div>
    )
  }

  // ── Sign-in form ────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inline error — covers both Google and magic-link failures */}
      <LoginError message={errorMsg} />

      {/* Google Sign In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={busy}
        aria-disabled={busy}
        aria-busy={googleLoading}
        className="w-full dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-800 bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-300 border font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
      >
        {googleLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
              className="w-4 h-4 border-2 dark:border-white border-neutral-900 border-t-transparent dark:border-t-transparent rounded-full"
            />
            <span className="sr-only">Connecting to Google, please wait…</span>
            <span aria-hidden="true">Connecting…</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
            Continue with Google
          </>
        )}
      </button>

      {/* Divider */}
      <div role="separator" aria-label="or continue with email" className="relative my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full dark:border-neutral-800 border-neutral-200 border-t" />
        </div>
        <div className="relative flex justify-center" aria-hidden="true">
          <span className="dark:bg-neutral-950 dark:text-neutral-500 bg-white text-neutral-400 px-3 text-xs uppercase tracking-wider font-medium">
            or
          </span>
        </div>
      </div>

      {/* Magic Link Form */}
      <form onSubmit={handleMagicLink} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="dark:text-neutral-300 text-neutral-700 block text-sm font-medium mb-1.5">
            Email address
            <span className="sr-only"> (required)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@bgcl.org"
            autoComplete="email"
            aria-required="true"
            disabled={busy}
            className="w-full dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:placeholder-neutral-500 bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          aria-disabled={busy}
          aria-busy={isSubmitting}
          className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              <span className="sr-only">Sending sign-in link, please wait…</span>
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" aria-hidden="true" />
              Send sign-in link
            </>
          )}
        </button>
      </form>
    </>
  )
}
