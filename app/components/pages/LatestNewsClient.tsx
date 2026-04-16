'use client'

import { useId, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSubscriber } from '@/app/lib/actions/createSubscriber'
import { setIsLoading } from '@/app/lib/store/slices/formSlice'
import { showToast } from '@/app/lib/store/slices/toastSlice'
import { store, useFormSelector } from '@/app/lib/store/store'
import { INewsletter } from '@/types/entities/newsletter'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Download, Calendar, ArrowRight } from 'lucide-react'
import Picture from '../common/Picture'
import { formatDate } from '@/app/lib/utils/date-utils'
import { INews } from '@/types/entities/news'
import { containerVariants, itemVariants } from '@/app/lib/constants/motion'

export default function LatestNewsClient({
  newsletters,
  news,
  pageData
}: {
  newsletters: INewsletter[]
  news: INews[]
  pageData: any
}) {
  const t = pageData.sections.news
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [memberType, setMemberType] = useState<'member' | 'donor' | 'non-member'>('member')
  const { isLoading } = useFormSelector()
  const formRef = useRef<HTMLFormElement>(null)
  const emailInputId = useId()
  const errorId = useId()
  const successId = useId()
  const statusRegionRef = useRef<HTMLDivElement>(null)

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
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:px-4 focus-visible:py-2 focus-visible:bg-sky-600 focus-visible:text-white focus-visible:font-semibold focus-visible:rounded-lg focus-visible:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <main id="main-content">
        <section aria-labelledby="latest-news-heading" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
          <div className="max-w-334 mx-auto">
            <motion.div
              className="space-y-4 sm:space-y-6 mb-12 sm:mb-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-3 sm:space-y-4">
                <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                  {t.eyebrow}
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                  {t.heading}
                </h1>
                <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">{t.subheading}</p>
              </div>
            </motion.div>

            {/* News Grid */}
            <section aria-labelledby="news-grid-heading">
              <h2 id="news-grid-heading" className="sr-only">
                News Articles
              </h2>
              <motion.ul
                role="list"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 sm:mb-16 list-none p-0 m-0"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {news?.map((newsItem) => (
                  <motion.li key={newsItem.id} variants={itemVariants} className="flex">
                    <article
                      aria-labelledby={`news-title-${newsItem.id}`}
                      className="group dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-xl overflow-hidden border hover:border-sky-500/50 focus-within:border-sky-500/50 transition-all duration-300 flex flex-col h-full w-full"
                    >
                      {/* News Image */}
                      {newsItem.image && (
                        <div
                          className="relative h-48 overflow-hidden dark:bg-neutral-800 bg-neutral-100"
                          aria-hidden="true"
                        >
                          <Picture
                            src={newsItem.image}
                            alt=""
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
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          <time dateTime={newsItem?.createdAt ? new Date(newsItem.createdAt).toISOString() : undefined}>
                            {formatDate(newsItem.createdAt)}
                          </time>
                        </div>

                        {/* Title */}
                        <h3
                          id={`news-title-${newsItem.id}`}
                          className="text-xl font-bold dark:text-white text-neutral-900 mb-3 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors line-clamp-3"
                        >
                          {newsItem.title}
                        </h3>

                        {/* Preview Text */}
                        <p className="dark:text-neutral-400 text-neutral-600 text-sm mb-4 flex-1 line-clamp-2">
                          {newsItem.paragraph1}
                        </p>

                        {/* Read More Link */}
                        <Link
                          href={`/latest-news/${newsItem.id}`}
                          className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 font-semibold text-sm group-hover:gap-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
                          aria-label={`Read more about ${newsItem.title}`}
                        >
                          Read More
                          <ArrowRight
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </article>
                  </motion.li>
                ))}
              </motion.ul>
            </section>

            {/* Live region for form status announcements */}
            <div ref={statusRegionRef} aria-live="polite" aria-atomic="true" className="sr-only">
              {success && 'Successfully subscribed! Check your email for updates.'}
              {error && `Error: Please enter a${!email ? 'n' : ' valid'} email address.`}
            </div>

            {/* Newsletter Subscription */}
            <section aria-labelledby="subscribe-heading">
              <motion.form
                ref={formRef}
                onSubmit={handleSubscribe}
                noValidate
                aria-describedby={error ? errorId : success ? successId : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="dark:bg-neutral-900/50 bg-white dark:border-neutral-800 border-neutral-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 border mb-12 sm:mb-16"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <Mail className="w-6 h-6 sm:w-8 sm:h-8 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
                  <h2 id="subscribe-heading" className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900">
                    {t.subscribe_heading}
                  </h2>
                </div>
                <p className="dark:text-neutral-300 text-neutral-700 mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base">
                  {t.subscribe_subheading}
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
                      className="mb-6 sm:mb-8 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
                    >
                      <div className="shrink-0" aria-hidden="true">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-red-800 dark:text-red-200">Error</p>
                        <p className="text-[10px] sm:text-xs text-red-700 dark:text-red-300">
                          Please enter a{!email ? 'n' : ' valid'} email address.
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
                      className="mb-6 sm:mb-8 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
                    >
                      <div className="shrink-0" aria-hidden="true">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          focusable="false"
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
                          Check your email for updates.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Membership Type */}
                <fieldset className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 border-0 p-0 m-0">
                  <legend className="text-xs sm:text-sm font-medium dark:text-neutral-300 text-neutral-700">
                    Please specify your membership type:
                  </legend>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="memberType"
                        value="member"
                        checked={memberType === 'member'}
                        className="w-4 h-4 accent-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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
                        className="w-4 h-4 accent-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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
                        className="w-4 h-4 accent-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        onChange={(e) => setMemberType(e.target.value as 'member' | 'donor' | 'non-member')}
                      />
                      <span className="text-xs sm:text-sm dark:text-neutral-300 text-neutral-700">Donor</span>
                    </label>
                  </div>
                </fieldset>

                {/* Email Input and Subscribe */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md">
                  <div className="flex-1 flex flex-col gap-1">
                    <label
                      htmlFor={emailInputId}
                      className="text-xs sm:text-sm font-medium dark:text-neutral-300 text-neutral-700"
                    >
                      Email address <span aria-hidden="true">*</span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <input
                      id={emailInputId}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      value={email}
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-required="true"
                      aria-invalid={error ? 'true' : 'false'}
                      aria-describedby={error ? errorId : undefined}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-neutral-50 border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    aria-disabled={isLoading}
                    aria-busy={isLoading}
                    className="self-end gap-x-2 flex items-center justify-center px-6 py-2.5 sm:py-3 text-sm sm:text-base dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading && (
                      <>
                        <div
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white border-t-0 animate-spin"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Subscribing, please wait…</span>
                      </>
                    )}
                    <span aria-hidden={isLoading}>Subscribe</span>
                  </button>
                </div>
              </motion.form>
            </section>
          </div>
        </section>

        {/* Newsletters Section */}
        <section
          aria-labelledby="newsletters-heading"
          className="py-20 px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50"
        >
          <div className="max-w-334 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 id="newsletters-heading" className="text-4xl font-black dark:text-white text-neutral-900 mb-4">
                {t.newsletters_heading}
              </h2>
              <p className="text-lg dark:text-neutral-400 text-neutral-600">{t.newsletters_subheading}</p>
            </motion.div>

            {Object.entries(
              newsletters.reduce((acc: Record<number, typeof newsletters>, newsletter) => {
                if (!acc[newsletter.year]) acc[newsletter.year] = []
                acc[newsletter.year].push(newsletter)
                return acc
              }, {})
            )
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, items]) => (
                <div key={year} className="mb-12">
                  {/* Year header */}
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-2xl font-black dark:text-white text-neutral-900">{year}</h3>
                    <div
                      className="flex-1 h-px dark:bg-neutral-800 bg-neutral-200"
                      role="separator"
                      aria-hidden="true"
                    />
                    <span
                      className="text-xs font-semibold dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-400 text-neutral-600 px-3 py-1 rounded-full"
                      aria-label={`${items.length} issue${items.length !== 1 ? 's' : ''} in ${year}`}
                    >
                      {items.length} issue{items.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <motion.ul
                    role="list"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 m-0"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {items.map((newsletter, n) => (
                      <motion.li key={n} variants={itemVariants}>
                        <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 border rounded-xl p-6 hover:border-sky-500/50 focus-within:border-sky-500/50 transition-colors group">
                          <div className="flex items-start justify-between mb-4">
                            <Mail className="w-6 h-6 dark:text-sky-400 text-sky-600 shrink-0" aria-hidden="true" />
                            <span className="text-xs font-semibold dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-400 text-neutral-600 px-3 py-1 rounded-full">
                              {newsletter.month}
                            </span>
                          </div>
                          <p className="text-lg font-bold dark:text-white text-neutral-900 mb-4 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors">
                            {newsletter.month} {newsletter.year}
                          </p>

                          <a
                            href={newsletter.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Download ${newsletter.month} ${newsletter.year} newsletter PDF (opens in new tab)`}
                            className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
                          >
                            <Download className="w-4 h-4" aria-hidden="true" />
                            Download PDF
                          </a>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              ))}
          </div>
        </section>

        {/* CTA Section */}
        <section aria-labelledby="cta-heading" className="dark:bg-neutral-900/50 bg-neutral-50 py-20 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 id="cta-heading" className="text-4xl font-black dark:text-white text-neutral-900">
                {t.cta_heading}
              </h2>
              <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl mx-auto">{t.cta_subheading}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:781-593-1772"
                  className="px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                  aria-label="Call us at 781-593-1772"
                >
                  Call Us
                </a>
                <a
                  href="mailto:info@bgcl.org"
                  className="px-6 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:text-white text-neutral-900 font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                  aria-label="Send email to info@bgcl.org"
                >
                  Send Email
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
