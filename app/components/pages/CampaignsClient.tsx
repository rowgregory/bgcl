'use client'

import { containerVariants, itemVariants } from '@/app/lib/constants/motion'
import { ICampaign } from '@/types/entities/campaign'
import { motion } from 'framer-motion'
import { Heart, Users, Target, ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CampaignsClient({ campaigns }: { campaigns: ICampaign[] }) {
  const router = useRouter()

  const getProgressPercentage = (current: number, goal: number): number => {
    return (current / goal) * 100
  }

  const getAmountRemaining = (current: number, goal: number): number => {
    return Math.max(0, goal - current)
  }

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <motion.div
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[10px] sm:text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
              Support Our Cause
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              Active Campaigns
            </h1>
            <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
              Every dollar raised directly supports Boys & Girls Club of Lynn programs that empower youth in our
              community.
            </p>
          </div>
        </motion.div>

        {campaigns && campaigns?.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {campaigns?.map((campaign) => {
              const progress = getProgressPercentage(campaign.currentAmount, campaign.goalAmount)
              const remaining = getAmountRemaining(campaign.currentAmount, campaign.goalAmount)
              const supporters = campaign._count?.orders || 0

              return (
                <Link
                  key={campaign.id}
                  href={campaign?.name === 'Capital Campaign' ? `/capital-campaign` : `/campaigns/${campaign.id}`}
                >
                  <motion.div
                    className="group dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-sky-500/50 bg-white border-neutral-200 border hover:border-sky-500/50 rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col"
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                  >
                    {/* Image */}
                    {campaign.image && (
                      <div className="relative h-48 sm:h-60 md:h-125 overflow-hidden dark:bg-neutral-800 bg-neutral-100">
                        <img
                          src={campaign.image}
                          alt={campaign.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Status Badge */}
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-3 py-1 rounded-full backdrop-blur-sm bg-black/50 border border-white/20">
                          <span className="text-[10px] sm:text-xs font-semibold text-white flex items-center gap-1">
                            <span
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${campaign.isActive ? 'bg-green-400' : 'bg-neutral-400'}`}
                            ></span>
                            {campaign.isActive ? 'Active' : 'Ended'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex flex-col grow">
                      {/* Title & Organizer */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black dark:text-white text-neutral-900 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {campaign.name}
                        </h3>
                        <p className="text-xs sm:text-sm dark:text-neutral-500 text-neutral-600 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full dark:bg-neutral-600 bg-neutral-400"></span>
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
                        <div className="flex items-end justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-1">
                              Raised
                            </p>
                            <p className="text-xl sm:text-2xl md:text-3xl font-black dark:text-white text-neutral-900 wrap-break-word">
                              ${campaign.currentAmount?.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right min-w-0 shrink-0">
                            <p className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider mb-1">
                              Goal
                            </p>
                            <p className="text-base sm:text-lg md:text-xl font-bold dark:text-neutral-400 text-neutral-600 wrap-break-word">
                              ${campaign.goalAmount?.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar with Percentage */}
                        <div className="space-y-1.5 sm:space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600">
                              Progress
                            </span>
                            <span className="text-xs sm:text-sm font-black dark:text-sky-400 text-sky-600">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="w-full h-2.5 sm:h-3 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-linear-to-r from-sky-500 via-sky-400 to-sky-600 shadow-lg shadow-sky-500/30"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            />
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t dark:border-neutral-800 border-neutral-200">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                              <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 dark:text-sky-400 text-sky-600" />
                              <span className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600">
                                To Go
                              </span>
                            </div>
                            {remaining > 0 ? (
                              <p className="text-xs sm:text-sm font-black dark:text-white text-neutral-900">
                                ${remaining?.toLocaleString()}
                              </p>
                            ) : (
                              <p className="text-[10px] sm:text-xs font-black dark:text-green-400 text-green-600">
                                Complete!
                              </p>
                            )}
                          </div>

                          {supporters > 0 && (
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                                <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 dark:text-sky-400 text-sky-600" />
                                <span className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600">
                                  Donors
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm font-black dark:text-white text-neutral-900">
                                {supporters}
                              </p>
                            </div>
                          )}

                          {campaign.endDate && (
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 dark:text-sky-400 text-sky-600" />
                                <span className="text-[10px] sm:text-xs dark:text-neutral-500 text-neutral-600">
                                  Ends
                                </span>
                              </div>
                              <p className="text-[10px] sm:text-xs font-black dark:text-white text-neutral-900">
                                {new Date(campaign.endDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault()
                          if (campaign.externalLink) {
                            window.open(campaign.externalLink, '_blank', 'noopener,noreferrer')
                          } else {
                            router.push(`/donate?campaignName=${campaign.name}`)
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors shadow-lg dark:shadow-sky-600/20 shadow-sky-600/20 text-sm sm:text-base"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Donate Now
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg dark:bg-neutral-800 bg-neutral-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 dark:text-neutral-600 text-neutral-400" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black dark:text-white text-neutral-900">No Active Campaigns</h3>
              <p className="dark:text-neutral-400 text-neutral-600 text-sm sm:text-base">
                Check back soon for new fundraising campaigns.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
