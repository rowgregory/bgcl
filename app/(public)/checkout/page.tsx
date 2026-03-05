'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Lock, ShieldCheck, Ticket } from 'lucide-react'
import Link from 'next/link'
import { useCartSelector } from '@/app/lib/store/store'
import { CheckoutForm } from '@/app/components/forms/CheckoutForm'
import Picture from '@/app/components/common/Picture'

export default function CheckoutPage() {
  const { items } = useCartSelector()

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
  const processingFee = totalPrice * 0.029 + 0.3
  const finalTotal = totalPrice + processingFee

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left — Form */}
        <div className="bg-white dark:bg-neutral-950 lg:border-r border-neutral-200 dark:border-neutral-800 flex justify-end">
          <div className="max-w-2xl w-full px-4 sm:px-6 py-10 sm:py-14 lg:px-12 flex flex-col">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              {/* Logo */}
              <div className="mb-6">
                <Picture
                  src="/images/vertical-logo-light.png"
                  alt="Boys & Girls Club of Lynn"
                  className="h-10 w-auto block dark:hidden"
                  priority
                />
                <Picture
                  src="/images/vertical-logo-dark.png"
                  alt="Boys & Girls Club of Lynn"
                  className="h-10 w-auto hidden dark:block"
                  priority
                />
              </div>

              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Cart
              </Link>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white">Checkout</h1>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <CheckoutForm />
            </motion.div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800">
          <div className="max-w-2xl px-4 sm:px-6 py-10 sm:py-14 lg:px-12 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-12"
            >
              <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <ul
                role="list"
                aria-label="Items in your order"
                className="space-y-4 pb-6 border-b border-neutral-200 dark:border-neutral-800 list-none p-0 m-0"
              >
                {items.map((item) => (
                  <li key={`${item.eventId}-${item.ticketId}`} className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className="shrink-0 w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center mt-0.5"
                        aria-hidden="true"
                      >
                        <Ticket className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {item.ticketName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                          {item.eventTitle}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white shrink-0 tabular-nums">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Pricing breakdown */}
              <dl className="space-y-3 py-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-neutral-500 dark:text-neutral-400">Subtotal</dt>
                  <dd className="text-sm font-medium text-neutral-900 dark:text-white tabular-nums">
                    ${totalPrice.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-neutral-500 dark:text-neutral-400">Processing Fee</dt>
                  <dd className="text-sm font-medium text-neutral-900 dark:text-white tabular-nums">
                    ${processingFee.toFixed(2)}
                  </dd>
                </div>
              </dl>

              {/* Total */}
              <div className="pt-6 flex justify-between items-end">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Total</span>
                <span
                  className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white tabular-nums"
                  aria-label={`Total: $${finalTotal.toFixed(2)}`}
                >
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}
