'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { CartItemRow } from './_components/CartItemRow'
import { CartOrderSummary } from './_components/CartOrderSummary'
import { EmptyCart } from './_components/EmptyCart'
import { useCartStore, useCartCount, useCartHasHydrated } from '@/stores/useCartStore'
import { validateCart } from '@/lib/actions/_infra/validateCart'

export default function CartClient() {
  const items = useCartStore((s) => s.items)
  const itemCount = useCartCount()
  const hasHydrated = useCartHasHydrated()
  const removeFromCart = useCartStore((s) => s.removeFromCart)

  const [notice, setNotice] = useState('')

  // Prices and availability can change after something is added, so the cart
  // is checked once against the database when the page loads
  const checked = useRef(false)

  useEffect(() => {
    if (!hasHydrated || checked.current) return

    const current = useCartStore.getState().items
    if (current.length === 0) return

    checked.current = true

    const check = async () => {
      const result = await validateCart(current.map((i) => ({ ticketId: i.ticketId, price: i.price })))

      if (!result.success || !result.data || result.data.stale.length === 0) return

      result.data.stale.forEach((id) => removeFromCart(id))

      setNotice(
        result.data.stale.length === 1
          ? 'One ticket is no longer available at the price shown, so we removed it from your cart.'
          : 'Some tickets are no longer available at the prices shown, so we removed them from your cart.'
      )
    }

    check()
  }, [hasHydrated, removeFromCart])

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950" aria-busy="true">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
          <div className="h-8 w-40 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-px">
              <div className="h-20 bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
              <div className="h-20 bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
            </div>
            <div className="h-48 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          </div>

          <span className="sr-only">Loading your cart</span>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyCart notice={notice} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <main aria-labelledby="cart-heading" className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-baseline justify-between gap-4"
        >
          <h1 id="cart-heading" className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Your cart
          </h1>

          <p
            aria-live="polite"
            aria-atomic="true"
            className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0 tabular-nums"
          >
            {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'}
          </p>
        </motion.div>

        {notice && (
          <div className="mb-8 py-4 border-y border-neutral-200 dark:border-neutral-800">
            <p role="status" className="text-sm text-neutral-700 dark:text-neutral-300">
              {notice}
            </p>

            <button
              type="button"
              onClick={() => setNotice('')}
              className="mt-2 text-xs font-medium text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <section aria-labelledby="cart-items-heading" className="lg:col-span-2">
            <h2 id="cart-items-heading" className="sr-only">
              Items in your cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-neutral-100 dark:divide-neutral-900 border-y border-neutral-200 dark:border-neutral-800 list-none p-0 m-0"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.ticketId}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CartItemRow item={item} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <Link
              href="/events"
              className="inline-block mt-5 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              Keep browsing events
            </Link>
          </section>

          <CartOrderSummary items={items} />
        </div>
      </main>
    </div>
  )
}
