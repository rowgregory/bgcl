import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Picture from '../../../components/common/Picture'
import { ArrowLeft, User } from 'lucide-react'
import { useCartSelector, useUiSelector } from '@/app/lib/store/store'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'

export function TicketCheckoutHeader() {
  const session = useSession()
  const { items } = useCartSelector()
  const { soundOn } = useUiSelector()
  const eventId = items?.[0]?.eventId ?? null
  const { play } = useSoundEffect('/sound-effects/casino-1.mp3', soundOn)

  return (
    <div className="px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col space-y-4 sm:space-y-5"
        >
          {/* Logo + session */}
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex w-36 sm:w-48 md:w-60 h-auto shrink-0">
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

            {session?.data?.user && (
              <Link href="/supporter/overview" className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                </div>
                <div className="min-w-0 hidden sm:block">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Signed in as</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white leading-none truncate">
                    {session.data.user.email}
                  </p>
                </div>
              </Link>
            )}
          </div>

          {/* Heading */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back to Cart
              </Link>

              {eventId && (
                <>
                  <span className="text-neutral-300 dark:text-neutral-600" aria-hidden="true">
                    ·
                  </span>
                  <Link
                    onClick={() => play()}
                    href={`/events/${eventId}`}
                    className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    Back to Event
                  </Link>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-neutral-900 leading-tight">
              Checkout
            </h1>
            <p className="text-sm sm:text-base md:text-lg dark:text-neutral-400 text-neutral-600 leading-relaxed">
              Complete your order securely below.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
