'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Rocket, ShieldX, Star } from 'lucide-react'
import { FloatingStars } from '@/app/components/common/FloatingStars'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { store } from '@/app/lib/store/store'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useSearchParams } from 'next/navigation'
import { MotionLink } from '@/app/components/common/MotionLink'
import Picture from '@/app/components/common/Picture'
import getAuthErrorMessage from '@/app/lib/auth/getAuthErrorMessage'
import { logAuthError } from '@/app/lib/actions/logAuthError'

const Login = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const errorInfo = urlError ? getAuthErrorMessage(urlError) : null

  const handleGoogleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {
      await signIn('google', {
        callbackUrl: '/supporter/overview',
        redirect: true
      })
    } catch (error) {
      console.error('Error during sign-in:', error)
    }
  }

  const handleMagicLink = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!email) {
      setErrorMsg('Enter valid email')
      return
    }

    try {
      setIsSubmitting(true)
      localStorage.setItem('lastMagicLinkEmail', email)

      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/supporter/overview'
      })

      if (result?.ok) {
        store.dispatch(showToast({ message: 'Successfully sent magic link' }))
        setEmail('')
        setErrorMsg('')
      }
    } catch (error) {
      console.error('Magic link error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (urlError && errorInfo) {
      const savedEmail = localStorage.getItem('lastMagicLinkEmail')

      logAuthError({
        error: urlError,
        title: errorInfo.title,
        message: errorInfo.message,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        email: savedEmail || undefined
      })
    }
  }, [urlError, errorInfo])

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 dark:bg-neutral-950 bg-neutral-50 relative overflow-hidden items-center justify-center p-12">
        {/* Animated linear orbs */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-600/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-neutral-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{
            duration: 8,
            repeat: Infinity
          }}
        />

        {/* Floating stars */}
        <FloatingStars />
        {/* Content */}
        <div className="relative z-10 text-center flex items-center justify-center flex-col">
          <MotionLink href="/" className="flex space-x-3 w-44 h-auto mb-4">
            <Picture
              src="/images/vertical-logo-light.png"
              alt="Boys & Girls Club"
              className="dark:hidden block w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
              priority
            />
            <Picture
              src="/images/vertical-logo-dark.png"
              alt="Boys & Girls Club"
              className="dark:block hidden w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
              priority
            />
          </MotionLink>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="dark:text-white text-neutral-900 text-5xl font-bold mb-4 tracking-tight"
          >
            BGCL PORTAL
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="dark:text-neutral-400 text-neutral-600 flex items-center justify-center gap-8"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-sky-600" />
              <span className="text-sm">Secure Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-sky-600" />
              <span className="text-sm">Real-time Data</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 dark:bg-neutral-900 bg-white flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-sky-500 to-sky-700 rounded-full mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="dark:text-white text-neutral-900 text-2xl font-bold">BGCL PORTAL</h1>
          </div>

          <div>
            <h2 className="dark:text-white text-neutral-900 text-3xl font-bold mb-2">Welcome back</h2>
            <p className="dark:text-neutral-400 text-neutral-600 mb-8">Sign in to access your mission control</p>

            {/* Error Message */}
            <AnimatePresence>
              {urlError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl backdrop-blur-sm"
                >
                  <div className="flex items-start space-x-3">
                    <div className="shrink-0">
                      <ShieldX className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-red-600 dark:text-red-400 font-semibold text-sm mb-1">{errorInfo?.title}</h3>
                      <p className="text-red-600/80 dark:text-red-300 text-sm leading-relaxed">{errorInfo?.message}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!emailSent ? (
              <>
                {/* Google Sign In */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleSignIn}
                  className="w-full dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors mb-6"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </motion.button>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full dark:border-neutral-700 border-neutral-300 border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="dark:px-2 dark:bg-neutral-900 dark:text-neutral-500 px-2 bg-white text-neutral-600">
                      or continue with email
                    </span>
                  </div>
                </div>

                {/* Success Banner */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="mb-8 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3"
                    >
                      <div className="shrink-0">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-800 dark:text-red-200">Error</p>
                        <p className="text-xs text-red-700 dark:text-red-300">{errorMsg}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Magic Link */}
                <form onSubmit={handleMagicLink}>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="dark:text-neutral-300 text-neutral-700 block text-sm font-medium mb-2"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sqysh@sqysh.io"
                      className="w-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:placeholder-neutral-500 dark:focus:ring-sky-500 bg-neutral-100 border-neutral-300 text-neutral-900 placeholder-neutral-600 focus:ring-sky-500 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full dark:bg-linear-to-r dark:from-sky-600 dark:to-sky-700 dark:hover:from-sky-500 dark:hover:to-sky-600 bg-linear-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear'
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Send Magic Link
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-sky-500 to-sky-600 rounded-full mb-4"
                >
                  <Mail className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="dark:text-white text-neutral-900 text-xl font-bold mb-2">Check your email</h2>
                <p className="dark:text-neutral-400 text-neutral-600 mb-6">
                  We sent a magic link to <br />
                  <span className="text-sky-400">{email}</span>
                </p>
                <button
                  onClick={() => setEmailSent(false)}
                  className="dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-500 text-sm transition-colors"
                >
                  Try another email
                </button>
              </motion.div>
            )}

            {/* Footer */}
            <p className="dark:text-neutral-500 text-neutral-600 text-center text-xs mt-8">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy-policy"
                className="dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-500"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
