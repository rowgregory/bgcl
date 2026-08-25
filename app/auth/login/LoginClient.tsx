'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Picture from '@/components/_shared/Picture'
import { LoginUrlError } from './_components/LoginUrlError'
import { LoginForm } from './_components/LoginForm'

const legalLinkClass =
  'dark:text-neutral-400 text-neutral-600 hover:dark:text-sky-400 hover:text-sky-600 underline underline-offset-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 rounded'

export default function LoginClient() {
  return (
    <main className="min-h-screen dark:bg-neutral-950 bg-white flex flex-col items-center justify-center px-5 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <Link
            href="/"
            aria-label="Boys & Girls Club of Lynn, go to home page"
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

          <h1 className="dark:text-white text-neutral-900 text-2xl sm:text-[26px] font-bold tracking-tight mb-2">
            Sign in
          </h1>
          <p className="dark:text-neutral-400 text-neutral-500 text-sm">Access your tickets, donations, and account</p>
        </div>

        <LoginUrlError />
        <LoginForm />

        <p className="dark:text-neutral-600 text-neutral-400 text-center text-xs mt-10 leading-relaxed">
          By signing in, you agree to our{' '}
          <Link href="/terms" className={legalLinkClass}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className={legalLinkClass}>
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
