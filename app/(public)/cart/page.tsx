'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCartSelector } from '@/app/lib/store/store'
import OrderSummary from '@/app/components/cart/OrderSummary'
import CartItem from './CartItem'
import { Calendar, CreditCard, Home, Sparkles, Ticket } from 'lucide-react'
import Picture from '@/app/components/common/Picture'

export default function CartPage() {
  const { items } = useCartSelector()

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-699px)] bg-white dark:bg-neutral-950 flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Link href="/" className="h-28 inline-flex mb-10">
              <Picture
                src="/images/vertical-logo-light.png"
                alt="Boys & Girls Club"
                className="dark:hidden block w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                priority={true}
              />
              <Picture
                src="/images/vertical-logo-dark.png"
                alt="Boys & Girls Club"
                className="dark:block hidden w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                priority={true}
              />
            </Link>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">Your Cart is Empty</h1>

            {/* Description */}
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              Looks like you haven't added any events yet. Explore our upcoming events and reserve your spot!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-[5px] transition-all shadow-lg shadow-sky-500/25"
              >
                <Calendar className="w-5 h-5" />
                Browse Events
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-[5px] transition-colors border border-neutral-200 dark:border-neutral-700"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Ticket className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Easy Booking</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <CreditCard className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Secure Payment</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Sparkles className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Great Events</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">Your Cart</h1>
          <p className="text-neutral-600 dark:text-neutral-400">{items.length} item(s) in cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <CartItem key={index} index={index} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
