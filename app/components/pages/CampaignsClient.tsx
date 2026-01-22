'use client'

import { containerVariants, itemVariants } from '@/app/lib/constants/motion'
import { ICampaign } from '@/types/entities/campaign'
import { motion } from 'framer-motion'
import { Heart, Users, Target, ArrowRight } from 'lucide-react'
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
    <div className="min-h-screen py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <p className="text-xs font-semibold dark:text-neutral-500 text-neutral-600 uppercase tracking-widest">
              Support Our Cause
            </p>
            <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              Active Campaigns
            </h1>
            <p className="text-lg dark:text-neutral-400 text-neutral-600 max-w-2xl">
              Every dollar raised directly supports Boys & Girls Club of Lynn programs that empower youth in our
              community.
            </p>
          </div>
        </motion.div>

        {/* Campaigns Grid */}
        {campaigns && campaigns?.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                    className="group dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-sky-500/50 bg-white border-neutral-200 border hover:border-sky-500/50 rounded-xl overflow-hidden transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                  >
                    {/* Image */}
                    {campaign.image && (
                      <div className="relative h-48 overflow-hidden dark:bg-neutral-800 bg-neutral-100">
                        <img
                          src={campaign.image}
                          alt={campaign.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Title */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-black dark:text-white text-neutral-900">{campaign.name}</h3>
                        <p className="text-sm dark:text-neutral-500 text-neutral-600">{campaign.organizerName}</p>
                      </div>

                      {/* Description */}
                      <p className="text-sm dark:text-neutral-400 text-neutral-600 line-clamp-2">
                        {campaign.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="dark:text-neutral-400 text-neutral-600">Progress</span>
                          <span className="dark:text-sky-400 text-sky-600 font-semibold">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-2 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-linear-to-r from-sky-500 to-sky-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 py-4 dark:border-neutral-800 border-neutral-200 border-y">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 dark:text-sky-400 text-sky-600" />
                            <span className="text-xs dark:text-neutral-500 text-neutral-600">Raised</span>
                          </div>
                          <p className="text-lg font-black dark:text-white text-neutral-900">
                            ${campaign.currentAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        {supporters > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 dark:text-sky-400 text-sky-600" />
                              <span className="text-xs dark:text-neutral-500 text-neutral-600">Supporters</span>
                            </div>
                            <p className="text-lg font-black dark:text-white text-neutral-900">{supporters}</p>
                          </div>
                        )}
                      </div>

                      {/* Goal Info */}
                      <div className="text-sm dark:text-neutral-400 text-neutral-600 space-y-1">
                        <p>Goal: ${campaign.goalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                        {remaining > 0 ? (
                          <p className="dark:text-sky-400 text-sky-600 font-semibold">
                            ${remaining.toLocaleString('en-US', { maximumFractionDigits: 0 })} to go
                          </p>
                        ) : (
                          <p className="dark:text-green-400 text-green-600 font-semibold">Goal reached</p>
                        )}
                      </div>

                      {/* CTA */}
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault()
                          if (campaign.externalLink) {
                            window.open(campaign.externalLink, '_blank')
                          } else {
                            router.push(`/donate?campaignName=${campaign.name}`)
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 dark:bg-sky-600 dark:hover:bg-sky-700 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Heart className="w-4 h-4" />
                        Donate
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-lg dark:bg-neutral-800 bg-neutral-100 flex items-center justify-center">
                  <Heart className="w-8 h-8 dark:text-neutral-600 text-neutral-400" />
                </div>
              </div>
              <h3 className="text-2xl font-black dark:text-white text-neutral-900">No Active Campaigns</h3>
              <p className="dark:text-neutral-400 text-neutral-600">Check back soon for new fundraising campaigns?.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
