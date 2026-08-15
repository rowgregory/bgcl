'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react'
import { SupporterDonationRow } from '../_components/SupporterDonationRow'
import { containerVariants } from '@/lib/constants/motion'

export default function SupporterDonationsClient({ donations }) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
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
                Donations
              </h1>
              <p className="dark:text-neutral-500 text-neutral-600 text-base mt-2">
                View your contribution history and manage recurring donations
              </p>
            </div>
          </motion.div>

          {/* Donations list */}
          {donations.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-1">
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
