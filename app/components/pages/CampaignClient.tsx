'use client'

import { ICampaign } from '@/types/entities/campaign'
import { motion } from 'framer-motion'
import { Heart, Users, Target, Calendar, Share2, ArrowLeft, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Picture from '../common/Picture'
import { formatDate } from '@/app/lib/utils/date-utils'
import { MotionLink } from '../common/MotionLink'

interface CampaignPageProps {
  campaign: ICampaign
}

export function CampaignClient({ campaign }: CampaignPageProps) {
  const progress = Math.min((campaign?.currentAmount / campaign?.goalAmount) * 100, 100)
  const remaining = Math.max(campaign?.goalAmount - campaign?.currentAmount, 0)
  const supporters = campaign?._count?.orders || 0

  const handleShare = () => {
    const text = `Support ${campaign?.name} - Help Boys & Girls Club of Lynn reach their goal!`
    if (navigator.share) {
      navigator.share({
        title: campaign?.name,
        text: text,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen dark:bg-neutral-950 bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 dark:bg-neutral-950/80 bg-white/80 backdrop-blur-sm dark:border-neutral-800 border-neutral-200 border-b">
        <div className="px-6 md:px-12 py-4">
          <div className="max-w-334 mx-auto flex items-center justify-between">
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 dark:text-sky-400 dark:hover:text-sky-300 text-sky-600 hover:text-sky-700 transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campaigns
            </Link>

            {/* Logo */}
            <Link href="/">
              <Picture
                src="/images/horizontal-logo-light.png"
                alt="Boys & Girls Club"
                className="w-auto h-10"
                priority={true}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="px-6 md:px-12 py-12">
        <div className="max-w-334 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Description & Details */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Title & Organizer */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 dark:bg-sky-500/10 dark:border-sky-500/30 bg-sky-100 border-sky-300 border rounded-lg">
                <span className="w-2 h-2 rounded-full dark:bg-sky-400 bg-sky-600"></span>
                <p className="text-xs font-semibold dark:text-sky-400 text-sky-600 uppercase tracking-wider">
                  Active Campaign
                </p>
              </div>

              <h1 className="text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                {campaign?.name}
              </h1>
              <p className="text-xl dark:text-neutral-400 text-neutral-600">
                Created by{' '}
                <span className="dark:text-white text-neutral-900 font-semibold">{campaign?.organizerName}</span>
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4 dark:bg-neutral-900/50 dark:border-neutral-800 bg-neutral-100 border-neutral-200 rounded-xl p-8 border">
              <p className="text-lg dark:text-neutral-300 text-neutral-700 leading-relaxed">{campaign?.description}</p>
            </div>

            {/* Progress Info */}
            <div className="dark:bg-linear-to-b dark:from-neutral-900 dark:to-neutral-950 bg-linear-to-b from-neutral-50 to-white dark:border-neutral-800 border-neutral-200 rounded-xl p-8 space-y-6 shadow-xl border">
              <div className="space-y-4">
                <p className="text-sm dark:text-neutral-500 text-neutral-600 uppercase tracking-wider font-semibold">
                  Fundraising Progress
                </p>

                {/* Amount Raised */}
                <div className="space-y-1">
                  <p className="text-5xl font-black dark:text-white text-neutral-900">
                    ${campaign?.currentAmount?.toLocaleString()}
                  </p>
                  <p className="text-sm dark:text-neutral-400 text-neutral-600">
                    of ${campaign?.goalAmount?.toLocaleString()} goal
                  </p>
                </div>

                {/* Progress Bar with Glow */}
                <div className="w-full h-4 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden dark:border-neutral-700 border-neutral-300 border">
                  <motion.div
                    className="h-full bg-linear-to-r from-sky-500 via-sky-400 to-sky-600 shadow-lg shadow-sky-500/50"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>

                {/* Percentage */}
                <div className="flex items-center justify-between">
                  <p className="text-lg font-black dark:text-sky-400 text-sky-600">{Math.round(progress)}% Complete</p>
                  <TrendingUp className="w-5 h-5 dark:text-sky-400 text-sky-600" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 dark:border-neutral-800 border-neutral-200 border-y">
                <div className="flex flex-col gap-2 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg dark:bg-neutral-800 dark:group-hover:bg-neutral-700 bg-neutral-200 group-hover:bg-neutral-300 transition-colors flex items-center justify-center">
                      <Target className="w-5 h-5 dark:text-sky-400 text-sky-600" />
                    </div>
                    <span className="text-sm dark:text-neutral-400 text-neutral-600">To Goal</span>
                  </div>
                  <p className="dark:text-white text-neutral-900 font-black text-xl ml-13">${remaining.toFixed(1)}K</p>
                </div>

                <div className="flex flex-col gap-2 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg dark:bg-neutral-800 dark:group-hover:bg-neutral-700 bg-neutral-200 group-hover:bg-neutral-300 transition-colors flex items-center justify-center">
                      <Users className="w-5 h-5 dark:text-sky-400 text-sky-600" />
                    </div>
                    <span className="text-sm dark:text-neutral-400 text-neutral-600">Supporters</span>
                  </div>
                  <p className="dark:text-white text-neutral-900 font-black text-xl ml-13">{supporters}</p>
                </div>

                {campaign?.endDate && (
                  <div className="flex flex-col gap-2 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg dark:bg-neutral-800 dark:group-hover:bg-neutral-700 bg-neutral-200 group-hover:bg-neutral-300 transition-colors flex items-center justify-center">
                        <Calendar className="w-5 h-5 dark:text-sky-400 text-sky-600" />
                      </div>
                      <span className="text-sm dark:text-neutral-400 text-neutral-600">Ends</span>
                    </div>
                    <p className="dark:text-white text-neutral-900 font-black ml-13">{formatDate(campaign?.endDate)}</p>
                  </div>
                )}
              </div>

              {/* Goal Status */}
              {remaining > 0 ? (
                <div className="dark:bg-neutral-800/50 dark:border-neutral-700 bg-neutral-200 border-neutral-300 rounded-lg p-4 space-y-2 border">
                  <p className="text-sm dark:text-neutral-400 text-neutral-600">Help us reach our goal</p>
                  <p className="text-2xl font-black dark:text-sky-400 text-sky-600">${remaining?.toLocaleString()}</p>
                  <p className="text-xs dark:text-neutral-500 text-neutral-600">still needed</p>
                </div>
              ) : (
                <div className="dark:bg-green-500/10 dark:border-green-500/50 bg-green-100 border-green-300 rounded-lg p-4 text-center space-y-1 border">
                  <p className="dark:text-green-400 text-green-600 font-black text-lg">Goal Reached!</p>
                  <p className="text-xs dark:text-green-400/70 text-green-600/70">Thank you to all our supporters</p>
                </div>
              )}
            </div>

            {/* Campaign Details Grid */}
            <div className="dark:bg-neutral-900 dark:border-neutral-800 bg-white border-neutral-200 rounded-xl p-8 space-y-6 border">
              <h3 className="text-xl font-black dark:text-white text-neutral-900">Campaign Details</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider">Start Date</p>
                  <p className="dark:text-white text-neutral-900 font-semibold">{formatDate(campaign?.startDate)}</p>
                </div>

                {campaign?.endDate && (
                  <div className="space-y-2">
                    <p className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider">End Date</p>
                    <p className="dark:text-white text-neutral-900 font-semibold">{formatDate(campaign?.endDate)}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider">Status</p>
                  <p
                    className={`font-semibold flex items-center gap-2 ${
                      campaign?.isActive
                        ? 'dark:text-green-400 text-green-600'
                        : 'dark:text-neutral-400 text-neutral-600'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        campaign?.isActive ? 'dark:bg-green-400 bg-green-600' : 'dark:bg-neutral-500 bg-neutral-400'
                      }`}
                    ></span>
                    {campaign?.isActive ? 'Active' : 'Ended'}
                  </p>
                </div>

                {supporters > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs dark:text-neutral-500 text-neutral-600 uppercase tracking-wider">
                      Supporters
                    </p>
                    <p className="dark:text-white text-neutral-900 font-semibold">{supporters}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Image & CTA */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Hero Image */}
            {campaign?.image && (
              <div className="w-full aspect-square rounded-xl overflow-hidden shadow-2xl dark:border-neutral-800 border-neutral-200 border sticky top-24">
                <img src={campaign?.image} alt={campaign?.name} className="w-full h-full object-cover" />
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-4 sticky top-120">
              <MotionLink
                href={`/donate?campaignName=${campaign?.name}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 dark:bg-linear-to-r dark:from-sky-600 dark:to-sky-700 dark:hover:from-sky-700 dark:hover:to-sky-800 bg-linear-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-black rounded-lg transition-all shadow-lg dark:shadow-sky-600/50 shadow-sky-600/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className="w-5 h-5" />
                Donate Now
              </MotionLink>

              <motion.button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-neutral-200 hover:bg-neutral-300 dark:text-white text-neutral-900 font-semibold rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                Share Campaign
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
