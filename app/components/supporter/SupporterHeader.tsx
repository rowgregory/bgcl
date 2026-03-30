import { useSession } from 'next-auth/react'
import { MotionLink } from '../common/MotionLink'
import Picture from '../common/Picture'
import { Rocket, ShoppingCart } from 'lucide-react'
import LogoutButton from '../ui/buttons/LogoutButton'
import { useCartSelector } from '@/app/lib/store/store'

export function SupporterHeader() {
  const session = useSession()
  const role = session?.data?.user?.role
  const email = session.data?.user?.email
  const { items } = useCartSelector()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="px-6 md:px-8 lg:px-12 pb-4 pt-6 md:pt-8 dark:border-neutral-800 border-neutral-200 border-b">
      <div className="max-w-334 mx-auto flex items-center justify-between">
        <MotionLink
          href="/"
          aria-label="Boys & Girls Club of Lynn — home"
          className="flex space-x-3 w-28 h-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
        >
          <Picture
            src="/images/vertical-logo-light.png"
            alt="Boys & Girls Club of Lynn"
            className="dark:hidden block w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
            priority={true}
          />
          <Picture
            src="/images/vertical-logo-dark.png"
            alt="Boys & Girls Club of Lynn"
            className="dark:block hidden w-full h-full cursor-pointer hover:opacity-80 transition-opacity object-contain"
            priority={true}
          />
        </MotionLink>
        <div className="flex items-center gap-x-3">
          {/* Profile */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 dark:bg-neutral-900 dark:border-neutral-800 bg-neutral-100 border-neutral-200 border rounded-lg">
            <div
              className="shrink-0 w-6 h-6 rounded-full bg-sky-600 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="text-white text-xs font-bold leading-none">{(email?.[0] ?? '?').toUpperCase()}</span>
            </div>
            <p className="text-xs font-medium dark:text-neutral-400 text-neutral-600 max-w-40 truncate">{email}</p>
          </div>

          {/* Cart */}
          <MotionLink
            href={items?.length > 0 ? '/checkout' : '/cart'}
            aria-label={`View cart — ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 bg-neutral-100 border-neutral-200 hover:bg-neutral-200 border rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <ShoppingCart className="w-5 h-5 dark:text-neutral-400 text-neutral-600" aria-hidden="true" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-sky-600 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none"
                aria-hidden="true"
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </MotionLink>

          {(role === 'ADMIN' || role === 'PROGRAM' || role === 'SUPERUSER') && (
            <MotionLink
              href="/auth/login"
              aria-label="Go to admin dashboard"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 bg-neutral-200 border-neutral-300 hover:bg-neutral-300 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Rocket className="w-5 h-5 dark:text-zinc-400 text-neutral-700" aria-hidden="true" />
            </MotionLink>
          )}

          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
