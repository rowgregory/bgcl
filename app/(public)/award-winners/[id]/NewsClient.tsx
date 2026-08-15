'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, Mail, Share2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { News } from '@prisma/client'

import Picture from '@/components/_shared/Picture'
import { formatDate } from '@/lib/utils/date-utils'
import { createSubscriber } from '@/lib/actions/subscriber/createSubscriber'
import {
  EMPTY_SUBSCRIBER,
  subscriberSchema,
  type SubscriberFormInput,
  type SubscriberFormValues
} from '@/lib/validations/subscriber.validation'
import { SUBSCRIBER_TYPE_OPTIONS } from '@/lib/constants/subscriber.constants'

export default function NewsClient({ news }: { news: News }) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<SubscriberFormInput, unknown, SubscriberFormValues>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: EMPTY_SUBSCRIBER,
    mode: 'onTouched'
  })

  const handleSubscribe = handleSubmit(async (values) => {
    try {
      const res = await createSubscriber(values)

      if (!res.success) {
        setError('root', { message: res.error })
        return
      }

      reset(EMPTY_SUBSCRIBER)
      setSubscribed(true)
      router.refresh()
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' })
    }
  })

  const handleShare = async () => {
    const url = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title: news.title, text: news.paragraph1, url })
        return
      }

      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // User dismissed the share sheet, or the clipboard was blocked
    }
  }

  return (
    <div className="min-h-screen py-20 px-6 md:px-12">
      <div className="max-w-334 mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href="/latest-news"
            className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold text-sm">Back to Latest News</span>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Left Column - Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Hero Image */}
            {news?.image && (
              <div className="relative h-96 overflow-hidden rounded-xl dark:bg-neutral-800 bg-neutral-100">
                <Picture src={news?.image} alt={news?.title} className="object-cover w-full h-full" priority />
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 dark:text-neutral-400 text-neutral-600">
                <Calendar className="w-4 h-4" />
                <time dateTime={news?.createdAt ? new Date(news?.createdAt).toISOString() : undefined}>
                  {formatDate(news.createdAt)}
                </time>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors dark:text-neutral-300 text-neutral-700 font-semibold text-sm"
              >
                <Share2 className="w-4 h-4" />
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              {news?.title}
            </h1>

            {/* Body Text */}
            <div className="space-y-6 text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {news?.paragraph1 && <p>{news?.paragraph1}</p>}
              {news?.paragraph2 && <p>{news?.paragraph2}</p>}
              {news?.paragraph3 && <p>{news?.paragraph3}</p>}
            </div>
          </motion.article>

          {/* Right Column - Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Newsletter Signup */}
            <div className="relative overflow-hidden dark:bg-linear-to-br dark:from-neutral-900 dark:to-neutral-800 bg-linear-to-br from-white to-neutral-50 rounded-2xl p-6 border dark:border-neutral-800 border-transparent">
              {/* Decorative linear blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold dark:text-white text-neutral-900">Stay Updated</h3>
                </div>
                <p className="text-sm dark:text-neutral-400 text-neutral-600 mb-4">
                  Get the latest news delivered to your inbox.
                </p>

                {/* Error Banner */}
                <AnimatePresence>
                  {errors.root && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      role="alert"
                      className="mb-8 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
                      <p className="text-sm text-red-800 dark:text-red-200">{errors.root.message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Banner */}
                <AnimatePresence>
                  {subscribed && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      role="status"
                      className="mb-8 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3"
                    >
                      <CheckCircle2
                        className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                          Thanks for subscribing!
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">Check your email for updates</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubscribe} noValidate className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="subscriberEmail" className="sr-only">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 dark:text-neutral-500 text-neutral-400 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="subscriberEmail"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        aria-invalid={!!errors.email}
                        className="w-full pl-10 pr-3 py-2.5 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:placeholder-neutral-600 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:ring-sky-600 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p role="alert" className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Membership Type */}
                  <div className="space-y-3">
                    <p
                      id="subscriberTypeLabel"
                      className="text-xs font-medium dark:text-neutral-400 text-neutral-600 uppercase tracking-wide"
                    >
                      I am a:
                    </p>
                    <div role="radiogroup" aria-labelledby="subscriberTypeLabel" className="space-y-2">
                      {SUBSCRIBER_TYPE_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                          <input type="radio" value={option.value} className="sr-only peer" {...register('type')} />
                          <div className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600 peer-checked:bg-sky-600 dark:peer-checked:bg-sky-500 peer-checked:border-sky-600 dark:peer-checked:border-sky-500 transition-all" />
                          <span className="text-sm dark:text-neutral-400 text-neutral-600 group-hover:dark:text-neutral-300 group-hover:text-neutral-900 transition-colors">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Subscribe Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-x-2 flex items-center px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting && (
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white border-t-0 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px dark:bg-neutral-800 bg-neutral-200 my-16" />
      </div>

      {/* All News CTA */}
      <section className="dark:bg-neutral-900/50 bg-neutral-50 py-16 px-6 md:px-12">
        <div className="max-w-334 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-black dark:text-white text-neutral-900">More News & Updates</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl mx-auto">
              Explore all the latest news and announcements from the Boys & Girls Club of Lynn.
            </p>
            <Link href="/latest-news">
              <button className="px-8 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors">
                View All News
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
