'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { LoginError } from './LoginError'
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon'

type Pending = 'google' | 'email' | null

const buttonBase =
  'w-full font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950'

function Spinner({ className = 'border-white' }: { className?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
      className={`w-4 h-4 border-2 rounded-full ${className} border-t-transparent!`}
    />
  )
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState<Pending>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const busy = pending !== null

  const handleGoogleSignIn = async () => {
    setErrorMsg('')
    setPending('google')

    try {
      // On success the browser navigates away, so loading is never reset here.
      await signIn('google', { redirect: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : ''

      setErrorMsg(
        message.includes('popup')
          ? 'Please allow popups and try again.'
          : 'Unable to connect with Google. Please try again.'
      )
      setPending(null)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmed = email.trim()

    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Enter a valid email address')
      return
    }

    setErrorMsg('')
    setPending('email')

    try {
      const result = await signIn('email', { email: trimmed, redirect: false })

      if (result?.ok) {
        setEmailSent(true)
        return
      }

      setErrorMsg(
        result?.error === 'EmailSignin'
          ? 'That email address looks invalid. Check it and try again.'
          : 'Something went wrong sending your link. Please try again.'
      )
    } catch {
      setErrorMsg('Unable to send the sign-in link. Please try again.')
    } finally {
      setPending(null)
    }
  }

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
            {email.trim()}
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

  return (
    <>
      <LoginError message={errorMsg} />

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={busy}
        aria-busy={pending === 'google'}
        className={`${buttonBase} gap-3 border dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-800 bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-300`}
      >
        {pending === 'google' ? (
          <>
            <Spinner className="dark:border-sky-500 border-neutral-900" />
            <span className="sr-only">Connecting to Google, please wait</span>
            <span aria-hidden="true">Connecting…</span>
          </>
        ) : (
          <>
            <GoogleIcon />
            Continue with Google
          </>
        )}
      </button>

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
            placeholder="you@example.com"
            autoComplete="email"
            aria-required="true"
            disabled={busy}
            className="w-full dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:placeholder-neutral-500 bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          aria-busy={pending === 'email'}
          className={`${buttonBase} bg-sky-600 hover:bg-sky-500 text-white`}
        >
          {pending === 'email' ? (
            <Spinner className="border-sky-500" />
          ) : (
            <Mail className="w-4 h-4" aria-hidden="true" />
          )}
          {pending === 'email' ? 'Sending…' : 'Send sign-in link'}
        </button>
      </form>
    </>
  )
}
