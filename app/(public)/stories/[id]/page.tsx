'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Share2 } from 'lucide-react'
import { useState } from 'react'
import Picture from '@/app/components/common/Picture'

interface NewsArticle {
  id: string
  title: string
  image?: string
  paragraph1?: string
  paragraph2?: string
  paragraph3?: string
  createdAt: Date
  updatedAt: Date
}

// Mock news article data
const mockArticle: NewsArticle = {
  id: '1',
  title: 'New State-of-the-Art Facility Opens This Fall',
  image: 'https://cdn.prod.website-files.com/67ca71addbada9cbbd57ace7/67ca72481e4ae8c5331ef3a0_club.jpg',
  paragraph1:
    'The Boys & Girls Club of Lynn is excited to announce the opening of our newly renovated facility in Fall 2025. This $18 million capital project represents a transformative investment in our community and the young people we serve.',
  paragraph2:
    'The new facility will feature state-of-the-art amenities including a new aquatics center, expanded game room, upgraded gymnasium facilities, and dedicated spaces for STEM programs. Our enhanced kitchen will allow us to serve more nutritious meals to our members, while new classrooms will support our after-school academic programs. With specialized spaces designed for different age groups and program types, every corner of the facility has been thoughtfully planned to maximize the impact of our programs.',
  paragraph3:
    'This expansion will enable us to serve an additional 500 youth annually and eliminate our current waitlist. We are grateful for the generous support from our donors and community partners who made this vision possible. The construction process has been carefully planned to minimize disruption to our current operations, and we are on track to welcome members to the new facility by September 2025.',
  createdAt: new Date('2025-01-10'),
  updatedAt: new Date('2025-01-10')
}

const relatedNews: NewsArticle[] = [
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

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function NewsDetailPage() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''

    if (navigator.share) {
      try {
        await navigator.share({
          title: mockArticle.title,
          text: mockArticle.paragraph1,
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

  const handleSubmitNewsletter = (e) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 hover:dark:text-sky-300 hover:text-sky-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold text-sm">Back to News</span>
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
            {mockArticle.image && (
              <div className="relative h-96 overflow-hidden rounded-xl dark:bg-neutral-800 bg-neutral-100">
                <Picture
                  src={mockArticle.image}
                  alt={mockArticle.title}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 dark:text-neutral-400 text-neutral-600">
                <Calendar className="w-4 h-4" />
                <time dateTime={mockArticle.createdAt.toISOString()}>{formatDate(mockArticle.createdAt)}</time>
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
              {mockArticle.title}
            </h1>

            {/* Body Text */}
            <div className="space-y-6 text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">
              {mockArticle.paragraph1 && <p>{mockArticle.paragraph1}</p>}
              {mockArticle.paragraph2 && <p>{mockArticle.paragraph2}</p>}
              {mockArticle.paragraph3 && <p>{mockArticle.paragraph3}</p>}
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
                  <Link key={article.id} href={`/news/${article.id}`}>
                    <div className="group cursor-pointer">
                      <h4 className="text-sm font-bold dark:text-white text-neutral-900 mb-2 line-clamp-2 group-hover:dark:text-sky-400 group-hover:text-sky-600 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs dark:text-neutral-500 text-neutral-500">{formatDate(article.createdAt)}</p>
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
            <Link href="/news">
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
