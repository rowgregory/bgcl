'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Picture from '@/app/components/common/Picture'
import { LoginUrlError } from './_components/LoginUrlError'
import { LoginForm } from './_components/LoginForm'

export default function LoginClient() {
  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white flex flex-col items-center justify-center px-5 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo + heading */}
        <div className="flex flex-col items-center text-center mb-10">
          <Link
            href="/"
            aria-label="Boys & Girls Club of Lynn — go to home page"
            className="w-32 h-auto mb-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-neutral-950 rounded-lg"
          >
            <Picture
              src="/images/vertical-logo-light.png"
              alt="Boys & Girls Club of Lynn"
              className="dark:hidden block w-full h-full object-contain"
              priority
            />
            <Picture
              src="/images/vertical-logo-dark.png"
              alt="Boys & Girls Club of Lynn"
              className="dark:block hidden w-full h-full object-contain"
              priority
            />
          </Link>

          <main aria-labelledby="login-heading" className="w-full">
            <h1
              id="login-heading"
              className="dark:text-white text-neutral-900 text-2xl sm:text-[26px] font-bold tracking-tight mb-2"
            >
              Sign in to the portal
            </h1>
            <p className="dark:text-neutral-400 text-neutral-500 text-sm">
              Staff access for the Boys &amp; Girls Club of Lynn
            </p>
          </main>
        </div>

        {/* Redirect / URL error banner (self-logging) */}
        <LoginUrlError />

        {/* Google + magic-link forms and success state */}
        <LoginForm />
      </motion.div>

      {/* Footer — pinned quietly at the bottom edge */}
      <p className="dark:text-neutral-600 text-neutral-400 text-center text-xs mt-10 max-w-sm px-4 leading-relaxed">
        By signing in, you agree to our{' '}
        <Link
          href="/terms"
          className="dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 rounded"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy-policy"
          className="dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 rounded"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
