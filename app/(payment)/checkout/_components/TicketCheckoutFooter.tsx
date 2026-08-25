import Link from 'next/link'
import { Lock } from 'lucide-react'

export function TicketCheckoutFooter() {
  return (
    <div className="px-4 sm:px-6 md:px-12 py-4 border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500">
          <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span>Payments secured by Stripe</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          <Link
            href="/privacy-policy"
            className="text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            Need help?
          </Link>
        </div>

        <p className="text-xs text-neutral-400 dark:text-neutral-600 w-full sm:w-auto">
          Boys &amp; Girls Club of Lynn is a 501(c)(3) nonprofit.
        </p>
      </div>
    </div>
  )
}
