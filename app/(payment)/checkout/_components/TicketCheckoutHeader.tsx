import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Picture from '@/components/_shared/Picture'
import { ArrowLeft, User } from 'lucide-react'
import { useCartStore } from '@/stores/useCartStore'

export function TicketCheckoutHeader() {
  const session = useSession()
  const items = useCartStore((s) => s.items)
  const eventId = items?.[0]?.eventId ?? null

  const backHref = eventId ? `/events/${eventId}` : '/cart'
  const backLabel = eventId ? 'Back to event' : 'Back to cart'

  return (
    <div className="px-4 sm:px-6 md:px-12 py-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <Link href="/" className="flex w-28 sm:w-36 h-auto shrink-0">
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

            <span className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 shrink-0 hidden sm:block" aria-hidden="true" />

            <h1 className="text-lg sm:text-xl font-bold dark:text-white text-neutral-900 shrink-0">Checkout</h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded shrink-0"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>

            {session?.data?.user && (
              <Link
                href="/supporter/overview"
                className="flex items-center gap-2 min-w-0 group"
                title={session.data.user.email ?? undefined}
              >
                <div className="w-7 h-7 rounded-full bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center shrink-0 group-hover:bg-sky-500/20 dark:group-hover:bg-sky-500/30 transition-colors">
                  <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate hidden md:inline max-w-40">
                  {session.data.user.email}
                </span>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
