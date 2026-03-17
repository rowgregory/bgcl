'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ShoppingCart,
  Calendar,
  Home,
  Ticket,
  CreditCard,
  Sparkles,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Minus,
  Plus,
  Trash2
} from 'lucide-react'
import { CartItem, clearCart, removeFromCart, updateQuantity } from '@/app/lib/store/slices/cartSlice'
import { store, useCartSelector } from '@/app/lib/store/store'
import Picture from '@/app/components/common/Picture'

// ─── Cart Item Row ─────────────────────────────────────────────────────────────

const CartItemRow = ({ item, index }: { item: CartItem; index: number }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.06 }}
      aria-label={`Cart item: ${item.ticketName}`}
      className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-sky-200 dark:hover:border-sky-500/30 transition-all duration-200"
    >
      {/* Hover accent */}
      <div
        className="h-0.5 bg-linear-to-r from-sky-500 to-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        aria-hidden="true"
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon */}
          <div
            className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center"
            aria-hidden="true"
          >
            <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 dark:text-sky-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + price */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white truncate leading-tight">
                  {item.ticketName}
                </h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">{item.eventTitle}</p>
              </div>
              <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white shrink-0 tabular-nums">
                $
                {(item.price * item.quantity)?.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              {/* Quantity stepper */}
              <div role="group" aria-label={`Quantity for ${item.ticketName}`} className="flex items-center gap-2">
                <button
                  onClick={() =>
                    store.dispatch(updateQuantity({ ticketId: item.ticketId, quantity: item.quantity - 1 }))
                  }
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <Minus className="w-3 h-3 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                </button>

                <span
                  aria-live="polite"
                  aria-atomic="true"
                  aria-label={`Quantity: ${item.quantity}`}
                  className="w-7 text-center text-sm font-semibold text-neutral-900 dark:text-white tabular-nums"
                >
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    store.dispatch(updateQuantity({ ticketId: item.ticketId, quantity: item.quantity + 1 }))
                  }
                  disabled={item.quantity >= item.maxAvailable}
                  aria-label="Increase quantity"
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <Plus className="w-3 h-3 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                </button>

                <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-1 hidden sm:inline">
                  @ ${item.price.toFixed(2)} ea
                </span>
              </div>

              {/* Remove */}
              <button
                onClick={() => store.dispatch(removeFromCart(item.ticketId))}
                aria-label={`Remove ${item.ticketName} from cart`}
                className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md px-2 py-1"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// ─── Order Summary ─────────────────────────────────────────────────────────────

const CartOrderSummary = ({ items }: { items: CartItem[] }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <aside aria-label="Order summary" className="lg:sticky lg:top-6">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Order Summary</h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5" aria-live="polite" aria-atomic="true">
            {itemCount} {itemCount === 1 ? 'ticket' : 'tickets'}
          </p>
        </div>

        {/* Line items */}
        <ul role="list" aria-label="Order line items" className="list-none p-0 m-0 px-5 sm:px-6 py-4 space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start justify-between gap-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="text-neutral-700 dark:text-neutral-300 font-medium leading-tight truncate">
                  {item.ticketName}
                </p>
                <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-0.5 truncate">{item.eventTitle}</p>
                <p className="text-neutral-400 dark:text-neutral-500 text-xs">× {item.quantity}</p>
              </div>
              <span className="font-semibold text-neutral-900 dark:text-white shrink-0 tabular-nums">
                $
                {(item.price * item.quantity)?.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </li>
          ))}
        </ul>

        {/* Totals + CTA */}
        <div className="px-5 sm:px-6 pb-5 pt-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
            <span className="font-medium text-neutral-900 dark:text-white tabular-nums">
              ${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <span className="text-base font-semibold text-neutral-900 dark:text-white">Total</span>
            <span
              className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums"
              aria-label={`Total: $${subtotal.toFixed(2)}`}
            >
              ${subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <Link
            href="/checkout"
            className="inline-block text-center w-full py-3 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-sky-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-offset-white"
          >
            Proceed to Checkout
          </Link>

          <button
            onClick={() => store.dispatch(clearCart())}
            aria-label="Clear all items from cart"
            className="w-full py-2 text-xs text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-lg"
          >
            Clear cart
          </button>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-4 flex items-center justify-center gap-4">
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
    </aside>
  )
}

// ─── Cart Page ─────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items } = useCartSelector()
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  if (items.length === 0) {
    return (
      <main
        aria-labelledby="empty-cart-heading"
        className="min-h-[calc(100vh-730px)] bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-lg text-center py-16"
        >
          <Link
            href="/"
            aria-label="Boys & Girls Club — go to home page"
            className="inline-flex h-20 sm:h-24 mb-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-neutral-950 rounded-lg"
          >
            <Picture
              src="/images/vertical-logo-light.png"
              alt=""
              className="dark:hidden block w-auto h-full"
              priority
            />
            <Picture src="/images/vertical-logo-dark.png" alt="" className="dark:block hidden w-auto h-full" priority />
          </Link>

          <div className="relative mx-auto w-24 h-24 mb-8" aria-hidden="true">
            <div className="absolute inset-0 rounded-full bg-sky-100 dark:bg-sky-500/10" />
            <div className="absolute inset-3 rounded-full bg-sky-50 dark:bg-sky-500/5 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-sky-400 dark:text-sky-500" />
            </div>
          </div>

          <h1 id="empty-cart-heading" className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            Your cart is empty
          </h1>
          <p className="text-base text-neutral-500 dark:text-neutral-400 mb-10 leading-relaxed max-w-sm mx-auto">
            You haven't added any tickets yet. Browse our upcoming events and reserve your spot.
          </p>

          <div className="flex flex-col min-[400px]:flex-row gap-3 justify-center mb-14">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-sky-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
            >
              <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
              Browse Events
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-semibold rounded-xl transition-colors border border-neutral-200 dark:border-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
            >
              <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
              Go Home
            </Link>
          </div>

          <ul aria-label="Why book with us" className="grid grid-cols-3 gap-3 list-none p-0 m-0">
            {[
              { icon: Ticket, label: 'Easy Booking' },
              { icon: CreditCard, label: 'Secure Payment' },
              { icon: Sparkles, label: 'Great Events' }
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
              >
                <Icon className="w-5 h-5 text-sky-500" aria-hidden="true" />
                <span className="text-[10px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </main>
    )
  }

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
            <AnimatePresence mode="popLayout">
              <ul role="list" aria-label="Items in your cart" className="space-y-3 list-none p-0 m-0">
                {items.map((item, index) => (
                  <li key={item.ticketId}>
                    <CartItemRow item={item} index={index} />
                  </li>
                ))}
              </ul>
            </AnimatePresence>

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
