import Link from 'next/link'
import { Menu, ShoppingCart, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useIsAtTop } from '@/lib/hooks/useIsAtTop'
import GoogleTranslate from './GoogleTranslate'
import { mainNavigationLinks } from '@/lib/constants/navigation.constants'
import Picture from '@/components/_shared/Picture'
import { usePreferencesStore } from '@/stores/usePreferencesStore'
import { useNavigationStore } from '@/stores/useNavigationStore'
import { useCartStore } from '@/stores/useCartStore'

export default function Header() {
  const { data, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const isAtTop = useIsAtTop()
  const isOpen = useNavigationStore((s) => s.mobileNavigation)
  const { items } = useCartStore()
  const isSpanish = usePreferencesStore((s) => s.isSpanish)

  const getLaunchPath = () => {
    if (status !== 'authenticated') return '/auth/login'
    return ['ADMIN', 'SUPERUSER'].includes(data?.user?.role ?? '')
      ? '/admin/dashboard'
      : data?.user?.role === 'PROGRAM'
        ? '/program/job-applications'
        : '/supporter/overview'
  }

  const handleLaunchApp = () => router.push(getLaunchPath())

  const getVisibilityClass = (priority: number) => {
    switch (priority) {
      case 1:
        return 'hidden lg:block' // always visible in nav range
      case 2:
        return 'hidden lg-2:block' // visible from 1100px
      case 3:
        return 'hidden lg-3:block' // visible from 1160px
      case 4:
        return 'hidden xl:block' // visible from 1280px
      case 5:
        return 'hidden 1xl:block' // visible from 1336px
      case 6:
        return 'hidden xl-2:block' // visible from 1380px
      case 7:
        return 'hidden 2xl:block' // visible from 1536px — first to disappear
      default:
        return 'hidden lg:block'
    }
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:px-4 focus-visible:py-2 focus-visible:bg-sky-600 focus-visible:text-white focus-visible:font-semibold focus-visible:rounded-lg focus-visible:shadow-lg"
      >
        Skip to main content
      </a>
      {/* Top Bar */}
      <header
        role="banner"
        className={`w-full mx-auto dark:bg-neutral-900 dark:border-neutral-700 bg-neutral-50 border-neutral-200 border-b relative z-100 px-4 sm:px-6 lg:px-8 py-3`}
      >
        <div className="max-w-375 flex items-center justify-between mx-auto">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <GoogleTranslate />
            <div className="hidden sm:flex items-center space-x-4 lg:space-x-6 dark:text-neutral-400 text-neutral-600 text-sm">
              <div>
                Phone:{' '}
                <a
                  href="tel:+17815931772"
                  className="dark:text-white text-neutral-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
                >
                  781 593 1772
                </a>
              </div>
              <div className="hidden md:block">
                Address: <span className="dark:text-white text-neutral-900">25 N Common St, Lynn, MA 01902</span>
              </div>
              <div className="hidden lg:block">
                Tax ID: <span className="dark:text-white text-neutral-900">04-2103924</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/cart"
              aria-label={`Open cart, ${items?.length} item${items?.length !== 1 ? 's' : ''}`}
              className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 shrink-0"
            >
              <ShoppingCart className="w-5 h-5 dark:text-neutral-400 text-neutral-500" aria-hidden="true" />
              {items?.length > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-sky-500 text-white text-[9px] font-bold rounded-full"
                >
                  {items?.length > 99 ? '99+' : items?.length}
                </span>
              )}
            </Link>
            <button
              onClick={handleLaunchApp}
              className="dark:text-neutral-300 dark:hover:text-white text-neutral-700 hover:text-neutral-900 text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
              aria-label="Launch the member app"
            >
              Launch App
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Bar */}
      <motion.nav
        className={`${pathname === '/' ? 'max-w-400' : ''} w-full mx-auto sticky top-0 dark:border-neutral-700 dark:bg-neutral-950 border-neutral-200 bg-white z-50 px-4 sm:px-6 lg:px-8`}
        animate={{
          paddingTop: isAtTop ? '18px' : '10px',
          paddingBottom: isAtTop ? '10px' : '10px'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-375 mx-auto flex items-center justify-between relative">
          {/* Burger Menu Button */}
          <button
            onClick={() => useNavigationStore.getState().openMobileNavigation()}
            className="block 2xl:hidden dark:text-neutral-300 dark:hover:text-white text-neutral-700 hover:text-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>

          <Link
            href="/"
            aria-label="Boys & Girls Club of Lynn - Home"
            className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 lg:relative lg:left-auto lg:translate-x-0 lg:top-auto lg:translate-y-0"
          >
            <motion.div
              className="overflow-hidden flex items-center justify-center"
              animate={{ height: isAtTop ? '48px' : '40px' }}
              initial={{ height: '48px' }}
              transition={{ duration: 0.3 }}
            >
              <Picture
                src="/images/vertical-logo-light.png"
                alt="Boys & Girls Club of Lynn"
                className="dark:hidden block w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                priority
              />
              <Picture
                src="/images/vertical-logo-dark.png"
                decorative
                className="dark:block hidden w-auto h-full cursor-pointer hover:opacity-80 transition-opacity"
                priority
              />
            </motion.div>
          </Link>

          <nav aria-label="Main navigation">
            <ul className={`flex items-center ${isSpanish ? 'gap-4' : 'gap-6'} list-none`}>
              {mainNavigationLinks.map((item) => (
                <li key={item.label} className={getVisibilityClass(item.priority)}>
                  <motion.div
                    animate={{
                      fontSize: isSpanish
                        ? isAtTop
                          ? '12px'
                          : '12px' // Hold at minimum 12px
                        : isAtTop
                          ? '13px'
                          : '12px'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      aria-current={item.href === pathname ? 'page' : undefined}
                      className={`${item.href === pathname ? 'dark:text-sky-500 text-sky-600' : 'dark:text-white text-neutral-900'} dark:hover:text-sky-400 hover:text-sky-600 transition-colors font-black whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Portal CTA ──────────────────────────────────────────── */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: isAtTop ? 1 : 0.92 }}
            transition={{ duration: 0.3 }}
            className="shrink-0"
          >
            <a
              href="https://parentportal.bgcl.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Parent Portal - opens in a new tab"
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-5 lg:px-8 py-2 sm:py-3 lg:py-4 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all shadow-lg shadow-sky-500/25 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-600 text-xs sm:text-sm"
            >
              {/* Icon only on 320–430, text from 430+ */}
              <svg
                className="w-4 h-4 sm:hidden shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Parent Portal</span>
            </a>
          </motion.div>
        </div>
      </motion.nav>
    </>
  )
}
