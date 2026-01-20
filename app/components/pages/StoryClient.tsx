'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, Share2 } from 'lucide-react'
import { useState } from 'react'
import Picture from '@/app/components/common/Picture'
import { formatDate } from '@/app/lib/utils/date-utils'

const relatedNews = [
  {
    id: '2',
    title: 'Youth of the Year Announced: A Celebration of Excellence',
    image: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca723fe76f5441716e1e97_boxing.jpg',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05')
  },
  {
    id: '3',
    title: 'Record Attendance at Winter Programs',
    image: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca71ef75314df465ef53b9_bowling.jpg',
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28')
  },
  {
    id: '4',
    title: 'Cummings Foundation Grant Strengthens Scholarship Program',
    image: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca71e2c493e82886f0cb7e_basketball.jpg',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20')
  }
]

const StoryClient = ({ story }) => {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''

    if (navigator.share) {
      try {
        await navigator.share({
          title: story?.title,
          text: story?.paragraph1,
          url: url
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmitNewsletter = (e: { preventDefault: () => void }) => {
    e.preventDefault()
  }
  return (
    <div className="min-h-screen py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold text-sm">Back to Stories</span>
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
            {story?.image && (
              <div className="relative h-96 overflow-hidden rounded-xl dark:bg-neutral-800 bg-neutral-100">
                <Picture src={story?.image} alt={story?.title} className="object-cover w-full h-full" priority />
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 dark:text-neutral-400 text-neutral-600">
                <Calendar className="w-4 h-4" />
                <time dateTime={story?.createdAt ? new Date(story?.createdAt).toISOString() : undefined}>
                  {formatDate(story.createdAt)}
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
              {story?.title}
            </h1>

            {/* Body Text */}
            <div className="space-y-6 text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {story?.paragraph1 && <p>{story?.paragraph1}</p>}
              {story?.paragraph2 && <p>{story?.paragraph2}</p>}
              {story?.paragraph3 && <p>{story?.paragraph3}</p>}
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
            <div className="dark:bg-neutral-900/50 bg-neutral-50 rounded-xl p-6">
              <h3 className="text-xl font-black dark:text-white text-neutral-900 mb-6">Related Articles</h3>
              <div className="space-y-4">
                {relatedNews.map((article) => (
                  <Link key={article?.id} href={`/stories/${article?.id}`}>
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
            </div>

            {/* Newsletter Signup */}
            <div className="dark:bg-linear-to-br dark:from-sky-500/10 dark:to-sky-600/10 bg-linear-to-br from-sky-100 to-sky-50 dark:border-sky-500/20 border-sky-300/30 rounded-xl p-6 border">
              <h3 className="text-lg font-bold dark:text-white text-neutral-900 mb-3">Stay Updated</h3>
              <p className="text-sm dark:text-neutral-300 text-neutral-700 mb-4">
                Subscribe to get the latest news and stories.
              </p>
              <form onSubmit={handleSubmitNewsletter} className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px dark:bg-neutral-800 bg-neutral-200 my-16" />
      </div>

      {/* All News CTA */}
      <section className="dark:bg-neutral-900/50 bg-neutral-50 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-black dark:text-white text-neutral-900">More News & Updates</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl mx-auto">
              Explore all the latest news, announcements, and stories from the Boys & Girls Club of Lynn.
            </p>
            <Link href="/stories">
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

export default StoryClient
