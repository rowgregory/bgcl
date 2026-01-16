'use client'

import { motion } from 'framer-motion'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import DonationForm from '@/app/components/forms/DonationForm'
import Link from 'next/link'
import Picture from '@/app/components/common/Picture'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function DonationPage() {
  return (
    <div className="">
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-12 py-8 sm:py-10 dark:border-neutral-800 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-4 sm:space-y-5"
          >
            {/* Logo */}
            <Link href="/" className="w-28">
              <Picture src="/images/logo-2.png" alt="Boys & Girls Club" className="w-full h-full" priority />
            </Link>

            {/* Heading */}
            <div className="max-w-2xl space-y-2 sm:space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                Make a Difference
              </h1>
              <p className="text-base sm:text-lg dark:text-neutral-400 text-neutral-600 leading-relaxed">
                Support Boys & Girls Club programs that empower youth in our community.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-493px)] h-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Impact Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold dark:text-white text-neutral-900">Your Impact</h2>
              <div className="space-y-4">
                <div className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4">
                  <p className="text-3xl font-bold dark:text-sky-400 text-sky-600">$25</p>
                  <p className="text-sm dark:text-zinc-400 text-neutral-600 mt-1">
                    Provides a week of after-school snacks
                  </p>
                </div>
                <div className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4">
                  <p className="text-3xl font-bold dark:text-sky-400 text-sky-600">$50</p>
                  <p className="text-sm dark:text-zinc-400 text-neutral-600 mt-1">Supports STEM program supplies</p>
                </div>
                <div className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4">
                  <p className="text-3xl font-bold dark:text-sky-400 text-sky-600">$100</p>
                  <p className="text-sm dark:text-zinc-400 text-neutral-600 mt-1">Funds a youth field trip</p>
                </div>
                <div className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4">
                  <p className="text-3xl font-bold dark:text-sky-400 text-sky-600">$250+</p>
                  <p className="text-sm dark:text-zinc-400 text-neutral-600 mt-1">Transforms a life this year</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Donation Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <div className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-8 shadow-sm">
              <h2 className="text-2xl font-bold dark:text-white text-neutral-900 mb-6">Make Your Donation</h2>
              <Elements stripe={stripePromise}>
                <DonationForm />
              </Elements>
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-sm dark:text-zinc-500 text-neutral-600"
            >
              <p>🔒 Secure payments powered by Stripe</p>
              <p>501(c)(3) Nonprofit Organization</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
