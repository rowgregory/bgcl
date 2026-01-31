'use client'

import { createSubscriber } from '@/app/lib/actions/createSubscriber'
import { containerVariants, itemVariants } from '@/app/lib/constants/motion'
import { setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store, useFormSelector } from '@/app/lib/store/store'
import { INewsletter } from '@/types/entities/newsletter'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Download, Calendar, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import Picture from '../common/Picture'
import { formatDate } from '@/app/lib/utils/date-utils'
import { INews } from '@/types/entities/news'
import Link from 'next/link'

export default function LatestNewsClient({ newsletters, news }: { newsletters: INewsletter[]; news: INews[] }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [memberType, setMemberType] = useState<'member' | 'donor' | 'non-member'>('member')
  const { isLoading } = useFormSelector()
  const formRef = useRef<HTMLFormElement>(null)

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
    <div className="dark:bg-neutral-950 bg-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="space-y-4 sm:space-y-6 mb-12 sm:mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                Resources & Updates
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                Latest News
              </h1>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                Your one-stop destination for club resources, newsletters, and important information.
              </p>
            </div>
          </motion.div>

          {/* News Section */}

          {/* News Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 sm:mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {news?.map((newsItem) => (
              <motion.article
                key={newsItem.id}
                variants={itemVariants}
                className="group dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-xl overflow-hidden border hover:border-sky-500/50 transition-all duration-300 flex flex-col h-full"
              >
                {/* News Image */}
                {newsItem.image && (
                  <div className="relative h-48 overflow-hidden dark:bg-neutral-800 bg-neutral-100">
                    <Picture
                      src={newsItem.image}
                      alt={newsItem.title}
                      priority={true}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 dark:bg-black/20 group-hover:dark:bg-black/10 bg-black/10 group-hover:bg-black/5 transition-colors" />
                  </div>
                )}

                {/* News Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Date */}
                  <div className="flex items-center gap-2 dark:text-neutral-400 text-neutral-600 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={newsItem?.createdAt ? new Date(newsItem.createdAt).toISOString() : undefined}>
                      {formatDate(newsItem.createdAt)}
                    </time>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold dark:text-white text-neutral-900 mb-3 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors line-clamp-3">
                    {newsItem.title}
                  </h2>

                  {/* Preview Text */}
                  <p className="dark:text-neutral-400 text-neutral-600 text-sm mb-4 flex-1 line-clamp-2">
                    {newsItem.paragraph1}
                  </p>

                  {/* Read More Link */}
                  <Link
                    href={`/latest-news/${newsItem.id}`}
                    className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 font-semibold text-sm group-hover:gap-3 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Newsletter Subscription */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubscribe}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="dark:bg-neutral-900/50 bg-white dark:border-neutral-800 border-neutral-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 border mb-12 sm:mb-16"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 dark:text-sky-400 text-sky-600 shrink-0" />
              <h3 className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900">Stay Updated</h3>
            </div>
            <p className="dark:text-neutral-300 text-neutral-700 mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base">
              Subscribe to our newsletter and never miss important updates, program announcements, and community news.
            </p>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="mb-6 sm:mb-8 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
                >
                  <div className="shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-red-800 dark:text-red-200">Error!</p>
                    <p className="text-[10px] sm:text-xs text-red-700 dark:text-red-300">
                      Please enter a{!email ? 'n' : ' valid'} email
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Success Banner */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="mb-6 sm:mb-8 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
                >
                  <div className="shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-green-800 dark:text-green-200">
                      Thanks for subscribing!
                    </p>
                    <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-300">
                      Check your email for updates
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Membership Type */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm font-medium dark:text-neutral-300 text-neutral-700">
                Please specify if you are the following:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="memberType"
                    value="member"
                    checked={memberType === 'member'}
                    className="w-4 h-4 accent-sky-600"
                    onChange={(e) => setMemberType(e.target.value as 'member' | 'donor' | 'non-member')}
                  />
                  <span className="text-xs sm:text-sm dark:text-neutral-300 text-neutral-700">Member/Parent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="memberType"
                    value="non-member"
                    checked={memberType === 'non-member'}
                    className="w-4 h-4 accent-sky-600"
                    onChange={(e) => setMemberType(e.target.value as 'member' | 'donor' | 'non-member')}
                  />
                  <span className="text-xs sm:text-sm dark:text-neutral-300 text-neutral-700">Non-Member</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="memberType"
                    value="donor"
                    checked={memberType === 'donor'}
                    className="w-4 h-4 accent-sky-600"
                    onChange={(e) => setMemberType(e.target.value as 'member' | 'donor' | 'non-member')}
                  />
                  <span className="text-xs sm:text-sm dark:text-neutral-300 text-neutral-700">Donor</span>
                </label>
              </div>
            </div>

            {/* Email Input and Subscribe */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                value={email}
                placeholder="Enter your email"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              />
              <button
                type="submit"
                className="gap-x-2 flex items-center justify-center px-6 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {isLoading && (
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white border-t-0 animate-spin" />
                )}{' '}
                Subscribe
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Newsletters Section */}
      <section className="py-20 px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-black dark:text-white text-neutral-900 mb-4">Newsletters</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600">
              Download our latest newsletters to stay informed about programs, events, and updates.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newsletters
              .map((newsletter, n) => (
                <motion.div
                  key={n}
                  variants={itemVariants}
                  className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 border rounded-xl p-6 hover:border-sky-500/50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Mail className="w-6 h-6 dark:text-sky-400 text-sky-600 shrink-0" />
                    <span className="text-xs font-semibold dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-400 text-neutral-600 px-3 py-1 rounded-full">
                      {newsletter.month}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold dark:text-white text-neutral-900 mb-2 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors">
                    {newsletter.year}
                  </h3>
                  <a
                    href={newsletter.pdfUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 font-semibold text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </motion.div>
              ))
              .reverse()}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="dark:bg-neutral-900/50 bg-neutral-50 py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-black dark:text-white text-neutral-900">Can't Find What You Need?</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl mx-auto">
              Our team is here to help. Contact us with any questions or to request additional resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:781-593-1772"
                className="px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
              >
                Call Us
              </a>
              <a
                href="mailto:info@bgcl.org"
                className="px-6 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:text-white text-neutral-900 font-semibold rounded-lg transition-colors"
              >
                Send Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
