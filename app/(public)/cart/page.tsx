'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCartSelector } from '@/app/lib/store/store'
import OrderSummary from '@/app/components/cart/OrderSummary'
import CartItem from '../../components/CartItem'
import { Calendar, CreditCard, Home, Sparkles, Ticket } from 'lucide-react'
import Picture from '@/app/components/common/Picture'

export default function CartPage() {
  const { items } = useCartSelector()

  if (items.length === 0) {
    return (
      <main
        aria-labelledby="empty-cart-heading"
        className="min-h-[calc(100vh-699px)] bg-white dark:bg-neutral-950 flex flex-col items-center justify-center"
      >
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* Logo link */}
            <Link
              href="/"
              aria-label="Boys & Girls Club — go to home page"
              className="h-28 inline-flex mb-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded"
            >
              <Picture
                src="/images/vertical-logo-light.png"
                alt=""
                className="dark:hidden block w-auto h-full hover:opacity-80 transition-opacity"
                priority={true}
              />
              <Picture
                src="/images/vertical-logo-dark.png"
                alt=""
                className="dark:block hidden w-auto h-full hover:opacity-80 transition-opacity"
                priority={true}
              />
            </Link>

            {/* Heading */}
            <h1
              id="empty-cart-heading"
              className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4"
            >
              Your Cart is Empty
            </h1>

            {/* Description */}
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              Looks like you haven't added any events yet. Explore our upcoming events and reserve your spot!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-[5px] transition-all shadow-lg shadow-sky-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                Browse Events
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-[5px] transition-colors border border-neutral-200 dark:border-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                Go Home
              </Link>
            </div>

            {/* Feature Highlights */}
            <ul aria-label="Booking features" className="mt-12 grid grid-cols-3 gap-6 text-center list-none p-0 m-0">
              <li className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Ticket className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Easy Booking</p>
              </li>
              <li className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <CreditCard className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Secure Payment</p>
              </li>
              <li className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <Sparkles className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Great Events</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <main aria-labelledby="cart-heading" className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 id="cart-heading" className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Your Cart
          </h1>
          <p aria-live="polite" aria-atomic="true" className="text-neutral-600 dark:text-neutral-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} in cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <section aria-labelledby="cart-items-heading" className="lg:col-span-2 space-y-4">
            <h2 id="cart-items-heading" className="sr-only">
              Cart Items
            </h2>
            <ul role="list" aria-label="Items in your cart" className="space-y-4 list-none p-0 m-0">
              {items.map((item, index) => (
                <li key={index}>
                  <CartItem index={index} item={item} />
                </li>
              ))}
            </ul>
          </section>

          {/* Order Summary */}
          <OrderSummary />
        </div>
      </main>
    </div>
  )
}
