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
      <div className="px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-16 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-4 sm:space-y-5"
          >
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex items-center space-x-2 sm:space-x-3 w-fit hover:opacity-80 transition-opacity"
                whileHover={{ scale: 1.02 }}
              >
                <div className="h-8 sm:h-10">
                  <Picture src="/images/logo-1.webp" alt="Boys & Girls Club" className="w-auto h-full" priority />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm sm:text-base">Boys & Girls Club</h2>
                  <p className="text-sky-400 text-xs font-semibold">of Lynn</p>
                </div>
              </motion.div>
            </Link>

            {/* Heading */}
            <div className="max-w-2xl space-y-2 sm:space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
                Make a Difference
              </h1>
              <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
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
              <h2 className="text-2xl font-bold text-white">Your Impact</h2>
              <div className="space-y-4">
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                  <p className="text-3xl font-bold text-sky-400">$25</p>
                  <p className="text-sm text-zinc-400 mt-1">Provides a week of after-school snacks</p>
                </div>
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                  <p className="text-3xl font-bold text-sky-400">$50</p>
                  <p className="text-sm text-zinc-400 mt-1">Supports STEM program supplies</p>
                </div>
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                  <p className="text-3xl font-bold text-sky-400">$100</p>
                  <p className="text-sm text-zinc-400 mt-1">Funds a youth field trip</p>
                </div>
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                  <p className="text-3xl font-bold text-sky-400">$250+</p>
                  <p className="text-sm text-zinc-400 mt-1">Transforms a life this year</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Donation Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Make Your Donation</h2>
              <Elements stripe={stripePromise}>
                <DonationForm />
              </Elements>
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-sm text-zinc-500"
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
