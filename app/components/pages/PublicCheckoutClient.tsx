'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Lock, ShieldCheck, Ticket, User } from 'lucide-react'
import Link from 'next/link'
import { useCartSelector } from '@/app/lib/store/store'
import { CheckoutForm } from '@/app/components/forms/CheckoutForm'
import Picture from '@/app/components/common/Picture'
import { useSession } from 'next-auth/react'
import { IPaymentMethod } from '@/types/entities/payment-method'
import { useState } from 'react'
import { calculateStripeFees } from '@/app/lib/utils/calculateStripeFees'

export default function PublicCheckoutClient({ savedCards }: { savedCards: IPaymentMethod[] }) {
  const { items } = useCartSelector()
  const session = useSession()
  const [coverFees, setCoverFees] = useState(false)

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Checkout</h1>
            <p className="text-zinc-400 mb-8">Your cart is empty.</p>
            <Link
              href="/events"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Events</span>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const processingFee = Math.round(calculateStripeFees(totalPrice) * 100) / 100
  const finalTotal = coverFees ? totalPrice + processingFee : totalPrice

  return (
    <div className="pb-20 sm:pb-0">
      {/* ── Header ── */}
      <div className="px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-4 sm:space-y-5"
          >
            {/* Logo + session */}
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex w-36 sm:w-48 md:w-60 h-auto shrink-0">
                <Picture
                  src="/images/horizontal-logo-light.png"
                  alt="Boys & Girls Club of Lynn"
                  className="dark:hidden block w-full h-full object-contain hover:opacity-80 transition-opacity"
                  priority
                />
                <Picture
                  src="/images/horizontal-logo-dark.png"
                  alt="Boys & Girls Club of Lynn"
                  className="dark:block hidden w-full h-full object-contain hover:opacity-80 transition-opacity"
                  priority
                />
              </Link>

              {/* Session indicator */}
              {session?.data?.user ? (
                <Link href="/supporter/overview" className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Signed in as</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white leading-none truncate">
                      {session.data.user.email}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block">
                    Checking out as guest
                  </p>
                </div>
              )}
            </div>

            {/* Heading */}
            <div className="space-y-2 sm:space-y-3">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Cart
              </Link>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
                Checkout
              </h1>
              <p className="text-sm sm:text-base md:text-lg dark:text-neutral-400 text-neutral-600 leading-relaxed">
                Complete your order securely below.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-4xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* ── Left — Order summary ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <h2 className="text-2xl font-bold dark:text-white text-neutral-900">Your Order</h2>

            {/* Items */}
            <ul role="list" className="space-y-3">
              {items.map((item) => (
                <li
                  key={`${item.eventId}-${item.ticketId}`}
                  className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="shrink-0 w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center mt-0.5"
                        aria-hidden="true"
                      >
                        <Ticket className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {item.ticketName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                          {item.eventTitle}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white shrink-0 tabular-nums">
                      $
                      {(item.price * item.quantity)?.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Subtotal</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-white tabular-nums">
                  ${totalPrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Processing Fee</span>
                <span className="text-sm font-medium text-neutral-900 dark:text-white tabular-nums">
                  $
                  {processingFee?.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              <div className="pt-3 border-t border-neutral-200 dark:border-zinc-800 flex justify-between items-center">
                <span className="text-sm font-bold text-neutral-900 dark:text-white">Total</span>
                <span
                  className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums"
                  aria-label={`Total: $${finalTotal.toFixed(2)}`}
                >
                  ${finalTotal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Secure checkout
              </div>
              <div className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                SSL encrypted
              </div>
            </div>
          </motion.div>

          {/* ── Right — Checkout form ── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <div className="dark:bg-zinc-900 dark:border-zinc-800 bg-neutral-100 border-neutral-200 rounded-lg border p-4 sm:p-6 md:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold dark:text-white text-neutral-900 mb-4 sm:mb-6">
                Payment Details
              </h2>
              <CheckoutForm savedCards={savedCards} coverFees={coverFees} setCoverFees={setCoverFees} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
