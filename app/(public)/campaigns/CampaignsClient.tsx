'use client'

import { containerVariants, itemVariants } from '@/lib/constants/motion'
import { ICampaign } from '@/types/entities/campaign'
import { motion } from 'framer-motion'
import { Heart, Users, Target, ArrowRight, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MotionLink } from '@/components/_shared/MotionLink'
import Picture from '@/components/_shared/Picture'

export default function CampaignsClient({ campaigns, pageData }: { campaigns: ICampaign[]; pageData: any }) {
  const router = useRouter()
  const t = pageData.sections.campaigns

  const getProgressPercentage = (current: number, goal: number): number => {
    return Math.min((current / goal) * 100, 100)
  }

  const getAmountRemaining = (current: number, goal: number): number => {
    return Math.max(0, goal - current)
  }

  return (
    <main id="main-content" className="min-h-screen py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-334 mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
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

        {campaigns && campaigns.length > 0 ? (
          <motion.ul
            aria-label="Active fundraising campaigns"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 list-none p-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {campaigns.map((campaign) => {
              const progress = getProgressPercentage(campaign.currentAmount, campaign.goalAmount)
              const remaining = getAmountRemaining(campaign.currentAmount, campaign.goalAmount)
              const supporters = campaign._count?.orders || 0
              const href = campaign?.name === 'Capital Campaign' ? '/capital-campaign' : `/campaigns/${campaign.id}`

              return (
                <motion.li key={campaign.id} variants={itemVariants}>
                  <div
                    onClick={() => router.push(href)}
                    aria-label={`${campaign.name} - ${campaign.isActive ? 'Active' : 'Ended'} - $${campaign.currentAmount?.toLocaleString()} raised of $${campaign.goalAmount?.toLocaleString()} goal - ${Math.round(progress)}% funded`}
                    className="group dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-sky-500/50 bg-white border-neutral-200 border hover:border-sky-500/50 rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                  >
                    <motion.div className="h-full flex flex-col" whileHover={{ y: -4 }}>
                      {/* Image */}
                      {campaign.image && (
                        <div className="relative h-96 md:h-125 overflow-hidden dark:bg-neutral-800 bg-neutral-100">
                          <Picture
                            src={campaign.image}
                            alt={campaign.name}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            priority
                          />
                          {/* Status Badge */}
                          <div
                            aria-hidden="true"
                            className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-3 py-1 rounded-full backdrop-blur-sm bg-black/50 border border-white/20"
                          >
                            <span className="text-[10px] sm:text-xs font-semibold text-white flex items-center gap-1">
                              <span
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${campaign.isActive ? 'bg-green-400' : 'bg-neutral-400'}`}
                              />
                              {campaign.isActive ? 'Active' : 'Ended'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex flex-col grow">
                        {/* Title & Organizer */}
                        <div className="space-y-1.5 sm:space-y-2">
                          <h2 className="text-xl sm:text-2xl font-black dark:text-white text-neutral-900 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {campaign.name}
                          </h2>
                          <p className="text-xs sm:text-sm dark:text-neutral-500 text-neutral-600 flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="w-1 h-1 rounded-full dark:bg-neutral-600 bg-neutral-400"
                            />
                            {campaign.organizerName}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm dark:text-neutral-400 text-neutral-600 line-clamp-2 leading-relaxed">
                          {campaign.description}
                        </p>

                        {/* Progress Section */}
                        <div className="space-y-3 sm:space-y-4 grow">
                          {/* Amount Display */}
                          <dl className="flex items-end justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <dt className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-1">
                                Raised
                              </dt>
                              <dd className="text-xl sm:text-2xl md:text-3xl font-black dark:text-white text-neutral-900 wrap-break-word">
                                ${campaign.currentAmount?.toLocaleString()}
                              </dd>
                            </div>
                            <div className="text-right min-w-0 shrink-0">
                              <dt className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-1">
                                Goal
                              </dt>
                              <dd className="text-base sm:text-lg md:text-xl font-bold dark:text-neutral-400 text-neutral-600 wrap-break-word">
                                ${campaign.goalAmount?.toLocaleString()}
                              </dd>
                            </div>
                          </dl>

                          {/* Progress Bar */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="flex items-center justify-between" aria-hidden="true">
                              <span className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600">
                                Progress
                              </span>
                              <span className="text-xs sm:text-sm font-black dark:text-sky-400 text-sky-600">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div
                              role="progressbar"
                              aria-valuenow={Math.round(progress)}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${campaign.name} funding progress: ${Math.round(progress)}%`}
                              className="w-full h-2.5 sm:h-3 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden"
                            >
                              <motion.div
                                aria-hidden="true"
                                className="h-full bg-linear-to-r from-sky-500 via-sky-400 to-sky-600 shadow-lg shadow-sky-500/30"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                              />
                            </div>
                          </div>

                          {/* Stats Row */}
                          <dl className="grid grid-cols-3 gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t dark:border-neutral-800 border-neutral-200">
                            <div className="text-center">
                              <dt className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                                <Target
                                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 dark:text-sky-400 text-sky-600"
                                  aria-hidden="true"
                                />
                                <span className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600">
                                  To Go
                                </span>
                              </dt>
                              <dd>
                                {remaining > 0 ? (
                                  <p className="text-xs sm:text-sm font-black dark:text-white text-neutral-900">
                                    ${remaining?.toLocaleString()}
                                  </p>
                                ) : (
                                  <p className="text-[10px] sm:text-xs font-black dark:text-green-400 text-green-600">
                                    Complete!
                                  </p>
                                )}
                              </dd>
                            </div>

                            {supporters > 0 && (
                              <div className="text-center">
                                <dt className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                                  <Users
                                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 dark:text-sky-400 text-sky-600"
                                    aria-hidden="true"
                                  />
                                  <span className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600">
                                    Donors
                                  </span>
                                </dt>
                                <dd className="text-xs sm:text-sm font-black dark:text-white text-neutral-900">
                                  {supporters}
                                </dd>
                              </div>
                            )}

                            {campaign.endDate && (
                              <div className="text-center">
                                <dt className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                                  <Calendar
                                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 dark:text-sky-400 text-sky-600"
                                    aria-hidden="true"
                                  />
                                  <span className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600">
                                    Ends
                                  </span>
                                </dt>
                                <dd className="text-[10px] sm:text-xs font-black dark:text-white text-neutral-900">
                                  {new Date(campaign.endDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        {/* Donate CTA */}
                        <MotionLink
                          onClick={(e) => e.stopPropagation()}
                          href={`/donate?campaignName=${campaign.name}`}
                          aria-label={`Donate to ${campaign.name}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors shadow-lg dark:shadow-sky-600/20 shadow-sky-600/20 text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-600"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                          Donate Now
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                        </MotionLink>
                      </div>
                    </motion.div>
                  </div>
                </motion.li>
              )
            })}
          </motion.ul>
        ) : (
          <motion.div
            role="status"
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-center mb-4 sm:mb-6" aria-hidden="true">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg dark:bg-neutral-800 bg-neutral-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 dark:text-neutral-600 text-neutral-400" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-black dark:text-white text-neutral-900">No Active Campaigns</h2>
              <p className="dark:text-neutral-400 text-neutral-600 text-sm sm:text-base">
                Check back soon for new fundraising campaigns.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
