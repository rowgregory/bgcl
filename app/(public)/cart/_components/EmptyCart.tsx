import Picture from '@/components/_shared/Picture'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, CreditCard, Home, ShoppingCart, Sparkles, Ticket } from 'lucide-react'

export function EmptyCart() {
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
          <Picture src="/images/vertical-logo-light.png" alt="" className="dark:hidden block w-auto h-full" priority />
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
              <span className="text-[10px] sm:text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </main>
  )
}
