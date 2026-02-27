'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useId, useState } from 'react'
import Picture from '../common/Picture'
import { createSubscriber } from '@/app/lib/actions/createSubscriber'
import { store, useFormSelector } from '@/app/lib/store/store'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { useRouter } from 'next/navigation'
import { setIsLoading } from '@/app/lib/store/slices/formSlice'
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '../ui/icons/SocialIconts'

export function Footer() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const { isLoading } = useFormSelector()
  const [memberType, setMemberType] = useState<'member' | 'donor' | 'non-member'>('member')
  const emailInputId = useId()
  const memberTypeGroupId = useId()
  const errorId = useId()
  const successId = useId()

  const handleSubscribe = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!email) {
      setError(true)
      setTimeout(() => setError(false), 5000)
      return
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(true)
      setTimeout(() => setError(false), 5000)
      return
    }

    try {
      store.dispatch(setIsLoading(true))
      const res = await createSubscriber({ email, type: memberType })
      if (!res.success) {
        store.dispatch(showToast({ message: 'Failed to create subscriber', type: 'error' }))
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)

      router.refresh()
      setEmail('')
      setMemberType('member')
    } catch (err) {
      setError(true)
      setTimeout(() => setError(false), 5000)
    } finally {
      store.dispatch(setIsLoading(false))
    }
  }

  return (
    <footer
      aria-label="Site footer"
      className="px-6 md:px-12 dark:bg-neutral-950 dark:border-neutral-800 bg-white border-neutral-200 border-t pb-40 md:pb-0"
    >
      <div className="max-w-334 mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Nonprofit Info */}
          <div className="lg:col-span-2">
            <motion.div
              className="w-64 h-auto mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Only one image announced — dark version is decorative */}
              <Picture
                src="/images/horizontal-logo-light.png"
                alt="Boys & Girls Club of Lynn"
                className="dark:hidden block w-full h-full object-contain"
                priority
              />
              <Picture
                src="/images/horizontal-logo-dark.png"
                decorative
                className="dark:block hidden w-full h-full object-contain"
                priority
              />
            </motion.div>

            <div className="space-y-2 mb-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The Boys & Girls Club of Lynn is a 501(c)3 Charitable Nonprofit Organization
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 font-mono">Tax ID: 04-2103924</p>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md mb-6">
              To inspire and enable all young people, especially those that need us the most, to realize their full
              potential as productive responsible and caring citizens.
            </p>

            {/* Social Media Icons */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="https://www.facebook.com/LynnBoysAndGirlsClub"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Boys & Girls Club of Lynn on Facebook - opens in a new tab"
                className="text-neutral-400 dark:text-neutral-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                <FacebookIcon aria-hidden="true" />
              </Link>
              <Link
                href="https://instagram.com/bgclynn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Boys & Girls Club of Lynn on Instagram - opens in a new tab"
                className="text-neutral-400 dark:text-neutral-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                <InstagramIcon aria-hidden="true" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/boys-girls-club-of-lynn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Boys & Girls Club of Lynn on LinkedIn - opens in a new tab"
                className="text-neutral-400 dark:text-neutral-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                <LinkedInIcon aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.nav
            aria-label="Footer quick links"
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="dark:text-white text-neutral-900 font-bold text-base">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/programs', label: 'Programs' },
                { href: '/events', label: 'Events' },
                { href: '/about', label: 'About' }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-neutral-400 text-neutral-600 dark:hover:text-sky-400 hover:text-sky-600 transition-colors inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Newsletter */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="dark:text-white text-neutral-900 font-bold text-base" id={memberTypeGroupId}>
              Stay Connected
            </h3>
            <p className="text-sm dark:text-neutral-400 text-neutral-600">
              Subscribe to receive updates about our programs and events.
            </p>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  id={errorId}
                  role="alert"
                  aria-live="assertive"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="mb-8 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3"
                >
                  <div className="shrink-0" aria-hidden="true">
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
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Please enter a{!email ? 'n' : ' valid'} email address
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Banner */}
            <AnimatePresence>
              {success && (
                <motion.div
                  id={successId}
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="mb-8 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3"
                >
                  <div className="shrink-0" aria-hidden="true">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-200">Thanks for subscribing!</p>
                    <p className="text-xs text-green-700 dark:text-green-300">Check your email for updates</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubscribe} className="space-y-4" aria-label="Newsletter subscription form" noValidate>
              {/* Email Input */}
              <div className="relative">
                <label
                  htmlFor={emailInputId}
                  className="block text-xs font-medium dark:text-neutral-400 text-neutral-600 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 dark:text-neutral-500 text-neutral-400 pointer-events-none"
                  />
                  <input
                    id={emailInputId}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? errorId : undefined}
                    autoComplete="email"
                    className="w-full pl-10 pr-3 py-2.5 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:placeholder-neutral-600 dark:focus:ring-purple-500 bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:ring-purple-600 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Membership Type */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-medium dark:text-neutral-400 text-neutral-600 uppercase tracking-wide">
                  I am a:
                </legend>
                <div className="space-y-2">
                  {(
                    [
                      { value: 'member', label: 'Member/Parent' },
                      { value: 'non-member', label: 'Non-Member' },
                      { value: 'donor', label: 'Donor' }
                    ] as const
                  ).map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="memberType"
                        value={value}
                        checked={memberType === value}
                        className="sr-only peer"
                        onChange={(e) => setMemberType(e.target.value as 'member' | 'donor' | 'non-member')}
                      />
                      <div
                        aria-hidden="true"
                        className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600 peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500 peer-checked:border-purple-600 dark:peer-checked:border-purple-500 transition-all"
                      />
                      <span className="text-sm dark:text-neutral-400 text-neutral-600 group-hover:dark:text-neutral-300 group-hover:text-neutral-900 transition-colors">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Subscribe Button */}
              <button
                type="submit"
                disabled={isLoading}
                aria-disabled={isLoading}
                aria-label={isLoading ? 'Subscribing, please wait' : 'Subscribe to newsletter'}
                className="gap-x-2 flex items-center relative justify-center gap-2 px-8 py-4 bg-linear-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-2xl transition-all overflow-hidden h-15 cursor-pointer hover:from-purple-600 hover:to-purple-700 duration-300 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
              >
                {isLoading && (
                  <div
                    aria-hidden="true"
                    className="w-4 h-4 rounded-full border-2 border-white border-t-0 animate-spin"
                  />
                )}
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <div aria-hidden="true" className="dark:border-neutral-800 border-neutral-200 border-t" />

        {/* Bottom Footer */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between pt-8 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="dark:text-neutral-500 text-neutral-500">
            &copy; {new Date().getFullYear()} Boys &amp; Girls Club of Lynn. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 mt-4 md:mt-0 dark:text-neutral-500 text-neutral-500">
            <span>Designed &amp; built by</span>
            <Link
              href="https://sqysh.io?lead_source=bgcl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sqysh - opens in a new tab"
              className="sqysh-gradient font-semibold inline-flex items-center gap-1 group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
            >
              <span>Sqysh</span>
              <svg
                aria-hidden="true"
                className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
