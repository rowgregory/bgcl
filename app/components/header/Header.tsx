import Link from 'next/link'
import { Menu, ShoppingBasket, X } from 'lucide-react'
import Picture from '../common/Picture'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { store, useApplicationSelector } from '@/app/lib/store/store'
import { setOpenMobileNavigation } from '@/app/lib/store/slices/appSlice'
import { motion } from 'framer-motion'
import { useIsAtTop } from '@/app/lib/hooks/useIsAtTop'
import GoogleTranslate from '../GoogleTranslate'
import { headerNavLinks } from '@/app/lib/constants/headerNavLinks'

export default function Header() {
  const { data, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const isAtTop = useIsAtTop()
  const { mobileNavigation, isSpanish } = useApplicationSelector()

  const getLaunchPath = () => {
    if (status !== 'authenticated') return '/auth/login'
    return ['ADMIN', 'SUPERUSER'].includes(data?.user?.role ?? '')
      ? '/admin/mission-control'
      : data?.user?.role === 'PROGRAM'
        ? '/program/airlock'
        : '/supporter/overview'
  }

  const handleLaunchApp = () => router.push(getLaunchPath())

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-9999 focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      {/* Top Bar */}
      <header
        role="banner"
        className={`${pathname === '/' ? 'max-w-334' : ''} w-full mx-auto dark:bg-neutral-900 dark:border-neutral-700 bg-neutral-50 border-neutral-200 border-b relative z-100 px-4 sm:px-6 lg:px-8 py-3`}
      >
        <div className="max-w-334 flex items-center justify-between mx-auto">
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
              aria-label="View shopping cart"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            >
              <ShoppingBasket
                className="w-4 h-4 dark:text-neutral-300 dark:hover:text-white text-neutral-700 hover:text-neutral-900"
                aria-hidden="true"
              />
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

      <motion.nav
        className={`${pathname === '/' ? 'max-w-334' : ''} w-full mx-auto sticky top-0 dark:border-neutral-700 dark:bg-neutral-950 border-neutral-200 bg-white z-50 px-4 sm:px-6 lg:px-8 1xl:rounded-br-xl 1xl:rounded-bl-xl`}
        animate={{
          paddingTop: isAtTop ? '18px' : '10px',
          paddingBottom: isAtTop ? '10px' : '10px'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-334 mx-auto flex items-center justify-between">
          {/* Burger Menu Button */}
          <button
            onClick={() => store.dispatch(setOpenMobileNavigation())}
            className="block 2xl:hidden dark:text-neutral-300 dark:hover:text-white text-neutral-700 hover:text-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileNavigation}
            aria-controls="mobile-navigation"
          >
            {mobileNavigation ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>

          <Link
            href="/"
            aria-label="Boys & Girls Club of Lynn - Home"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
          >
            <motion.div
              className="flex items-center space-x-3"
              initial={{ scale: 1 }}
              animate={{ scale: isAtTop ? 1 : 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="overflow-hidden flex items-center justify-center"
                initial={{ height: '56px' }}
                animate={{ height: isAtTop ? '56px' : '48px' }}
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
            </motion.div>
          </Link>

          <nav aria-label="Main navigation">
            <ul className={`hidden 2xl:flex items-center ${isSpanish ? 'space-x-4' : 'space-x-6'} list-none`}>
              {headerNavLinks.map((item) => (
                <li key={item.label}>
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

          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            animate={{ scale: isAtTop ? 1 : 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <a
              href="https://parentportal.bgcl.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Parent Portal - opens in a new tab"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-500/25 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-600"
            >
              <span className="hidden md:inline">Parent Portal</span>
              <span className="md:hidden" aria-hidden="true">
                Portal
              </span>
            </a>
          </motion.div>
        </div>
      </motion.nav>
    </>
  )
}
