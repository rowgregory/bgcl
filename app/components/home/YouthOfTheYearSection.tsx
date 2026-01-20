'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import Picture from '../common/Picture'
import { store } from '@/app/lib/store/store'
import { setOpenVolunteerDrawer } from '@/app/lib/store/slices/appSlice'

export default function YouthOfTheYearSection({ youth }) {
  return (
    <div className="dark:bg-neutral-950 bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start"
        >
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Decorative Badge */}
              <div className="absolute top-6 left-6 z-10 dark:bg-white/10 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border dark:border-white/20 border-white/30">
                <p className="text-xs font-semibold dark:text-white text-neutral-900 uppercase tracking-widest">
                  {youth?.year} Youth of the Year
                </p>
              </div>

              {/* Image */}
              <Picture src={youth?.image} alt={youth?.name} priority={false} className="object-cover w-full h-full" />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>

            {/* Name Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent"
            >
              <h1 className="text-3xl md:text-4xl font-black text-white">{youth?.name}</h1>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 dark:text-sky-400 text-sky-600" />
                <p className="text-sm font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-widest">
                  Award Winner
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900">Meet {youth?.name}</h2>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Paragraph 1 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed"
              >
                {youth?.paragraph1}
              </motion.p>

              {/* Paragraph 2 */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed"
              >
                {youth?.paragraph2}
              </motion.p>

              {/* Paragraph 3 */}
              {youth?.paragraph3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed"
                >
                  {youth?.paragraph3}
                </motion.p>
              )}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-6 border-t dark:border-neutral-800 border-neutral-200"
            >
              <p className="dark:text-neutral-400 text-neutral-600 text-sm mb-4">
                Want to support youth like {youth?.name?.split(' ')[0]}?
              </p>
              <div className="flex gap-4">
                <Link
                  href="/donate"
                  className="flex-1 px-6 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors text-center"
                >
                  Donate
                </Link>
                <button
                  onClick={() => store.dispatch(setOpenVolunteerDrawer())}
                  className="flex-1 px-6 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold rounded-lg transition-colors text-center"
                >
                  Volunteer
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Related Stories Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-20 pt-16 border-t dark:border-neutral-800 border-neutral-200"
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-black dark:text-white text-neutral-900 mb-2">More Youth Stories</h3>
              <p className="dark:text-neutral-400 text-neutral-600">
                Discover other incredible young people in our community
              </p>
            </div>
            <Link
              href="/stories?section=youth"
              className="inline-flex items-center gap-2 px-6 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold rounded-lg transition-colors"
            >
              View All Stories
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
