'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CartItemRow } from './_components/CartItemRow'
import { CartOrderSummary } from './_components/CartOrderSummary'
import { EmptyCart } from './_components/EmptyCart'
import { useCartStore, useCartCount, useCartHasHydrated } from '@/stores/useCartStore'

export default function CartClient() {
  const items = useCartStore((s) => s.items)
  const itemCount = useCartCount()
  const hasHydrated = useCartHasHydrated()

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950" aria-busy="true">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="h-9 w-48 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 sm:gap-8 items-start">
            <div className="space-y-3">
              <div className="h-28 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              <div className="h-28 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            </div>
            <div className="h-64 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
          </div>
          <span className="sr-only">Loading your cart</span>
        </div>
      </div>
    )
  }

  if (items.length === 0) return <EmptyCart />

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <main aria-labelledby="cart-heading" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10 flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 dark:text-sky-400 mb-1">
              Checkout
            </p>
            <h1 id="cart-heading" className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              Your Cart
            </h1>
          </div>
          <p aria-live="polite" aria-atomic="true" className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">
            {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 sm:gap-8 items-start">
          <section aria-labelledby="cart-items-heading">
            <h2 id="cart-items-heading" className="sr-only">
              Cart Items
            </h2>
            <ul role="list" aria-label="Items in your cart" className="space-y-3 list-none p-0 m-0">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item, index) => (
                  <motion.li
                    key={item.ticketId}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CartItemRow item={item} index={index} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="mt-6">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Continue browsing events
              </Link>
            </div>
          </section>

          <CartOrderSummary items={items} />
        </div>
      </main>
    </div>
  )
}
