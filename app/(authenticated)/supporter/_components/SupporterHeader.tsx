import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import Picture from '@/components/_shared/Picture'
import LogoutButton from '@/components/_shared/LogoutButton'
import { useCartStore, useCartCount, useCartHasHydrated } from '@/stores/useCartStore'

export function SupporterHeader() {
  const session = useSession()
  const role = session?.data?.user?.role
  const email = session.data?.user?.email

  const hasItems = useCartStore((s) => s.items.length > 0)
  const storedCount = useCartCount()
  const hasHydrated = useCartHasHydrated()

  // The server has no access to the stored cart, so render it empty until
  // rehydration lands rather than flashing the wrong count
  const cartCount = hasHydrated ? storedCount : 0

  const isStaff = role === 'ADMIN' || role === 'PROGRAM' || role === 'SUPERUSER'

  return (
    <header className="sticky top-0 z-10 h-14 px-6 lg:px-8 flex items-center border-b border-neutral-200 dark:border-neutral-800 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Boys and Girls Club of Lynn, home"
          className="flex shrink-0 w-16 h-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
        >
          <Picture
            src="/images/vertical-logo-light.png"
            alt="Boys & Girls Club of Lynn"
            className="dark:hidden block w-full h-full object-contain hover:opacity-80 transition-opacity"
            priority
          />
          <Picture
            src="/images/vertical-logo-dark.png"
            alt="Boys & Girls Club of Lynn"
            className="dark:block hidden w-full h-full object-contain hover:opacity-80 transition-opacity"
            priority
          />
        </Link>

        <div className="flex items-center gap-4 min-w-0">
          {isStaff && (
            <Link
              href={role === 'PROGRAM' ? '/admin/job-applications' : '/admin/dashboard'}
              className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0 hidden sm:inline"
            >
              Admin
            </Link>
          )}

          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate hidden sm:inline max-w-40">
            {email}
          </span>

          <Link
            href={hasHydrated && hasItems ? '/checkout' : '/cart'}
            aria-label={`View cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            className="relative p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 shrink-0"
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />

            {cartCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sky-600 text-white text-[10px] font-medium rounded-full flex items-center justify-center leading-none tabular-nums"
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
