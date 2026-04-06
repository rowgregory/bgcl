'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Briefcase, Heart, Trophy } from 'lucide-react'
import { containerVariants, itemVariants } from '@/app/lib/constants/motion'
import Picture from '@/app/components/common/Picture'
import { store } from '@/app/lib/store/store'
import { setOpenVolunteerDrawer } from '@/app/lib/store/slices/appSlice'
import YouthOfTheYearSection from '../home/YouthOfTheYearSection'

const AwardWinnersClient = ({ newsAndTeamMembers, pageData }) => {
  const t = pageData?.sections?.awards

  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <main id="main-content" className="dark:bg-neutral-950 bg-white">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12" aria-label="Award Winners Hero">
          <div className="max-w-334 mx-auto">
            <motion.div
              className="space-y-4 sm:space-y-6"
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
          </div>
        </section>

        {/* 2025 Honorees Section */}
        <section
          className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50"
          aria-label="2025 Award Winners"
        >
          <div className="max-w-334 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4">
                {t.honorees_heading}
              </h2>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">{t.honorees_subheading}</p>
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
                  <motion.article
                    key={index}
                    variants={itemVariants}
                    className="group dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 border rounded-xl sm:rounded-2xl overflow-hidden hover:border-sky-500/50 transition-colors"
                  >
                    {/* Image */}
                    <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden dark:bg-neutral-800 bg-neutral-100">
                      <Picture
                        src={item.image}
                        alt={item.name}
                        priority={true}
                        className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="dark:bg-sky-600/20 bg-sky-600/10 p-1.5 sm:p-2 rounded-lg">
                          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 dark:text-sky-400 text-sky-600" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-widest mb-1.5 sm:mb-2">
                            {item.title}
                          </p>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold dark:text-white text-neutral-900 wrap-break-word">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          </div>
        </section>

        <YouthOfTheYearSection youth={newsAndTeamMembers.data.teamMembers.youth[0]} />

        {/* Hall of Fame Section */}
        <section className="py-20 px-6 md:px-12" aria-label="Hall of Fame Inductees">
          <div className="max-w-334 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4">
                {t.fame_heading}
              </h2>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">{t.fame_subheading}</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {newsAndTeamMembers?.data?.teamMembers?.fame?.map((item, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-4 border dark:border-neutral-800 border-neutral-200 hover:border-sky-500/50 transition-colors flex items-center gap-3"
                >
                  <p className="dark:text-neutral-300 text-neutral-700 font-medium">{item?.name}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Helping Hands Business of the Year Section */}
        <section
          className="py-20 px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50"
          aria-labelledby="helping-hands-heading"
        >
          <div className="max-w-334 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2
                id="helping-hands-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4"
              >
                {t.helping_heading}
              </h2>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">{t.helping_subheading}</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {newsAndTeamMembers?.data?.teamMembers?.helping?.map((item, index) => (
                <motion.article
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 border rounded-lg p-4 hover:border-sky-500/50 transition-colors flex items-center gap-3"
                >
                  {/* Decorative icon */}
                  <Briefcase className="w-5 h-5 shrink-0" aria-hidden="true" />

                  <p className="dark:text-neutral-300 text-neutral-700 font-medium">{item?.name}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Commitment to Youth Recipients Section */}
        <section className="py-20 px-6 md:px-12" aria-labelledby="youth-recipients-heading">
          <div className="max-w-334 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2
                id="youth-recipients-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-black dark:text-white text-neutral-900 mb-3 sm:mb-4"
              >
                {t.commitment_heading}
              </h2>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600">{t.commitment_subheading}</p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {newsAndTeamMembers?.data?.teamMembers?.commitment?.map((item, index) => (
                <motion.article
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="dark:bg-neutral-900/50 bg-neutral-50 rounded-lg p-4 border dark:border-neutral-800 border-neutral-200 hover:border-sky-500/50 transition-colors flex items-start gap-3"
                >
                  {/* Decorative icon */}
                  <Heart className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />

                  <p className="dark:text-neutral-300 text-neutral-700 font-medium">{item?.name}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-12 dark:bg-neutral-900/50 bg-neutral-50" aria-labelledby="cta-heading">
          <div className="max-w-3xl mx-auto text-center">
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

              <p className="text-lg dark:text-neutral-400 text-neutral-600">{t.cta_subheading}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => store.dispatch(setOpenVolunteerDrawer())}
                  className="cursor-pointer px-8 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-offset-2"
                >
                  Volunteer
                </button>

                <Link
                  href="/donate"
                  className="px-8 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:text-white text-neutral-900 font-semibold rounded-lg transition-colors border dark:border-neutral-600 border-neutral-300 focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-offset-2"
                >
                  Donate
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}

export default AwardWinnersClient
