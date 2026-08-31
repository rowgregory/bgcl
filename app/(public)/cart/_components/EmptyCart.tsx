import Link from 'next/link'
import { motion } from 'framer-motion'
import Picture from '@/components/_shared/Picture'

export function EmptyCart({ notice }: { notice?: string }) {
  return (
    <main
      aria-labelledby="empty-cart-heading"
      className="flex-1 flex items-center justify-center px-6 py-20 bg-white dark:bg-neutral-950"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm text-center"
      >
        <Link
          href="/"
          aria-label="Boys and Girls Club of Lynn, home"
          className="inline-flex h-16 mb-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-neutral-950 rounded"
        >
          <Picture src="/images/vertical-logo-light.png" alt="" className="dark:hidden block w-auto h-full" priority />
          <Picture src="/images/vertical-logo-dark.png" alt="" className="dark:block hidden w-auto h-full" priority />
        </Link>

        <h1 id="empty-cart-heading" className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Your cart is empty
        </h1>

        <p
          className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed"
          role={notice ? 'status' : undefined}
        >
          {notice || 'Browse our upcoming events and reserve your spot.'}
        </p>

        <div className="mt-8 flex items-center justify-center gap-6">
          <Link
            href="/events"
            className="text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            Browse events
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-neutral-400 dark:text-neutral-600 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            Go home
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
