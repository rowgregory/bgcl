'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, Clock, Shield, Mail, Lock, Compass, ArrowLeft } from 'lucide-react'
import { MotionLink } from '@/components/_shared/MotionLink'
import Picture from '@/components/_shared/Picture'

const getAuthErrorMessage = (error: string | null) => {
  switch (error) {
    case 'AccessDenied':
      return {
        icon: Shield,
        title: 'Access Denied',
        message:
          'Your account does not have permission to access this area. Only authorized Boys & Girls Club staff can sign in here. Contact your administrator if you believe this is a mistake.'
      }
    case 'Verification':
      return {
        icon: Clock,
        title: 'Link Expired or Already Used',
        message:
          'This sign-in link is no longer valid. If you are using a work, school, or organization email, their security software may have clicked the link before you. Try signing in with a personal email address instead.'
      }
    case 'EmailSignin':
      return {
        icon: Mail,
        title: 'Email Failed to Send',
        message:
          'We were unable to send the sign-in email. Please double-check your email address and try again. If the problem persists, contact support.'
      }
    case 'OAuthSignin':
    case 'OAuthCallback':
      return {
        icon: AlertTriangle,
        title: 'Google Sign-In Failed',
        message:
          'There was a problem connecting to Google. This is usually temporary — please try again. If the issue continues, try signing in with a magic link instead.'
      }
    case 'SessionRequired':
      return {
        icon: Lock,
        title: 'Sign In Required',
        message: 'You need to be signed in to access this page. Please sign in to continue.'
      }
    case 'Configuration':
      return {
        icon: Compass,
        title: 'Configuration Error',
        message:
          'There is a technical issue with the authentication setup. Our team has been notified. Please try again later or contact support.'
      }
    default:
      return {
        icon: AlertTriangle,
        title: 'Something Went Wrong',
        message:
          'An unexpected error occurred during sign-in. Please try again. If the problem continues, contact support for help.'
      }
  }
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorInfo = getAuthErrorMessage(error)
  const Icon = errorInfo.icon

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 dark:bg-neutral-950 bg-neutral-50 relative overflow-hidden items-center justify-center p-12">
        <motion.div
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-neutral-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 text-center flex items-center justify-center flex-col">
          <MotionLink
            href="/"
            aria-label="Boys & Girls Club of Lynn — go to home page"
            className="flex space-x-3 w-44 h-auto mb-8"
          >
            <Picture
              src="/images/vertical-logo-light.png"
              alt="Boys & Girls Club of Lynn"
              className="dark:hidden block w-full h-full hover:opacity-80 transition-opacity object-contain"
              priority
            />
            <Picture
              src="/images/vertical-logo-dark.png"
              alt="Boys & Girls Club of Lynn"
              className="dark:block hidden w-full h-full hover:opacity-80 transition-opacity object-contain"
              priority
            />
          </MotionLink>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 dark:bg-red-500/20 rounded-full mb-6"
          >
            <Icon className="w-10 h-10 text-red-500 dark:text-red-400" aria-hidden="true" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="dark:text-white text-neutral-900 text-4xl font-bold mb-4 tracking-tight"
          >
            Sign-In Error
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="dark:text-neutral-400 text-neutral-600 flex items-center justify-center gap-8"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" aria-hidden="true" />
              <span className="text-sm">Authentication failed</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" aria-hidden="true" />
              <span className="text-sm">Secure portal</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 dark:bg-neutral-900 bg-white flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 dark:bg-red-500/20 rounded-full mb-4"
            >
              <Icon className="w-8 h-8 text-red-500 dark:text-red-400" aria-hidden="true" />
            </motion.div>
            <h1 className="dark:text-white text-neutral-900 text-2xl font-bold">Sign-In Error</h1>
          </div>

          {/* Error Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl mb-8"
            role="alert"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 hidden lg:block">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-red-500 dark:text-red-400" aria-hidden="true" />
                </div>
              </div>
              <div>
                <h2 className="text-red-700 dark:text-red-400 font-bold text-xl mb-2">{errorInfo.title}</h2>
                <p className="text-red-600/80 dark:text-red-300/90 leading-relaxed">{errorInfo.message}</p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/login"
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-600/20"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Sign In
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className="w-full dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Go to Home Page
              </Link>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="dark:text-neutral-500 text-neutral-500 text-center text-sm mt-8"
          >
            Need help?{' '}
            <a
              href="mailto:support@bgcl.org"
              className="dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-500 transition-colors"
            >
              Contact support
            </a>
          </motion.p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-center"
            >
              <span className="dark:text-neutral-600 text-neutral-400 text-xs font-mono">Error code: {error}</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
