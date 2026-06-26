'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, Mail, Share2 } from 'lucide-react'
import { useState } from 'react'
import Picture from '@/app/components/common/Picture'
import { formatDate } from '@/app/lib/utils/date-utils'
import { store, useFormSelector } from '@/app/lib/store/store'
import { useRouter } from 'next/navigation'
import { setIsLoading } from '@/app/lib/store/slices/formSlice'
import { createSubscriber } from '@/app/lib/actions/subscriber/createSubscriber'
import { showToast } from '@/app/lib/store/slices/toastSlice'

// const relatedNews = [
//   {
//     id: '2',
//     title: 'Youth of the Year Announced: A Celebration of Excellence',
//     image: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca723fe76f5441716e1e97_boxing.jpg',
//     createdAt: new Date('2025-01-05'),
//     updatedAt: new Date('2025-01-05')
//   },
//   {
//     id: '3',
//     title: 'Record Attendance at Winter Programs',
//     image: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca71ef75314df465ef53b9_bowling.jpg',
//     createdAt: new Date('2024-12-28'),
//     updatedAt: new Date('2024-12-28')
//   },
//   {
//     id: '4',
//     title: 'Cummings Foundation Grant Strengthens Scholarship Program',
//     image: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca71e2c493e82886f0cb7e_basketball.jpg',
//     createdAt: new Date('2024-12-20'),
//     updatedAt: new Date('2024-12-20')
//   }
// ]

const NewsClient = ({ news }) => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [copied, setCopied] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const { isLoading } = useFormSelector()
  const [memberType, setMemberType] = useState<'member' | 'donor' | 'non-member'>('member')

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

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''

    if (navigator.share) {
      await navigator.share({
        title: news?.title,
        text: news?.paragraph1,
        url: url
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
            {/* Related Articles */}
            {/* <div className="dark:bg-neutral-900/50 bg-neutral-50 rounded-xl p-6">
              <h3 className="text-xl font-black dark:text-white text-neutral-900 mb-6">Related Articles</h3>
              <div className="space-y-4">
                {relatedNews.map((article) => (
                  <Link key={article?.id} href={`/latest-news/${article?.id}`}>
                    <div className="group cursor-pointer">
                      <h4 className="text-sm font-bold dark:text-white text-neutral-900 mb-2 line-clamp-2 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors">
                        {article?.title}
                      </h4>
                      <p className="text-xs dark:text-neutral-500 text-neutral-500">{formatDate(article?.createdAt)}</p>
                      <div className="h-px dark:bg-neutral-800 bg-neutral-200 mt-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div> */}

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
                  {error && (
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
                        <p className="text-sm font-semibold text-red-800 dark:text-red-200">Error!</p>
                        <p className="text-xs text-red-700 dark:text-red-300">
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
                      className="mb-8 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3"
                    >
                      <div className="shrink-0">
                        <svg
                          className="w-5 h-5 text-green-600 dark:text-green-400"
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
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                          Thanks for subscribing!
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">Check your email for updates</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  {/* Email Input */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 dark:text-neutral-500 text-neutral-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:placeholder-neutral-600 dark:focus:ring-sky-500 bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:ring-sky-600 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Membership Type */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium dark:text-neutral-400 text-neutral-600 uppercase tracking-wide">
                      I am a:
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="memberType"
                          value="member"
                          defaultChecked
                          className="sr-only peer"
                          onChange={(e) => setMemberType(e.target.value as 'member' | 'donor' | 'non-member')}
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600 peer-checked:bg-sky-600 dark:peer-checked:bg-sky-500 peer-checked:border-sky-600 dark:peer-checked:border-sky-500 transition-all" />
                        <span className="text-sm dark:text-neutral-400 text-neutral-600 group-hover:dark:text-neutral-300 group-hover:text-neutral-900 transition-colors">
                          Member/Parent
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="memberType"
                          value="non-member"
                          className="sr-only peer"
                          onChange={(e) => setMemberType(e.target.value as 'member' | 'donor' | 'non-member')}
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600 peer-checked:bg-sky-600 dark:peer-checked:bg-sky-500 peer-checked:border-sky-600 dark:peer-checked:border-sky-500 transition-all" />
                        <span className="text-sm dark:text-neutral-400 text-neutral-600 group-hover:dark:text-neutral-300 group-hover:text-neutral-900 transition-colors">
                          Non-Member
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="memberType"
                          value="donor"
                          className="sr-only peer"
                          onChange={(e) => setMemberType(e.target.value as 'member' | 'donor' | 'non-member')}
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-600 peer-checked:bg-sky-600 dark:peer-checked:bg-sky-500 peer-checked:border-sky-600 dark:peer-checked:border-sky-500 transition-all" />
                        <span className="text-sm dark:text-neutral-400 text-neutral-600 group-hover:dark:text-neutral-300 group-hover:text-neutral-900 transition-colors">
                          Donor
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Subscribe Button */}
                  <button
                    type="submit"
                    className="gap-x-2 flex items-center px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {isLoading && (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-0 animate-spin" />
                    )}{' '}
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

export default NewsClient
