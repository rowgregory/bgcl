'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Briefcase, Calendar, Heart, Trophy } from 'lucide-react'
import { formatDate } from '@/app/lib/utils/date-utils'
import { containerVariants, itemVariants } from '@/app/lib/constants/motion'
import Picture from '@/app/components/common/Picture'
import { store } from '@/app/lib/store/store'
import { setOpenVolunteerDrawer } from '@/app/lib/store/slices/appSlice'

const StoriesClient = ({ newsAndTeamMembers }) => {
  return (
    <div className="dark:bg-neutral-950 bg-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-3 sm:space-y-4">
              <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
                News, Updates & Recognition
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                Stories
              </h1>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
                Stay informed about what's happening at the Boys & Girls Club of Lynn. Read our latest news, celebrate
                our honorees, and discover the impact we're making in our community.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4">
              Latest News & Updates
            </h2>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
              Stay connected with the latest news, events, and announcements from our community.
            </p>
          </motion.div>

          {/* News Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newsAndTeamMembers?.data?.news?.map((newsItem) => (
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
                    href={`/stories/${newsItem.id}`}
                    className="inline-flex items-center gap-2 dark:text-sky-400 text-sky-600 font-semibold text-sm group-hover:gap-3 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2025 Honorees Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4">
              2025 Award Winners
            </h2>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
              Celebrating this year's award-winning honorees and their outstanding contributions.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newsAndTeamMembers?.data?.teamMembers?.honoree?.map((item, index) => {
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 border rounded-xl sm:rounded-2xl overflow-hidden hover:border-sky-500/50 transition-colors"
                >
                  {/* Image */}
                  <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden dark:bg-neutral-800 bg-neutral-100">
                    <Picture
                      src={item.image}
                      alt={item.name}
                      priority={false}
                      className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div className="dark:bg-sky-600/20 bg-sky-600/10 p-1.5 sm:p-2 rounded-lg">
                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 dark:text-sky-400 text-sky-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-widest mb-1.5 sm:mb-2">
                          {item.title}
                        </p>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold dark:text-white text-neutral-900 break-words">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Hall of Fame Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4">
              Hall of Fame Inductees
            </h2>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
              Honoring the distinguished individuals who have shaped our organization's legacy.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newsAndTeamMembers?.data?.teamMembers?.fame?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-4 border dark:border-neutral-800 border-neutral-200 hover:border-sky-500/50 transition-colors flex items-center gap-3"
              >
                <p className="dark:text-neutral-300 text-neutral-700 font-medium">{item?.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Helping Hands Business of the Year Section */}
      <section className="py-20 px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4">
              Helping Hands Business of the Year
            </h2>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
              Celebrating local businesses that have generously supported our mission and community.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newsAndTeamMembers?.data?.teamMembers?.helping?.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 border rounded-lg p-4 hover:border-sky-500/50 transition-colors flex items-center gap-3"
              >
                <Briefcase className="w-5 h-5 dark:text-sky-400 text-sky-600 shrink-0" />
                <p className="dark:text-neutral-300 text-neutral-700 font-medium">{item?.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Commitment to Youth Recipients Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4">
              Commitment to Youth Recipients
            </h2>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">
              Recognizing individuals who have demonstrated exceptional commitment to youth development.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newsAndTeamMembers?.data?.teamMembers?.commitment?.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-4 border dark:border-neutral-800 border-neutral-200 hover:border-sky-500/50 transition-colors flex items-start gap-3"
              >
                <Heart className="w-5 h-5 dark:text-sky-400 text-sky-600 shrink-0 mt-0.5" />
                <p className="dark:text-neutral-300 text-neutral-700 font-medium">{item?.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-black dark:text-white text-neutral-900">Be Part of Our Story</h2>
            <p className="text-lg dark:text-neutral-400 text-neutral-600">
              Whether through volunteering, donating, or spreading the word, there are many ways to support our mission
              and become part of our community's success stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => store.dispatch(setOpenVolunteerDrawer())}
                className="cursor-pointer px-8 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors"
              >
                Volunteer
              </button>

              <Link
                href="/donate"
                className="px-8 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:text-white text-neutral-900 font-semibold rounded-lg transition-colors border dark:border-neutral-600 border-neutral-300"
              >
                Donate
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default StoriesClient
