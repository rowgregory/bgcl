'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ArrowLeft, ArrowRight, Heart, Rocket } from 'lucide-react'
import { MotionLink } from '../common/MotionLink'
import LogoutButton from '../ui/buttons/LogoutButton'
import Picture from '../common/Picture'
import { SupporterDonationRow } from '../supporter/SupporterDonationRow'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

export default function SupporterDonationsClient({ donations }) {
  const session = useSession()
  const role = session?.data?.user?.role

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Header */}
      <header className="px-6 md:px-8 lg:px-12 pb-4 pt-6 md:pt-8 dark:border-neutral-800 border-neutral-200 border-b">
        <div className="max-w-334 mx-auto flex items-center justify-between">
          <MotionLink
            href="/"
            aria-label="Boys & Girls Club of Lynn — home"
            className="flex space-x-3 w-28 h-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            <Picture
              src="/images/vertical-logo-light.png"
              alt="Boys & Girls Club of Lynn"
              className="dark:hidden block w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
              priority={true}
            />
            <Picture
              src="/images/vertical-logo-dark.png"
              alt="Boys & Girls Club of Lynn"
              className="dark:block hidden w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
              priority={true}
            />
          </MotionLink>
          <div className="flex items-center gap-x-3">
            {/* Profile email */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-100 border-neutral-200 border rounded-lg">
              <div
                className="shrink-0 w-6 h-6 rounded-full bg-sky-600 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-white text-xs font-bold leading-none">
                  {(session.data?.user?.email?.[0] ?? '?').toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-medium dark:text-neutral-400 text-neutral-600 max-w-40 truncate">
                {session.data?.user?.email}
              </p>
            </div>
            {(role === 'ADMIN' || role === 'PROGRAM' || role === 'SUPERUSER') && (
              <MotionLink
                href="/auth/login"
                aria-label="Go to admin dashboard"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 bg-neutral-200 border-neutral-300 hover:bg-neutral-300 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Rocket className="w-5 h-5 dark:text-zinc-400 text-neutral-700" aria-hidden="true" />
              </MotionLink>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="p-6 md:p-8 lg:p-12 space-y-10">
        <div className="max-w-334 mx-auto space-y-10">
          {/* Page header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              href="/supporter/overview"
              className="inline-flex items-center gap-1.5 text-xs font-semibold dark:text-neutral-500 text-neutral-500 hover:text-sky-600 dark:hover:text-sky-400 mb-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to Overview
            </Link>

            <div>
              <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-500 uppercase tracking-widest mb-2">
                Supporter Portal
              </p>
              <h1 className="text-3xl md:text-4xl font-black dark:text-white text-neutral-900 leading-tight">
                My Donations
              </h1>
              <p className="dark:text-neutral-500 text-neutral-600 text-base mt-2">
                View all your contributions to Boys & Girls Club of Lynn
              </p>
            </div>
          </motion.div>

          {/* Donations list */}
          {donations.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-1">
              {/* Table header */}
              <div className="hidden md:flex items-center gap-4 px-4 pb-2" aria-hidden="true">
                <div className="w-9 shrink-0" />
                <div className="w-28 shrink-0">
                  <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-400 uppercase tracking-wider">
                    Amount
                  </p>
                </div>
                <div className="hidden sm:block w-24 shrink-0">
                  <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-400 uppercase tracking-wider">
                    Type
                  </p>
                </div>
                <div className="w-32 shrink-0">
                  <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-400 uppercase tracking-wider">
                    Date
                  </p>
                </div>
                <div className="flex-1 min-w-0 hidden lg:block">
                  <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-400 uppercase tracking-wider">
                    Campaign
                  </p>
                </div>
                <div className="shrink-0 w-20">
                  <p className="text-xs font-semibold dark:text-neutral-600 text-neutral-400 uppercase tracking-wider">
                    Status
                  </p>
                </div>
              </div>

              <ul role="list" className="space-y-2 list-none p-0 m-0">
                {donations.map((donation) => (
                  <SupporterDonationRow key={donation.id} donation={donation} />
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="dark:bg-neutral-900/30 dark:border-neutral-800 bg-neutral-50 border-neutral-200 border rounded-xl p-16 text-center"
            >
              <div
                className="w-14 h-14 rounded-full dark:bg-neutral-800 bg-neutral-200 flex items-center justify-center mx-auto mb-4"
                aria-hidden="true"
              >
                <Heart className="w-7 h-7 dark:text-neutral-600 text-neutral-400" />
              </div>
              <p className="dark:text-neutral-300 text-neutral-700 font-bold text-lg">No donations yet</p>
              <p className="dark:text-neutral-600 text-neutral-400 text-sm mt-1 max-w-xs mx-auto">
                Start making a difference with your first contribution
              </p>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
              >
                Make your first donation
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
